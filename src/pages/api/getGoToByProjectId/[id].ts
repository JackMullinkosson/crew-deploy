import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const goTo = await prisma.goTos.findFirst({
      where: { projectId: Number(id) },
      include: {
        roles: true,
        people: { orderBy: { order: "asc" } },
      },
    });
    return res.status(200).json(goTo);
  } catch (error) {
    return res.status(500).json(error);
  }
}
