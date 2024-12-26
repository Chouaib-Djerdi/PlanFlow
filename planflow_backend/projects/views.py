from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework import viewsets
from .serializers import ProjectSerializer
from .models import Project
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.conf import settings
import requests


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
        html = template.render(
            {
                "project": project,
            }
        )

        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = (
            f'attachment; filename="project_{project.id}.pdf"'
        )

        pisa_status = pisa.CreatePDF(html, dest=response)
        if pisa_status.err:
            return Response({"detail": "Error generating PDF"}, status=500)

        return response


@api_view(["POST"])
def generate_description(request):
    API_KEY = settings.HF_API_KEY
    # Using FLAN-T5 which is better at following instructions
    API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base"

    title = request.data.get("title")
    if not title:
        return Response({"error": "Title is required"}, status=400)

    # More specific prompt that guides the model better
    prompt = f"""Generate a professional project description:
    Project: {title}
    Requirements:
    - Describe the main purpose and goals
    - Keep it under 200 characters
    - Focus on practical aspects
    - Be specific and clear
    Description:"""

    headers = {"Authorization": f"Bearer {API_KEY}"}
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_length": 100,
            "min_length": 20,
            "do_sample": True,
            "temperature": 0.7,
            "top_p": 0.9,
            "repetition_penalty": 1.2,
        },
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()

        result = response.json()

        # Clean up the response
        description = result[0]["generated_text"]
        # Remove any potential prompt remnants
        description = description.replace(prompt, "").strip()
        # Remove any "Description:" text that might have been generated
        description = description.replace("Description:", "").strip()

        # Validate the response
        if len(description) < 10:  # If the description is too short
            return Response(
                {"error": "Generated description too short, please try again"},
                status=400,
            )

        return Response({"description": description})

    except requests.exceptions.RequestException as e:
        print(f"Error calling Hugging Face API: {str(e)}")
        return Response(
            {"error": f"Failed to generate description: {str(e)}"}, status=500
        )
