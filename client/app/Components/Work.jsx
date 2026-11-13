"use client";

import { workData, assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import SectionPageLink from "./SectionPageLink";

const Work = ({ preview = false }) => {
  return (
    <section
      id="work"
      className="w-full px-[12%] py-20"
    >
      {/* Heading */}
      <h4 className="text-center mb-2 text-xl font-Ovo">
        My Portfolio
      </h4>

      <h2 className="text-center text-4xl sm:text-5xl font-Ovo">
        My latest work
      </h2>

      <p className="text-center max-w-2xl mx-auto mt-5 mb-14 font-Ovo text-gray-600">
        Here are a few projects I’ve worked on recently. Want to see more?
      </p>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(preview ? workData.slice(0, 4) : workData).map((project, index) => {
          const slug = project.title
            .toLowerCase()
            .replace(/\s+/g, "-");

          return (
            <Link href={`/work/${slug}`} key={index} className="group">
              <div
                className="aspect-square bg-cover bg-center rounded-xl relative cursor-pointer shadow-md transition-all duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${project.bgImage})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 rounded-xl" />

                {/* Card Info */}
                <div className="bg-white w-[85%] rounded-md absolute bottom-5 left-1/2 -translate-x-1/2 py-3 px-4 flex items-center justify-between duration-500 group-hover:bottom-7 shadow-md">
                  <div className="overflow-hidden">
                    <h3 className="font-semibold truncate text-gray-900">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      {project.description}
                    </p>
                  </div>

                  <div className="border rounded-full border-gray-400 w-9 aspect-square flex items-center justify-center shadow-[2px_2px_0_#000] group-hover:bg-[#44CF6C] group-hover:border-[#44CF6C] transition-all duration-300">
                    <Image
                      src={assets.send_icon}
                      alt=""
                      className="w-4 group-hover:brightness-0"
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {preview && <SectionPageLink href="/work" label="Show more" />}
    </section>
  );
};

export default Work;