from rest_framework import status, views, permissions, generics
from rest_framework.response import Response
from .models import FeatureHistory
from .serializers import FeatureHistorySerializer

class AskAIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        question = request.data.get('question')
        if not question:
            return Response({'error': 'Question is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Here you would integrate with an external AI API such as OpenAI or Gemini
        # Example pseudo-code:
        # ai_response = openai.ChatCompletion.create(model="gpt-4", messages=[{"role": "user", "content": question}])
        
        # For now, returning a mock response
        mock_response = f"This is an AI generated response answering your question: '{question}'. Integration with OpenAI/Gemini should be placed here."
        return Response({'answer': mock_response}, status=status.HTTP_200_OK)

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
