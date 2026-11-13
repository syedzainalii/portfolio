import { serviceData } from "@/assets/assets";
import { notFound } from "next/navigation";
import ServiceDetailClient from "./ServiceDetailClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = serviceData.find((item) => item.link === slug);

  return {
    title: service?.title || "Service",
    description: service?.description || "Service details.",
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = serviceData.find((item) => item.link === slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetailClient service={service} />;
}
