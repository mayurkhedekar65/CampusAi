from rest_framework import status, views, permissions, generics
from rest_framework.response import Response
from .models import FeatureHistory
from .serializers import FeatureHistorySerializer
import os
import tempfile
from groq import Groq
from markitdown import MarkItDown
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GROQ_API_KEY")


def _get_student_context(user):
    """Build a rich academic profile string for the student."""
    try:
        from academics.models import Subject
        from attendance.models import Attendance, AttendanceSession

        lines = [
            f"## Student Profile",
            f"- **Name:** {user.name}",
            f"- **Email:** {user.email}",
            f"- **Department:** {user.department.name if user.department else 'N/A'}",
            f"- **Semester:** {user.semester if user.semester else 'N/A'}",
            f"- **CGPA:** {user.cgpa if hasattr(user, 'cgpa') and user.cgpa else 'N/A'}",
            f"- **Credits Earned:** {user.credits if hasattr(user, 'credits') and user.credits else 'N/A'}",
        ]

        # Subjects this semester
        if user.department and user.semester:
            subjects = Subject.objects.filter(
                department=user.department, semester=user.semester
            ).select_related('teacher')
            if subjects.exists():
                lines.append("\n## Enrolled Subjects This Semester")
                for sub in subjects:
                    teacher_name = sub.teacher.name if sub.teacher else "Not assigned"
                    # Attendance for this subject
                    total_sessions = AttendanceSession.objects.filter(subject=sub).count()
                    attended = Attendance.objects.filter(
                        student=user, session__subject=sub
                    ).count()
                    pct = round(attended / total_sessions * 100, 1) if total_sessions > 0 else 0
                    status_label = "✅ Good" if pct >= 75 else "⚠️ Low"
                    lines.append(
                        f"- **{sub.name}** | Teacher: {teacher_name} | "
                        f"Attendance: {attended}/{total_sessions} sessions ({pct}%) {status_label}"
                    )
            else:
                lines.append("\n## Enrolled Subjects: None assigned yet")

        # Overall attendance
        att_records = Attendance.objects.filter(student=user)
        total_att = att_records.count()
        if total_att > 0:
            lines.append(f"\n## Overall Attendance: {total_att} sessions attended")

        return "\n".join(lines)
    except Exception:
        return f"Student: {user.name}, Dept: {getattr(user, 'department', 'N/A')}"


class AskAIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        question = request.data.get('question', '').strip()
        uploaded_file = request.FILES.get('document')

        if not question:
            return Response({'error': 'Question is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not API_KEY or API_KEY == "paste_your_api_key_here":
            return Response(
                {'error': 'Groq API key not configured. Please add GROQ_API_KEY to .env file.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Build student academic context
        user = request.user
        student_context = ""
        if user.role == 'STUDENT':
            student_context = _get_student_context(user)

        # Process uploaded document if provided
        document_context = ""
        if uploaded_file:
            try:
                suffix = os.path.splitext(uploaded_file.name)[1].lower() or '.tmp'
                with tempfile.NamedTemporaryFile(delete=False, suffix=suffix, mode='wb') as temp_file:
                    for chunk in uploaded_file.chunks():
                        temp_file.write(chunk)
                    temp_file_path = temp_file.name

                extracted_text = ""
                md_error = None

                # Strategy 1: markitdown[all] (handles PDF, DOCX, PPTX, XLSX, TXT, etc.)
                try:
                    md = MarkItDown()
                    result = md.convert(temp_file_path)
                    extracted_text = result.text_content or ""
                except Exception as e:
                    extracted_text = ""
                    md_error = str(e)

                # Strategy 2: direct pypdf fallback for PDFs
                if not extracted_text.strip() and suffix == '.pdf':
                    try:
                        import pypdf
                        reader = pypdf.PdfReader(temp_file_path)
                        pages = [page.extract_text() or "" for page in reader.pages]
                        extracted_text = "\n\n".join(pages)
                    except Exception as e:
                        if not md_error:
                            md_error = str(e)

                os.remove(temp_file_path)

                if not extracted_text or not str(extracted_text).strip():
                    err_msg = md_error if md_error else 'Try a text-based file instead of images or scanned documents.'
                    return Response({'error': err_msg}, status=status.HTTP_400_BAD_REQUEST)

                safe_text = str(extracted_text)
                document_context = f"\n\n---\n## Uploaded Document: {uploaded_file.name}\n{safe_text[:6000]}"  # cap at 6000 chars

            except Exception as e:
                return Response({'error': f'Error reading document: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


        try:
            client = Groq(api_key=API_KEY)

            system_prompt = f"""You are CampusAI, a highly personalized and intelligent academic assistant for a student at a college management system.

You have access to the student's full academic profile below. Use this context to give **personalized, accurate answers** tailored specifically to this student.

{student_context if student_context else "You are assisting a staff member."}

---
## Your Response Rules (VERY IMPORTANT):
1. Always respond in **structured Markdown format**.
2. Use **headings** (##, ###) to organize sections.
3. Use **bullet points** or **numbered lists** for multi-step answers.
4. Use `code blocks` for formulas, code, or technical content.
5. Use **bold** for key terms and important points.
6. End every answer with a short **"💡 Key Takeaway"** section.
7. If the student asks about their attendance, CGPA, subjects, or performance — use their profile data above.
8. If they ask "Summarize my notes" or "what topics are in my uploaded document" — use the uploaded document content.
9. Be encouraging, supportive, and academic in tone.
10. Keep answers concise but thorough. No unnecessary filler.
"""

            user_message = question
            if document_context:
                user_message += document_context

            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.4,
                max_completion_tokens=2048,
            )

            answer = chat_completion.choices[0].message.content
            return Response({'answer': answer}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SaveHistoryView(generics.CreateAPIView):
    serializer_class = FeatureHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ListHistoryView(generics.ListAPIView):
    serializer_class = FeatureHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = FeatureHistory.objects.filter(user=self.request.user).order_by('-created_at')
        feature_type = self.request.query_params.get('feature_type')
        if feature_type:
            qs = qs.filter(feature_type=feature_type.upper())
        return qs
