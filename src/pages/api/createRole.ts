import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    const { name, goToId } = req.body;

    const role = await prisma.role.create({
      data: {
        name: name,
        goToId: goToId,
      },
    });
    return res.status(200).json(role);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
