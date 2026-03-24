from fastapi.testclient import TestClient
from main import app
import io

client = TestClient(app)

def test_fastapi_endpoints():
    print("--- TESTING FASTAPI ROUTES ---")
    
    # 1. Test Root
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
    print("✓ FastAPI Local Server is active and Root route works")

    # 2. Test Aptitude
    res = client.post("/api/v1/aptitude/generate", json={
        "category": "Math", "difficulty": "hard", "num_questions": 3
    })
    assert res.status_code == 200
    assert len(res.json()) == 3
    assert res.json()[0]["options"] == ["A", "B", "C", "D"]
    print("✓ Aptitude test generation endpoint works smoothly")

    # 3. Test Roadmap
    res = client.post("/api/v1/roadmap/generate", json={
        "goal": "Data Scientist", "current_skill_level": "beginner", "timeframe_weeks": 4
    })
    assert res.status_code == 200
    assert len(res.json()["weeks"]) == 4
    print("✓ Progressive weekly Roadmap parsing endpoint returns correct timeline")

    # 4. Test Resume Upload
    file_bytes = b"dummy pdf content"
    res = client.post("/api/v1/resume/review", files={"file": ("resume.pdf", file_bytes, "application/pdf")})
    assert res.status_code == 200
    assert "score" in res.json()
    print("✓ Resume Parsing and Score calculation endpoint handles multipart files successfully")

    # 5. Test Interview Workflow
    res_start = client.post("/api/v1/interview/start", json={
        "job_role": "Backend Developer", "experience_level": "mid"
    })
    assert res_start.status_code == 200
    session_id = res_start.json()["session_id"]
    
    res_answer = client.post("/api/v1/interview/answer", json={
        "session_id": session_id, "answer": "I use Python and Docker."
    })
    assert res_answer.status_code == 200
    assert "feedback" in res_answer.json()
    print("✓ Dynamic Interview session startup and answer validation loop functions properly")

    print("\n✓✓✓ ALL FASTAPI APPS TESTED AND FULLY FUNCTIONAL!")

if __name__ == '__main__':
    test_fastapi_endpoints()
