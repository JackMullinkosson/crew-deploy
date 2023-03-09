import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name, ownerId, roles, icon } = req.body;

    if (!name || name.length === 0) {
      return res.status(400).json({ message: "List name is required" });
    }
    const existingList = await prisma.goTos.findFirst({
      where: {
        AND: [{ name: name }, { ownerId: ownerId }],
      },
    });
    if (existingList) {
      return res.status(409).json({ message: "List already exists" });
    }
    const goTo = await prisma.goTos.create({
      data: {
        name: name,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        icon: icon,
        roles: {
          create: roles.map((role: { name: String }) => ({
            name: role,
          })),
        },
      },
    });
    return await res.status(200).json({ goTo });
  } catch (e) {
    console.error(e);
  }
}
