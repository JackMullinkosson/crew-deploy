import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";
import { transporter } from "../../../Components/NodeMailer";

const email = process.env.EMAIL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { status, statusIcon, id, people, roleId, ownerId, project } =
      req.body;
    const user = await prisma.user.findFirst({
      where: { id: ownerId },
    });
    const person = await prisma.person.update({
      where: {
        id: id,
      },
      data: {
        status: status,
        statusIcon: parseInt(statusIcon),
      },
    });
    if (status === "Declined") {
      for (const person of people) {
        if (
          person.roleId === roleId &&
          person.id !== id &&
          person.status === "Not contacted"
        ) {
          const hasLowerOrder = people.some(
            (otherPerson) =>
              otherPerson.roleId === person.roleId &&
              otherPerson.id !== id &&
              otherPerson.order < person.order &&
              otherPerson.status === "Not contacted"
          );
          if (!hasLowerOrder) {
            await prisma.person.update({
              where: {
                id: person.id,
              },
              data: {
                status: "Awaiting response",
                statusIcon: 2,
              },
            });
            const mailOptions = {
              from: email,
              to: person.email,
            };
            transporter.sendMail({
              ...mailOptions,
              subject: `${user.name} sent you a job offer on Crew Up!`,
              text: `Dear ${person.name}, ${user.name} has sent you a job offer for the project ${project.name}. Open up this link: http://localhost:3000/project/${project.id}/${person.id} for more details and to confirm or decline the offer.`,
              html: `<h4>Dear ${person.name},</h4><p>${user.name} has sent you a job offer for the project ${project.name}. <span><a href="http://localhost:3000/project/${project.id}/${person.id}">Click here</a></span> for more details and to confirm or decline the offer.</p>`,
            });
          }
        }
      }
    }
    return res.status(200).json(person);
  } catch (e) {
    console.error(e);
  }
}
