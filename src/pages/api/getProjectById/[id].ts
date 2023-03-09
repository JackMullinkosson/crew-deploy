import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    console.log(req.query);
    const project = await prisma.project.findFirst({
      where: { id: Number(id) },
      include: {
        dayDetails: true,
      },
    });
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json(error);
  }
}
