import { workData } from "@/assets/assets";
import { notFound } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";

function getSlug(title) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = workData.find((item) => getSlug(item.title) === slug);

  return {
    title: project?.title || "Project",
    description: project?.description || "Project details.",
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = workData.find((item) => getSlug(item.title) === slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
