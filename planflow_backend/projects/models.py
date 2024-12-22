from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    PRIORITY_CHOICES = [
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
    ]
    STATUS_CHOICES = [
        ("not_started", "Not Started"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    priority = models.CharField(
        max_length=20, choices=PRIORITY_CHOICES, default="medium"
    )
    category = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="not_started"
    )

    image1 = models.ImageField(upload_to="projects/images/", null=True, blank=True)
    image2 = models.ImageField(upload_to="projects/images/", null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["-start_date"]
