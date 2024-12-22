from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import ProjectSerializer
from .models import Project
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
import os


# Create your views here.
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)

    @action(detail=True, methods=["get"])
    def export_pdf(self, request, pk=None):
        project = self.get_object()
        template = get_template("project_detail_pdf.html")
        html = template.render({"project": project})

        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = (
            f'attachment; filename="project_{project.id}.pdf"'
        )

        pisa_status = pisa.CreatePDF(html, dest=response)
        if pisa_status.err:
            return Response({"detail": "Error generating PDF"}, status=500)

        return response
