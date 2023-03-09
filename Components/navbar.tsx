/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const { user } = useUser();

  if (user)
    return (
      <>
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start">
                <div
                  onClick={() => router.push("/")}
                  className="flex items-center ml-2 text-center hover:cursor-pointer hover:text-blue-500"
                >
                  <WrenchScrewdriverIcon className="h-6 w-6" />
                  <h1 className="ml-4 self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                    CrewUp
                  </h1>
                </div>
                <Link
                  className="ml-8 text-center self-center text-xl whitespace-nowrap sm:text-2xl text-gray-700 hover:text-blue-500"
                  href="/About"
                >
                  About
                </Link>
              </div>

              <div>
                <a
                  className="text-gray-600 font-semibold hover:text-blue-500"
                  href="/api/auth/logout"
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  else return <></>;
}
