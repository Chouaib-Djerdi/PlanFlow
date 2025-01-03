import { useApi } from "@/hooks/useApi";
import { priority, status } from "@/lib/constants";
import { Project } from "@/types";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { fetchWithAuth } = useApi();
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  useEffect(() => {
    fetchWithAuth(`/projects/${id}/`).then((data) => {
      setProject(data);
    });
  }, [id]);

  async function handleDelete() {
    try {
      await fetchWithAuth(`/projects/${id}/`, {
        method: "DELETE",
      });
      console.log("Project deleted successfully");
      navigate("/"); // Redirect after successful deletion
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  }
  async function handleExport() {
    try {
      const blob = await fetchWithAuth(`/projects/${id}/export_pdf/`, {}, true); // Set raw to true
      const url = window.URL.createObjectURL(blob); // Create a URL for the blob
      window.open(url, "_blank"); // Open the file in a new tab
      window.URL.revokeObjectURL(url); // Revoke the URL after it's opened
    } catch (error) {
      console.error("Failed to export PDF", error);
    }
  }

  if (!project) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={handleExport}>
          Export PDF
        </Button>
        <Link to={`/edit-project/${project.id}`}>
          <Button variant="outline">Edit</Button>
        </Link>
        <Dialog>
          <DialogTrigger>
            <Button variant="destructive">Delete</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete this file from our servers?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="submit" onClick={handleDelete}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {
        // Display images if they exist
        project.image1 && (
          <img
            src={project.image1}
            alt="Project Image 1"
            className="w-full h-40 object-cover rounded-md"
          />
        )
      }
      {
        // Display images if they exist
        project.image2 && (
          <img
            src={project.image2}
            alt="Project Image 2"
            className="w-full h-40 object-cover rounded-md"
          />
        )
      }
      <h1 className="text-4xl font-bold">{project.title}</h1>
      <div>
        <p>
          <span className="font-bold">Start Date :</span> {project.start_date}
        </p>
        <p>
          <span className="font-bold">End Date :</span> {project.end_date}
        </p>
        <p>
          <span className="font-bold">Priority :</span>{" "}
          {priority.find((p) => p.value === project.priority)?.label}
        </p>
        <p>
          <span className="font-bold">Category :</span> {project.category}
        </p>
        <p>
          <span className="font-bold">Status :</span>{" "}
          {status.find((s) => s.value === project.status)?.label}
        </p>
      </div>
      <p>{project.description}</p>
    </div>
  );
};
export default ProjectDetails;
