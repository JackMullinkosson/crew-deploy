"use client";

import { ClipLoader } from "react-spinners";
import { VideoCameraIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import { useRouter } from "next/navigation";

export const ProjectBoxes = ({ projects, projectsLoading }) => {
  const router = useRouter();

  return (
    <>
      {projectsLoading ? (
        <div className="py-12 px-24">
          <ClipLoader size={40} color={"black"} />
        </div>
      ) : (
        <>
          {projects.map((i) => {
            return (
              <div
                className="border-4 border-black-500 border-4 py-4 pl-4 rounded hover:cursor-pointer hover:bg-gray-100"
                key={String(i.id)}
                onClick={() => router.push(`/project/${i.id}`)}
              >
                <div className="flex flex-row items-center mb-4 text-center">
                  <h3 className="text-xl font-bold dark:text-white mr-4">
                    {i.name}
                  </h3>
                  <VideoCameraIcon className="h-6 w-6" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  {moment(i.startDate).format("MMMM Do YYYY")} -{" "}
                  {moment(i.endDate).format("MMMM Do YYYY")}
                </p>
              </div>
            );
          })}
        </>
      )}
    </>
  );
};
