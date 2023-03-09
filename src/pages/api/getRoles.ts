import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const roles = await prisma.role.findMany();
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json(error);
  }
}
