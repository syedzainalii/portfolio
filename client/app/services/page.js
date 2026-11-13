import Services from "../Components/Services";

export const metadata = {
  title: "Services",
  description:
    "CAD modeling, FEA simulation, programming, web design, data visualization, and video editing services.",
};

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <Services />
    </div>
  );
}
