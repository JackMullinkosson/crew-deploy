import moment from "moment";
import ResponseButtons from "../../../../../Components/Project/Person/ResponseButtons";
import Confirmed from "../../../../../Components/Project/Person/Confirmed";
import Declined from "../../../../../Components/Project/Person/Declined";
import Toast from "../../../../../Components/Project/Person/Toast";
import Router, { useRouter } from "next/router";

export default async function Page() {
  const router = useRouter();
  const { id, person } = router.query;

  console.log(process.env.LOCAL_DOMAIN);

  async function getProjectById() {
    const res = await fetch(`http://localhost:3000/api/getProjectById/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      return await res.json();
    } else {
      return null;
    }
  }

  async function getPersonById() {
    const res = await fetch(
      `http://localhost:3000/api/getPersonById/${person}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await res.json();
  }

  const project = await getProjectById();
  const ownerId = project.ownerId;
  const resPerson = await getPersonById();
  const goToId = resPerson.goToId;
  const roleId = resPerson.roleId;
  const status = resPerson && resPerson.status ? resPerson.status : null;

  return (
    <main className="flex justify-center px-16 flex-col py-12 lg:py-16 lg:px-24">
      {status === "Confirmed" ? <Toast status={status} /> : null}
      {status === "Declined" ? <Toast status={status} /> : null}
      <div className="w-3/4 py-6 flex flex-row items-center justify-evenly">
        <h1 className="text-6xl font-bold">{project.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 ml-6 w-1/2">
          {moment(project.startDate).format("MMMM Do YYYY")} -{" "}
          {moment(project.endDate).format("MMMM Do YYYY")}
        </p>
      </div>
      <div className="w-3/4 py-6 flex flex-row items-center shrink-0 grow-0 justify-between">
        <h4 className="text-xl text-gray-700 font-bold w-1/3">Logline:</h4>
        <p className="mr-0 ml-auto w-2/3">{project.logLine}</p>
      </div>
      {project.dayDetails.map((day, index) => {
        return (
          <>
            <div className="w-3/4 py-6 flex flex-row items-center justify-between shrink-0 grow-0">
              <div className="flex flex-col justify-center items-center">
                <h5 className="text-l font-bold text-gray-700">
                  Day {index + 1}:
                </h5>
                <p>{moment(day.startTime).format("MMMM Do YYYY")}</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <h5 className="text-l font-bold text-gray-700">Call Time:</h5>
                <p>{moment(day.startTime).format("LT")}</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <h5 className="text-l font-bold text-gray-700">Wrap Time:</h5>
                <p>{moment(day.endTime).format("LT")}</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <h5 className="text-l font-bold text-gray-700">Location:</h5>
                <p>{day.location}</p>
              </div>
            </div>
          </>
        );
      })}
      {status !== "Confirmed" && status !== "Declined" ? (
        <ResponseButtons
          personId={person}
          project={project}
          ownerId={ownerId}
          roleId={roleId}
          goToId={goToId}
        />
      ) : null}
      {status === "Confirmed" ? (
        <Confirmed
          project={project}
          ownerId={ownerId}
          roleId={roleId}
          personId={person}
        />
      ) : null}
      {status === "Declined" ? <Declined /> : null}
    </main>
  );
}
