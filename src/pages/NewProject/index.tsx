/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useGlobalContext } from "../../../Context/store";

const NewProjectForm = () => {
  const { user, isLoading, error } = useUser();
  const { dbUser, setDbUser } = useGlobalContext();
  const [projectName, setProjectName] = useState("");
  const [logLine, setLogLine] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dayDetails, setDayDetails] = useState<
    Array<{ startTime: Date; endTime: Date; location: string }>
  >([]);
  const [timeSelectors, setTimeSelectors] = useState<number[]>([]);
  const [callTimes, setCallTimes] = useState(
    Array(timeSelectors.length).fill(moment())
  );
  const [wrapTimes, setWrapTimes] = useState(
    Array(timeSelectors.length).fill(moment())
  );
  const [dayLengths, setDayLengths] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [postRequestNotReady, setPostRequestNotReady] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user && !error && !isLoading) {
      window.location.assign(`${process.env.BASE_URL}/api/auth/login`);
    }
  }, [user, error, isLoading]);

  useEffect(() => {
    if (projectName === "") return;
    setPostRequestNotReady(false);
  }, [projectName]);

  useEffect(() => {
    if (!user) return;
    getUserByEmail();
  }, [user]);

  useEffect(() => {
    const days = calculateDays(startDate, endDate);
    let newTimeSelectors = [];
    for (let i = 0; i < days; i++) {
      newTimeSelectors.push(i);
    }
    setTimeSelectors(newTimeSelectors);
  }, [startDate, endDate]);

  useEffect(() => {
    if (!callTimes.length) return;
    let newDayLengths = callTimes.map((call, index) => {
      if (call > wrapTimes[index]) {
        let nextDayWrap = wrapTimes[index].add(1, "days");
        let ms: number = Math.abs(nextDayWrap - call);
        let minutes = ms / (1000 * 60);
        let hours = `${Math.floor(minutes / 60)}`;
        let quarters = `${(Math.round(minutes % 60) / 60) * 100}`;
        if (quarters === "0") return hours;
        return `${hours}.${quarters.replace(/0$/, "")}`;
      }
      let ms: number = Math.abs(wrapTimes[index] - call);
      let minutes = ms / (1000 * 60);
      let hours = `${Math.floor(minutes / 60) % 24}`;
      let quarters = `${(Math.round(minutes % 60) / 60) * 100}`;
      if (quarters === "0") return hours;
      return `${hours}.${quarters.replace(/0$/, "")}`;
    });
    setDayLengths(newDayLengths);
  }, [callTimes, wrapTimes]);

  useEffect(() => {
    let newDayDetails = callTimes.map((call, index) => {
      return {
        startTime: call ? call.toDate() : undefined,
        endTime: wrapTimes[index] ? wrapTimes[index].toDate() : undefined,
        location: locations[index] ? locations[index] : "",
      };
    });
    setDayDetails(newDayDetails);
  }, [callTimes, wrapTimes, locations]);

  function calculateDays(firstDay: string, lastDay: string) {
    const start = new Date(firstDay);
    const end = new Date(lastDay);
    const diffTime = Math.abs(end.valueOf() - start.valueOf());
    const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  async function submitProject(e: React.FormEvent) {
    e.preventDefault();
    let res;
    try {
      setIsPosting(true);
      res = await fetch(`/api/createProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: projectName,
          ownerId: dbUser.id,
          logLine: logLine || "",
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          dayDetails: dayDetails,
        }),
      });
      if (res.status !== 200) {
        console.log("error creating project");
      }
    } catch (error) {
      console.error(error);
    }
    const { project } = await res.json();
    router.push(`/project/${project.id}`);
  }

  async function getUserByEmail() {
    const res = await fetch(`/api/getUserByEmail/${user.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const resUser = await res.json();
      setDbUser(resUser);
    } else {
      setDbUser(null);
    }
  }

  return (
    <form
      onSubmit={submitProject}
      className="py-14 lg:py-22 px-4 mx-auto max-w-screen-md"
    >
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
        {projectName === "" ? "New Project" : projectName}
      </h1>
      <div className="w-full">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          Project Title
        </label>
        <input
          onChange={(e) => setProjectName(e.target.value)}
          value={projectName}
          type="text"
          className="appearance-none w-full bg-gray-200 text-gray-700 border border-black-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
      <div className="w-full py-4">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          Log Line
        </label>
        <textarea
          onChange={(e) => setLogLine(e.target.value)}
          value={logLine}
          className="appearance-none w-full bg-gray-200 text-gray-700 border border-black-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        ></textarea>
      </div>
      <div className="w-full flex">
        <div>
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Start Date
          </label>
          <input
            type="date"
            onChange={(e) => setStartDate(e.target.value)}
            value={startDate}
            className="bg-gray-200 text-gray-700 border border-500 rounded focus:outline-none focus:bg-white"
          ></input>
        </div>
        <div className="px-6">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            End Date
          </label>
          <input
            type="date"
            onChange={(e) => setEndDate(e.target.value)}
            value={endDate}
            className="bg-gray-200 text-gray-700 border border-500 rounded focus:outline-none focus:bg-white"
          ></input>
        </div>
      </div>
      <div style={{ display: timeSelectors.length > 0 ? "block" : "none" }}>
        {timeSelectors.map((i) => {
          return (
            <div
              className="w-full my-6 px-2 py-2 flex flex-row justify-between bg-gray-200 rounded items-center"
              key={i}
            >
              <h4 className="text-xl tracking-tight font-bold text-center text-gray-700 dark:text-white">
                Day {i + 1}
              </h4>
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Call Time:
                </label>
                <TimePicker
                  allowEmpty={false}
                  showSecond={false}
                  minuteStep={15}
                  use12Hours
                  value={callTimes[i]}
                  defaultOpenValue={moment("07:00:00", "HH:mm:ss")}
                  onChange={(time) => {
                    let newCallTimes = [...callTimes];
                    const callTimeWithDate = moment(startDate)
                      .startOf("day")
                      .add(moment(time).diff(moment(time).startOf("day")));
                    newCallTimes[i] = callTimeWithDate.add(i, "days");
                    setCallTimes(newCallTimes);
                  }}
                />
              </div>
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Wrap Time:
                </label>
                <TimePicker
                  allowEmpty={false}
                  showSecond={false}
                  minuteStep={15}
                  use12Hours
                  value={wrapTimes[i]}
                  defaultOpenValue={moment("19:00:00", "HH:mm:ss")}
                  onChange={(time) => {
                    const wrapTimeWithDate = moment(startDate)
                      .startOf("day")
                      .add(moment(time).diff(moment(time).startOf("day")));
                    let newWrapTimes = [...wrapTimes];
                    newWrapTimes[i] = wrapTimeWithDate.add(i, "days");
                    setWrapTimes(newWrapTimes);
                  }}
                />
              </div>
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Location:
                </label>
                <input
                  value={locations[i]}
                  type="text"
                  className="rc-time-picker-input focus:outline-none"
                  onChange={(loc) => {
                    let newLocations = [...locations];
                    newLocations[i] = loc.target.value;
                    setLocations(newLocations);
                  }}
                />
              </div>
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Day length:
                </label>
                <h4
                  style={{
                    display:
                      dayLengths[i] !== "NaN.NaN" && dayLengths[i]
                        ? "block"
                        : "none",
                  }}
                  className="text-m tracking-tight font-bold text-center text-gray-500 dark:text-white"
                >
                  {dayLengths[i]} Hours
                </h4>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full py-6">
        <button
          type="submit"
          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded disabled:cursor-not-allowed items-center w-40"
          disabled={postRequestNotReady}
        >
          {isPosting ? (
            <>
              <ClipLoader size={20} color={"white"} />
            </>
          ) : (
            "Create Project"
          )}
        </button>
      </div>
    </form>
  );
};

export default NewProjectForm;
