import About from "../Components/About";

export const metadata = {
  title: "About",
  description:
    "About Syed Zain Ali, a Mechanical Engineering student at NED UET with industry training at SSGC.",
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      <About />
    </div>
  );
}
