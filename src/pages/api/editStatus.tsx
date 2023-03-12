import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";
const email = process.env.EMAIL;
const sgMail = require("@sendgrid/mail");

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
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
              to: person.email,
              from: email,
              subject: `${user.name} sent you a job offer on Crew Up!`,
              text: `Dear ${person.name}, ${user.name} has sent you a job offer for the project ${project.name}. Open up this link: ${process.env.BASE_URL}/project/${project.id}/${person.id} for more details and to confirm or decline the offer.`,
              html: `<h4>Dear ${person.name},</h4><p>${user.name} has sent you a job offer for the project ${project.name}. <span><a href="${process.env.BASE_URL}/project/${project.id}/${person.id}">Click here</a></span> for more details and to confirm or decline the offer.</p>`,
            };
            sgMail
              .send(msg)
              .then(() => {
                console.log("Email sent");
              })
              .catch((error) => {
                console.error(error);
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
