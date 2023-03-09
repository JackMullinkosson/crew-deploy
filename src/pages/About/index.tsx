import Link from "next/link";

const pStyles = "py-4 self-start";
const linkStyles = "text-underline text-blue-500";

export default function About() {
  return (
    <main className="flex justify-center px-16 flex-col py-12 lg:py-16 lg:px-24">
      <div className="w-full py-4 flex flex-col items-center px-40">
        <h1 className="text-4xl py-4 font-extrabold">About Crew Up</h1>
        <p className={pStyles}>
          This application was designed to automate the crewing up process on
          film sets by storing user&apos;s “Go-To” personnel for specific roles,
          and allowing them to send batch job offers. When an offer is declined,
          the app automatically sends the offer to the next person on the
          “Go-To” list. This can save freelance gig workers a lot of time by
          eliminating the need to contact people individually in order to fill
          out their crew list.
        </p>
        <p className={pStyles}>
          To start with, create a Go-To list and fill it with the people you
          most like to work with. Then, when you get a job, create a new
          project, fill out the details according to that project, and assign
          the Go-To list to that project. You may have tweaks to your initial
          Go-To list depending on the needs of that project, so feel free to
          make tweaks within the project page. Your changes won&apos;t affect
          your initial list, so you&apos;ll still be able to use that same list
          for a new project later on down the road.
        </p>
        <p className={pStyles}>
          Once you&apos;re satisfied with your list and it&apos;s order, hit the
          &apos;Crew Up!&apos; button. From here, emails will be sent, and the
          app will automate the hiring process for you. All the project
          information that you saved when you created the project will be
          forwarded along with the offer, so you don&apos;t have to spend time
          talking logistics with each potential candidate.
        </p>
        <p className={pStyles}>
          Crew Up was created by me,{" "}
          <Link
            className={linkStyles}
            href="https://www.linkedin.com/in/jack-mullinkosson-425a13227/"
          >
            Jack Mullinkosson
          </Link>{" "}
          for my final project at{" "}
          <Link className={linkStyles} href="https://parsity.io/">
            Parsity Coding School
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
