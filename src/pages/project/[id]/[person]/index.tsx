/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import moment from "moment";
import ResponseButtons from "../../../../../Components/Project/Person/ResponseButtons";
import Confirmed from "../../../../../Components/Project/Person/Confirmed";
import Declined from "../../../../../Components/Project/Person/Declined";
import Toast from "../../../../../Components/Project/Person/Toast";
import { useRouter } from "next/router";
import { useGlobalContext } from "../../../../../Context/store";
import { ClipLoader } from "react-spinners";

interface CrewMemberProps {
  goToId: Number;
  roleId: Number;
  status: String;
}

export default function Page() {
  const { project, setProject } = useGlobalContext();
  const [crewMember, setCrewMember] = useState<CrewMemberProps>();
  const [projectLoading, setProjectLoading] = useState(true);
  const [personLoading, setPersonLoading] = useState(true);
  const router = useRouter();
  const { person, id } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
    getProjectById();
    getPersonById();
  }, [router.isReady]);

  async function getProjectById() {
    try {
      const res = await fetch(
        `${process.env.BASE_URL}/api/getProjectById/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        const resProject = await res.json();
        setProject(resProject);
      } else {
        return null;
      }
    } finally {
      setProjectLoading(false);
    }
  }

  async function getPersonById() {
    try {
      const res = await fetch(
        `${process.env.BASE_URL}/api/getPersonById/${person}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resPerson = await res.json();
      setCrewMember(resPerson);
    } finally {
      setPersonLoading(false);
    }
  }

  return (
    <>
      {projectLoading || personLoading ? (
        <div className="py-24 px-24">
          <ClipLoader size={35} color={"black"} />
        </div>
      ) : (
        <main className="flex justify-center px-16 flex-col py-12 lg:py-16 lg:px-24">
          {crewMember.status === "Confirmed" ? (
            <Toast status={crewMember.status} />
          ) : null}
          {crewMember.status === "Declined" ? (
            <Toast status={crewMember.status} />
          ) : null}
          <div className="w-3/4 py-6 flex flex-row items-center justify-evenly">
            <h1 className="text-6xl font-bold">{project.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 ml-6 w-1/2">
              {moment(project.startDate).format("MMMM Do YYYY")} -{" "}
              {moment(project.endDate).format("MMMM Do YYYY")}
            </p>
          </div>
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
                      Day {index + 1}:
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
          {crewMember.status !== "Confirmed" &&
          crewMember.status !== "Declined" ? (
            <ResponseButtons
              personId={person}
              project={project}
              ownerId={project.owner}
              roleId={crewMember.roleId}
              goToId={crewMember.goToId}
            />
          ) : null}
          {crewMember.status === "Confirmed" ? (
            <Confirmed
              project={project}
              ownerId={project.owner}
              roleId={crewMember.roleId}
              goToId={crewMember.goToId}
              personId={person}
            />
          ) : null}
          {crewMember.status === "Declined" ? <Declined /> : null}
        </main>
      )}
    </>
  );
}
