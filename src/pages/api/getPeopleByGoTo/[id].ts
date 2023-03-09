import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const people = await prisma.person.findMany({
      where: {
        goToId: Number(id),
      },
      orderBy: {
        order: "asc",
      },
    });
    return res.status(200).json(people);
  } catch (error) {
    return res.status(500).json(error);
  }
}
