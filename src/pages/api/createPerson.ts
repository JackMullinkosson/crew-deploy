import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    const { newPerson } = req.body;

    const person = await prisma.person.create({
      data: {
        name: newPerson.name,
        email: newPerson.email,
        phoneNumber: newPerson.phoneNumber,
        order: newPerson.order,
        role: {
          connect: {
            id: newPerson.roleId,
          },
        },
        goTo: {
          connect: {
            id: newPerson.goToId,
          },
        },
      },
    });
    return res.status(200).json(person);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
