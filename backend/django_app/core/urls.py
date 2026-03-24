from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/academics/', include('academics.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/notes/', include('notes.urls')),
    path('api/ai/', include('ai_module.urls')),
    path('api/notifications/', include('notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
