import { useApi } from "@/hooks/useApi";
import { priority, status } from "@/lib/constants";
import { Project } from "@/types";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../ui/button";

const ProjectDetails = () => {
  const { fetchWithAuth } = useApi();
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  useEffect(() => {
    fetchWithAuth(`/projects/${id}/`).then((data) => {
      setProject(data);
    });
  }, [fetchWithAuth, id]);

  if (!project) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col gap-8">
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
      <div className="flex gap-2">
        <Link to={`/edit-project/${project.id}`}>
          <Button variant="outline">Edit</Button>
        </Link>
        <Button variant="destructive">Delete</Button>
      </div>
    </div>
  );    
};
export default ProjectDetails;
