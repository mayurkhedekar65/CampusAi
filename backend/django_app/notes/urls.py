from django.urls import path
from .views import NotesUploadView, NotesListView

urlpatterns = [
    path('upload/', NotesUploadView.as_view(), name='upload_notes'),
    path('', NotesListView.as_view(), name='list_notes'),
]
