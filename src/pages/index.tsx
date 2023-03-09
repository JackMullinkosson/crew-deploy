"use client";
import { get } from "https";
import Head from "next/head";
import React, { useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  id: number;
}

export default function Home() {
  const [user, setUser] = useState<User>();
  async function getUserById() {
    const res = await fetch(`/api/getUserById/1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resUser = await res.json();
    setUser(resUser);
  }

  useEffect(() => {
    getUserById();
  }, []);

  console.log(user);

  return (
    <>
      <Head>
        <title>Crew Up</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="description" content="" />
        <link
          rel="icon"
          href="https://i.ibb.co/4Y9YrCQ/Untitled-design-24-removebg-preview.png"
        />
      </Head>
      <h1>Hello, {user.name}!</h1>
    </>
  );
}
