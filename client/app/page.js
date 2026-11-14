import dynamic from "next/dynamic";
import Header from "./Components/Header";

const About = dynamic(() => import("./Components/About"), { ssr: true });
const Skills = dynamic(() => import("./Components/Skills"), { ssr: true });
const Services = dynamic(() => import("./Components/Services"), { ssr: true });
const Work = dynamic(() => import("./Components/Work"), { ssr: true });
const Experience = dynamic(() => import("./Components/Experience"), { ssr: true });
const Certification = dynamic(() => import("./Components/Certification"), { ssr: true });
const Contact = dynamic(() => import("./Components/Contact"), { ssr: true });

export const metadata = {
  title: { absolute: "Home | Syed Zain Ali" },
  description: "Mechanical Engineering student at NED UET, with experience in assembly and manufacturing at SSGC.",
};

export default function Home() {
  return (
    <>
      <Header />
      <About preview />
      <Skills preview />
      <Work preview />
      <Experience preview />
      <Services preview />
      <Certification preview />
      <Contact preview />
    </>
  );
}