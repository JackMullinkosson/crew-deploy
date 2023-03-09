import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { people } = req.body;
    for (const person of people) {
      const hasLowerOrder = people.some(
        (otherPerson) =>
          otherPerson.roleId === person.roleId &&
          otherPerson.order < person.order
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
      } else {
        await prisma.person.update({
          where: {
            id: person.id,
          },
          data: {
            status: "Not contacted",
            statusIcon: 1,
          },
        });
      }
    }
    const resPeople = await prisma.person.findMany({
      orderBy: {
        order: "asc",
      },
    });
    return res.status(200).json(resPeople);
  } catch (error) {
    return res.status(500).json(error);
  }
}
