import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const { people, roleId } = req.body;

    const updatedPeople = [];

    for (const [index, person] of people.entries()) {
      if (person.roleId === roleId) {
        const { id } = person;
        const updatedPerson = await prisma.person.update({
          where: { id },
          data: { order: index + 1 },
        });
        updatedPeople.push(updatedPerson);
      } else {
        updatedPeople.push(person);
      }
    }

    updatedPeople.sort((a, b) => a.order - b.order);

    return res.status(200).json(updatedPeople);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
