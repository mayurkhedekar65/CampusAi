from django.urls import path
from .views import AskAIView, SaveHistoryView, ListHistoryView

urlpatterns = [
    path('ask/', AskAIView.as_view(), name='ask_ai'),
    path('history/save/', SaveHistoryView.as_view(), name='save_history'),
    path('history/', ListHistoryView.as_view(), name='list_history'),
]
