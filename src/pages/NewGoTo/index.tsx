/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { ClipLoader } from "react-spinners";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useGlobalContext } from "../../../Context/store";

const inputStyles =
  "appearance-none w-full bg-gray-200 text-gray-700 border border-black-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white";
const labelStyles =
  "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";
const successButtonStyles =
  "flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded disabled:cursor-not-allowed items-center w-40";

const NewGoToForm = () => {
  const router = useRouter();
  const { user, isLoading, error } = useUser();
  const { dbUser, setDbUser } = useGlobalContext();
  const defaultProdRoles = [
    "Producer",
    "Co-Producer",
    "Associate Producer",
    "Production Coordinator",
    "UPM",
    "Key PA",
    "PA",
  ];
  const defaultCineRoles = [
    "Gaffer",
    "BBE",
    "Electric",
    "Key Grip",
    "BBG",
    "Grip",
    "Camera Operator",
    "First AC",
    "Second AC",
    "Camera Utility",
  ];
  const defaultArtRoles = [
    "Art Director",
    "Production Designer",
    "Set Decorator",
    "Prop Master",
    "Art PA",
  ];
  const [listName, setListName] = useState("");
  const [defaultRoles, setDefaultRoles] = useState([]);
  const [icon, setIcon] = useState<number>();
  const [postRequestNotReady, setPostRequestNotReady] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (!user && !error && !isLoading) {
      window.location.assign(`${process.env.BASE_URL}/api/auth/login`);
    }
  }, [user, error, isLoading]);

  async function submitList(e: React.FormEvent) {
    e.preventDefault();
    let res;
    try {
      setIsPosting(true);
      res = await fetch(`/api/createGoTo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: listName,
          roles: defaultRoles,
          icon: icon,
          ownerId: dbUser.id,
        }),
      });
      if (res.status !== 200) {
        console.log("error making new go to list");
      }
    } catch (e) {
      console.error(e);
    }
    const { goTo } = await res.json();
    router.push(`/GoTos/${goTo.id}`);
  }

  useEffect(() => {
    if (listName === "" || defaultRoles.length === 0) return;
    setPostRequestNotReady(false);
  }, [defaultRoles, listName]);

  useEffect(() => {
    if (!user) return;
    getUserByEmail();
  }, [user]);

  function handleChoice(e) {
    setPostRequestNotReady(true);
    switch (e.value) {
      case "":
        return;
      case "Production":
        setDefaultRoles(defaultProdRoles);
        setIcon(1);
        break;
      case "Cinematography":
        setDefaultRoles(defaultCineRoles);
        setIcon(2);
        break;
      case "Art":
        setDefaultRoles(defaultArtRoles);
        setIcon(3);
        break;
      default:
        return;
    }
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
    <>
      <form
        onSubmit={submitList}
        className="py-14 lg:py-20 px-4 mx-auto max-w-screen-md"
      >
        <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
          {listName === "" ? "New Go-To List" : listName}
        </h1>
        <div className="w-full">
          <label className={labelStyles}>List Title</label>
          <input
            onChange={(e) => setListName(e.target.value)}
            value={listName}
            type="text"
            className={inputStyles}
          />
        </div>
        <div className="w-full py-6">
          <label className={labelStyles}>Department</label>
          <div className="flex">
            <select
              className="flex appearance-none bg-gray-200 text-gray-700 border border-black-500 rounded py-3 px-4 pr-12 mb-3 leading-tight focus:outline-none focus:bg-white"
              onChange={(e) => handleChoice(e.target)}
            >
              <option value="" disabled selected>
                Select option
              </option>
              <option value="Production">Production</option>
              <option value="Cinematography">Cinematography</option>
              <option value="Art">Art</option>
            </select>
            <ChevronDownIcon className="h-8 w-6 -ml-10 mt-2 postion-absolute" />
          </div>
        </div>
        <div className="w-full py-2">
          <button
            type="submit"
            className={successButtonStyles}
            disabled={postRequestNotReady}
          >
            {isPosting ? (
              <>
                <ClipLoader size={20} color={"white"} />
              </>
            ) : (
              "Create Go-To List"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default NewGoToForm;
