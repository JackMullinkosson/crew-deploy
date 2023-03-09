import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.body;
    const person = await prisma.person.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json(person);
  } catch (error) {
    console.error(`An error occurred while trying to delete person ${error}`);
  }
}
