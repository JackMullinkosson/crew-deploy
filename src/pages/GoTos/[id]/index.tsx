/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../../../Context/store";
import {
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { ClipLoader } from "react-spinners";
import RoleDetails from "../../../../Components/RoleDetails";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";

const successButtonStyles =
  "mr-2 flex items-center flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded disabled:cursor-not-allowed";
const newRowStyles =
  "flex flex-row items-center py-4 mb-4 w-full justify-between";
const addRowStyles =
  "flex flex-row w-1/4 items-center justify-between bg-white py-1 mb-4";
const inputStyles =
  "w-1/2 appearance-none bg-gray-200 text-gray-500 border border-black-500 rounded py-2 px-1 mb-1 leading-tight focus:outline-none focus:bg-white";
const successLabelStyles =
  "h-6 uppercase tracking-wide text-gray-700 text-xs font-bold flex flex-row items-center text-teal-500";
const dangerLabelStyles =
  "block uppercase text-red-700 text-xs font-bold mb-2 flex flex-row items-center";

export default withPageAuthRequired(function GoTo() {
  const router = useRouter();
  const { id } = router.query;
  const {
    roles,
    setRoles,
    setPeople,
    isPosting,
    setIsPosting,
    error,
    setError,
  } = useGlobalContext();
  const [goToLoading, setGoToLoading] = useState(true);
  const [isCreatingRow, setIsCreatingRow] = useState(false);
  const [tempId, setTempId] = useState<number>();
  const [name, setName] = useState("");
  const [goTo, setGoTo] = useState("");

  useEffect(() => {
    getGoTos();
  }, []);

  async function getGoTos() {
    let res;
    setGoToLoading(true);
    try {
      res = await fetch(`/api/getGoToById/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      const goTo = await res.json();
      setGoTo(goTo.name);
      setPeople(goTo.people);
      setRoles(goTo.roles);
      setGoToLoading(false);
    }
  }
  useEffect(() => {
    getTempId();
  }, [roles]);

  function getTempId() {
    const arrOfIds = [];
    for (const role of roles) {
      arrOfIds.push(role.id);
    }
    arrOfIds.sort((a, b) => b - a);
    if (arrOfIds.length < 1) {
      arrOfIds.push(0);
    }
    setTempId(arrOfIds[0]);
  }

  async function addRole() {
    let newTempId = tempId + 1;
    const newRole = {
      name: name,
      goToId: Number(id),
      id: newTempId,
      people: [],
    };
    let updatedRoles = [...roles];
    updatedRoles.push(newRole);
    setRoles(updatedRoles);
    setName("");
    setIsPosting(true);
    setIsCreatingRow(false);
    let res;
    try {
      res = await fetch(`/api/createRole`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          goToId: Number(id),
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      let resRole = await res.json();
      let resRoles = [...roles];
      resRoles.push(resRole);
      setRoles(resRoles);
      setIsPosting(false);
    }
  }

  return (
    <div className="flex justify-center px-16 flex-col py-12 lg:py-16">
      <h1 className="text-4xl py-4">{goToLoading ? "Loading..." : goTo}</h1>
      {goToLoading ? (
        <>
          <div className={newRowStyles}>
            <button
              className={`${successButtonStyles} disabled:cursor-not-allowed`}
              disabled={true}
            >
              <PlusIcon className="h-6 w-6" />
              Add Role
            </button>
          </div>
          <div className="flex flex-col py-3 bg-gray-50 hover:bg-white rounded border hover:cursor-pointer">
            <h1 className="text-2xl px-4 py-2 hover:cursor-pointer">
              <ClipLoader size={40} color={"black"} />
            </h1>
          </div>
        </>
      ) : (
        <div>
          <div className={addRowStyles}>
            {isPosting ? (
              <div className="flex items-center">
                <ClipLoader size={35} color={"red"} />
              </div>
            ) : error ? (
              <label className={dangerLabelStyles}>
                Error occurred. Please refresh the page
                <ExclamationCircleIcon className="h-6 w-6 items-center" />
              </label>
            ) : (
              <label className={successLabelStyles}>
                All changes saved
                <CheckIcon className="h-6 w-6 items-center" />
              </label>
            )}
          </div>
          {roles.map((role) => {
            if (role.goToId === Number(id))
              return (
                <RoleDetails
                  key={String(role.id)}
                  id={role.id}
                  roleName={role.name}
                  goToId={Number(id)}
                />
              );
          })}
          {isCreatingRow ? (
            <div className={`${addRowStyles} border py-6 mt-4 px-4`}>
              <input
                className={inputStyles}
                value={name}
                placeholder="Role Name"
                onChange={(e) => setName(e.target.value)}
              />
              <button className={successButtonStyles} onClick={() => addRole()}>
                Add
              </button>
              <XMarkIcon
                className="w-6 h-6 hover:cursor-pointer"
                onClick={() => setIsCreatingRow(false)}
              />
            </div>
          ) : (
            <div className={newRowStyles}>
              <button
                className={`${successButtonStyles} disabled:cursor-not-allowed flex flex-row items-center`}
                disabled={isCreatingRow}
                onClick={() => setIsCreatingRow(true)}
              >
                <PlusIcon className="h-6 w-6" />
                Add Role
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
