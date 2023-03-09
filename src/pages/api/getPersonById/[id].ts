import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const person = await prisma.person.findFirst({
      where: { id: String(id) },
    });
    return res.status(200).json(person);
  } catch (error) {
    return res.status(500).json(error);
  }
}
