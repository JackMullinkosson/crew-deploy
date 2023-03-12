/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { PlusIcon } from "@heroicons/react/24/solid";
import { ProjectBoxes } from "../../Components/ProjectBoxes";
import { GoToBoxes } from "../../Components/GoToBoxes";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useGlobalContext } from "../../Context/store";
import { useRouter } from "next/navigation";

interface project {
  name: String;
  id: Number;
  startDate: Date;
  endDate: Date;
}

interface goTo {
  name: String;
  id: Number;
  icon: Number;
  defaultGoTo: boolean;
}

export default function Home() {
  const router = useRouter();
  const { user, isLoading, error } = useUser();
  const { dbUser, setDbUser } = useGlobalContext();
  const [name, setName] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [projects, setProjects] = useState<project[]>([]);
  const [goTos, setGoTos] = useState<goTo[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [goTosLoading, setGoTosLoading] = useState(true);

  useEffect(() => {
    if (!user && !error && !isLoading) {
      window.location.assign(`${process.env.BASE_URL}/api/auth/login`);
    }
  }, [user, error, isLoading]);

  useEffect(() => {
    if (!user) return;
    getUserByEmail();
  }, [user]);

  useEffect(() => {
    if (!dbUser) return;
    if (dbUser.id === 0) return;
    getProjects();
    getGoTos();
  }, [dbUser]);

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

  async function createUser() {
    let res;
    try {
      setIsPosting(true);
      res = await fetch(`/api/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: user.email,
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      const resUser = await res.json();
      setDbUser(resUser);
      setIsPosting(false);
    }
  }

  async function getProjects() {
    let res;
    try {
      res = await fetch(`/api/getProjectsByUser/${dbUser.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error(error);
    } finally {
      const resProjects = await res.json();
      setProjects(resProjects);
      setProjectsLoading(false);
    }
  }

  async function getGoTos() {
    let res;
    try {
      res = await fetch(`/api/getGoTosByUser/${dbUser.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error(error);
    } finally {
      const resGoTos = await res.json();
      setGoTos(resGoTos);
      setGoTosLoading(false);
    }
  }

  if (isLoading)
    return (
      <div className="py-12 lg:py-16 px-16 lg:px-24">
        <ClipLoader className="h-6 w-6" />
      </div>
    );
  if (error)
    return (
      <main className="flex justify-center px-16 flex-col py-12 lg:py-16 lg:px-24">
        <div className="w-3/4 py-6 flex flex-row items-center">
          <h1 className="text-red-500">Error! Something went wrong.</h1>
        </div>
      </main>
    );
  if (user)
    return (
      <>
        <section className="bg-white dark:bg-gray-900 mt-10 lg:mt-14">
          <div className="py-4 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6 relative">
            {dbUser === null ? (
              <div className="w-1/2 absolute top-1/4 left-1/4 h-fit mt-1/4 py-4 flex flex-col items-center bg-white rounded shadow shadow-xl">
                <h1 className="text-2xl font-bold py-4">
                  {" "}
                  What&apos;s your name?
                </h1>
                <input
                  className="appearance-none w-3/4 bg-gray-200 text-gray-700 border border-black-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Harrison Ford"
                />
                <button
                  disabled={name.length < 1}
                  className="bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 border-4 text-white py-1 px-1 rounded disabled:cursor-not-allowed items-center w-1/3 text-center"
                  onClick={() => createUser()}
                >
                  {isPosting ? (
                    <ClipLoader size={20} color={"white"} />
                  ) : (
                    "Get Started"
                  )}
                </button>
              </div>
            ) : null}
            <div className="max-w-screen-md mb-4 lg:mb-8">
              <h2 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                Welcome, {dbUser && dbUser.id ? dbUser.name : null}
              </h2>
            </div>
            <div className="max-w-screen-md mb-4 lg:mb-8">
              <h2 className="text-2xl tracking-tight font-bold text-gray-900 dark:text-white">
                Active Projects
              </h2>
            </div>
            <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0 mb-6 lg:mb-12">
              {dbUser ? (
                <div
                  className="hover:cursor-pointer flex flex-row justify-center items-center center-text border-dashed border-black-500 border-4 py-8 pl-4 rounded hover:bg-gray-100"
                  onClick={() => router.push("/NewProject")}
                >
                  <h3 className="text-xl font-bold dark:text-white mr-4">
                    New Project
                  </h3>
                  <PlusIcon className="h-6 w-6" />
                </div>
              ) : (
                <div
                  className="pointer-events-none flex flex-row justify-center items-center center-text border-dashed border-black-500 border-4 py-8 pl-4 rounded hover:bg-gray-100"
                  onClick={() => router.push("/NewProject")}
                >
                  <h3 className="text-xl font-bold dark:text-white mr-4">
                    New Project
                  </h3>
                  <PlusIcon className="h-6 w-6" />
                </div>
              )}
              {dbUser ? (
                <ProjectBoxes
                  projects={projects}
                  projectsLoading={projectsLoading}
                />
              ) : null}
            </div>
            <div className="max-w-screen-md mb-4 lg:mb-8">
              <h2 className="text-2xl tracking-tight font-bold text-gray-900 dark:text-white">
                Go-To Lists
              </h2>
            </div>
            <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0 mb-6 lg:mb-12">
              {dbUser ? (
                <div
                  className="hover:cursor-pointer flex flex-row justify-center items-center center-text border-dashed border-black-500 border-4 py-8 pl-4 rounded hover:bg-gray-100"
                  onClick={() => router.push("/NewGoTo")}
                >
                  <h3 className="text-xl font-bold dark:text-white mr-4">
                    New Go-To List
                  </h3>
                  <PlusIcon className="h-6 w-6" />
                </div>
              ) : (
                <div
                  className="pointer-events-none flex flex-row justify-center items-center center-text border-dashed border-black-500 border-4 py-8 pl-4 rounded hover:bg-gray-100"
                  onClick={() => router.push("/NewGoTo")}
                >
                  <h3 className="text-xl font-bold dark:text-white mr-4">
                    New Go-To List
                  </h3>
                  <PlusIcon className="h-6 w-6" />
                </div>
              )}
              {dbUser ? (
                <GoToBoxes goTos={goTos} goTosLoading={goTosLoading} />
              ) : null}
            </div>
          </div>
        </section>
      </>
    );
}
