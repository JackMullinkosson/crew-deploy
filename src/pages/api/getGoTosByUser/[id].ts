import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const goTos = await prisma.goTos.findMany({
      where: {
        ownerId: Number(id),
      },
      include: { roles: true },
    });
    return res.status(200).json(goTos);
  } catch (error) {
    return res.status(500).json(error);
  }
}
