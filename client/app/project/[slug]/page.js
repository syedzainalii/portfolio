import { workData } from "@/assets/assets";
import { notFound } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";

export function generateStaticParams() {
  return workData.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = workData.find((item) => item.slug === slug);

  return {
    title: project?.title || "Project",
    description: project?.description || "Project details.",
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = workData.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
