"use client";
import React, { useState } from "react";
import moment from "moment";
import { useGlobalContext } from "../../Context/store";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const ProjectDetails = () => {
  const { project } = useGlobalContext();
  const [isViewingDetails, setIsViewingDetails] = useState(false);

  function handleViewClick() {
    if (isViewingDetails) {
      setIsViewingDetails(false);
    } else setIsViewingDetails(true);
  }

  return (
    <>
      <div className="w-3/4 py-6 flex flex-row items-center justify-evenly">
        <h1 className="text-6xl font-bold">{project.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 ml-6 w-1/2">
          {moment(project.startDate).format("MMMM Do YYYY")} -{" "}
          {moment(project.endDate).format("MMMM Do YYYY")}
        </p>
        <p onClick={() => handleViewClick()} className="hover:cursor-pointer">
          See Project Details
          {isViewingDetails ? (
            <ChevronUpIcon className="h-6 w-6" />
          ) : (
            <ChevronDownIcon className="h-6 w-6" />
          )}
        </p>
      </div>
      {isViewingDetails ? (
        <>
          <div className="w-3/4 py-6 flex flex-row items-center shrink-0 grow-0 justify-between">
            <h4 className="text-xl text-gray-700 font-bold w-1/3">Logline:</h4>
            <p className="mr-0 ml-auto w-2/3">{project.logLine}</p>
          </div>
          {project.dayDetails.map((day, index) => {
            return (
              <>
                <div className="w-3/4 py-6 flex flex-row items-center justify-between shrink-0 grow-0">
                  <div className="flex flex-col justify-center items-center">
                    <h5 className="text-l font-bold text-gray-700">
                      Day {index + 1}
                    </h5>
                    <p>{moment(day.startTime).format("MMMM Do YYYY")}</p>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <h5 className="text-l font-bold text-gray-700">
                      Call Time:
                    </h5>
                    <p>{moment(day.startTime).format("LT")}</p>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <h5 className="text-l font-bold text-gray-700">
                      Wrap Time:
                    </h5>
                    <p>{moment(day.endTime).format("LT")}</p>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <h5 className="text-l font-bold text-gray-700">
                      Location:
                    </h5>
                    <p>{day.location}</p>
                  </div>
                </div>
              </>
            );
          })}
        </>
      ) : null}
    </>
  );
};

export default ProjectDetails;
