/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useGlobalContext } from "../../../Context/store";
import { XMarkIcon } from "@heroicons/react/24/solid";
const dangerButtonStyles =
  "w-1/4 bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-lg border-4 text-white py-1 px-2 rounded";
const successButtonStyles =
  "w-1/4 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-lg border-4 text-white py-1 px-2 rounded";

const ResponseButtons = ({ personId, project, ownerId, roleId, goToId }) => {
  const { people, setPeople } = useGlobalContext();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [status, setStatus] = useState("");
  const [statusIcon, setStatusIcon] = useState<number>();
  const [isConfirmingDecline, setIsConfirmingDecline] = useState(false);

  useEffect(() => {
    getPeople();
  }, []);

  useEffect(() => {
    if (status && statusIcon && roleId && people) {
      addStatus();
    }
  }, [status, statusIcon]);

  function handleCancelDecline() {
    setIsConfirmingDecline(false);
  }

  function handleDeclineConfirmed() {
    setIsDeclining(true);
    setStatus("Declined");
    setStatusIcon(3);
  }

  function handleClick(e) {
    if (e.target.innerHTML === "Confirm") {
      setIsConfirming(true);
      setStatus("Confirmed");
      setStatusIcon(4);
    }
  }

  async function addStatus() {
    try {
      await fetch(`/api/editStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: personId,
          people: people,
          roleId: roleId,
          project: project,
          ownerId: ownerId,
          status: status,
          statusIcon: statusIcon,
        }),
      });
    } finally {
      setIsConfirming(false);
      setIsDeclining(false);
      setIsConfirmingDecline(false);
      window.location.reload();
    }
  }

  async function getPeople() {
    let res;
    try {
      res = await fetch(`/api/getPeopleByGoTo/${goToId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setPeople(await res.json());
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-3/4 py-6 flex flex-row items-center justify-evenly relative">
      <button className={successButtonStyles} onClick={(e) => handleClick(e)}>
        {isConfirming ? <ClipLoader size={21} color={"white"} /> : "Confirm"}
      </button>
      <button
        className={dangerButtonStyles}
        onClick={() => setIsConfirmingDecline(true)}
      >
        Decline
      </button>
      {isConfirmingDecline ? (
        <div className="absolute top-0 items-center right-1/4 z-50 p-4 overflow-visible h-modal md:h-full w-1/2 mr-8">
          <div className="-mt-16 bg-white rounded-lg shadow-2xl shadow-black p-6 text-center dark:bg-gray-700 flex flex-col justify-center items-center">
            <XMarkIcon
              className="h-6 w-6 self-end hover:cursor-pointer"
              onClick={() => handleCancelDecline()}
            />
            <p className="py-4 inline-block self-start">
              Are you sure? The offer will be sent to somebody else.
            </p>
            <button
              className="bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 rounded text-white px-4 py-2 w-full"
              onClick={() => handleDeclineConfirmed()}
            >
              {isDeclining ? (
                <ClipLoader size={21} color={"white"} />
              ) : (
                "Decline"
              )}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ResponseButtons;
