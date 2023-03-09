"use client";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useGlobalContext } from "../../../Context/store";
import { XMarkIcon } from "@heroicons/react/24/solid";
const dangerButtonStyles =
  "w-1/4 bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-lg border-4 text-white py-1 px-2 rounded";

const Confirmed = ({ ownerId, project, roleId, personId }) => {
  const { people } = useGlobalContext();
  const [isConfirmingDecline, setIsConfirmingDecline] = useState(false);
  const status = "Declined";
  const statusIcon = 3;
  const [isDeclining, setIsDeclining] = useState(false);

  function handleCancelDecline() {
    setIsConfirmingDecline(false);
  }

  function handleDeclineConfirmed() {
    setIsDeclining(true);
    addStatus();
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
      setIsDeclining(false);
      window.location.reload();
    }
  }

  return (
    <div className="w-3/4 py-6 flex flex-row items-center justify-evenly relative">
      <p>Thanks! You have been confirmed for this project.</p>
      <button
        className={dangerButtonStyles}
        onClick={() => setIsConfirmingDecline(true)}
      >
        Cancel
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

export default Confirmed;
