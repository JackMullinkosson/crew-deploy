/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Assigned from "../../../../Components/Project/Assigned";
import Unassigned from "../../../../Components/Project/Unassigned";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/router";
const BASE_URL = "http://localhost:3000/";

export default function Page() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();
  const { id } = router.query;
  const [projectLoading, setProjectLoading] = useState(true);
  const [isAssigned, setIsAssigned] = useState(false);

  useEffect(() => {
    if (!user && !error && !isLoading) {
      window.location.assign("http://localhost:3000/api/auth/login");
    }
  }, [user, error, isLoading]);

  useEffect(() => {
    if (!id) return;
    getGoToByProjectId();
  }, [id]);

  async function getGoToByProjectId() {
    try {
      let res = await fetch(`${BASE_URL}api/getGoToByProjectId/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const test = await res.json();
      if (test) {
        setIsAssigned(true);
      } else {
        setIsAssigned(false);
      }
    } finally {
      setProjectLoading(false);
    }
  }

  if (projectLoading)
    return (
      <main className="flex justify-center px-16 flex-col py-12 lg:py-16 lg:px-24">
        <div className="w-3/4 py-6 flex flex-row items-center">
          <ClipLoader size={35} color={"black"} />
        </div>
      </main>
    );
  if (isAssigned) return <Assigned id={id} />;
  else return <Unassigned id={id} />;
}
