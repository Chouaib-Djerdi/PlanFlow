from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, generate_description
from django.urls import path

router = DefaultRouter()
router.register(r"projects", ProjectViewSet)

urlpatterns = [
    path(
        "projects/generate-description/",
        generate_description,
        name="generate-description",
    )
]

urlpatterns += router.urls
