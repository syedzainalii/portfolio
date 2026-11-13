import Certification from "../Components/Certification";

export const metadata = {
  title: "Certification",
  description:
    "Professional certifications in IT automation, project management, and data science.",
};

export default function CertificationPage() {
  return (
    <div className="pt-20">
      <Certification />
    </div>
  );
}
