import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id, goToId } = req.body;
    await prisma.person.deleteMany({
      where: {
        roleId: id,
      },
    });
    const role = await prisma.role.delete({
      where: {
        complexId: {
          id: id,
          goToId: Number(goToId),
        },
      },
    });
    return res.status(200).json(role);
  } catch (error) {
    console.error(`An error occurred while trying to delete role ${error}`);
  }
}
