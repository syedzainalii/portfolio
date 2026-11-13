import Header from "./Components/Header";
import About from "./Components/About";
import Skills from "./Components/Skills";
import Services from "./Components/Services";
import Work from "./Components/Work";
import Experience from "./Components/Experience";
import Certification from "./Components/Certification";
import Contact from "./Components/Contact";

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