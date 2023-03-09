import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const user = await prisma.user.findFirst({
      where: { id: Number(id) },
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
}
