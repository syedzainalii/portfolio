import Work from "../Components/Work";

export const metadata = {
  title: "My Work",
  description:
    "Selected CAD, FEA simulation, frontend, data visualization, and video projects by Syed Zain Ali.",
};

export default function WorkPage() {
  return (
    <div className="pt-4">
      <Work />
    </div>
  );
}
