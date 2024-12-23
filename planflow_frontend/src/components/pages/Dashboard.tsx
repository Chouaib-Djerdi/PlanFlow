import { Link } from "react-router-dom";
import ProjectCard from "../cards/ProjectCard";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { Project } from "@/types";

export default function Dashboard() {
  const { fetchWithAuth } = useApi();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchWithAuth("/projects/").then((data) => {
      setProjects(data);
    });
  }, [fetchWithAuth]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <Link to={`/projects/${project.id}`} key={index}>
            <ProjectCard title={project.title} />
          </Link>
        ))}
      </div>
    </div>
  );
}
