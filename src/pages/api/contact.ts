import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";
const email = process.env.EMAIL;
const sgMail = require("@sendgrid/mail");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    const { project, ownerId, people } = req.body;

    const user = await prisma.user.findFirst({
      where: { id: ownerId },
    });

    await people.forEach((person) => {
      const hasLowerOrder = people.some(
        (otherPerson) =>
          otherPerson.roleId === person.roleId &&
          otherPerson.order < person.order
      );
      if (!hasLowerOrder) {
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
    });

    await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        crewedUp: true,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}
