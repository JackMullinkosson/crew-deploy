"use client";
import { useState, useEffect } from "react";
import {
  XMarkIcon,
  CheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

const Toast = ({ status }) => {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  }, []);

  return (
    <>
      {showToast ? (
        <div className="fixed top-20 left-1/3">
          <div className="flex items-center w-full max-w-xs p-4 bg-white rounded-lg shadow-lg shadow-blue-400">
            {status === "Confirmed" ? (
              <>
                <CheckIcon className="h-8 w-8 text-green-500" />
                <p>Success! You are confirmed.</p>
              </>
            ) : null}
            {status === "Declined" ? (
              <>
                <ExclamationCircleIcon className="h-8 w-8 text-red-500" />
                <p>Offer declined.</p>
              </>
            ) : null}
            <XMarkIcon
              onClick={() => setShowToast(false)}
              className="h-6 w-6 -mr-2 ml-auto text-gray-400 hover:cursor-pointer"
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Toast;
