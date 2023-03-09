import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { editedPerson } = req.body;
    const person = await prisma.person.update({
      where: {
        id: editedPerson.id,
      },
      data: {
        name: editedPerson.name,
        email: editedPerson.email,
        phoneNumber: editedPerson.phoneNumber,
        roleId: editedPerson.roleId,
        order: editedPerson.order,
      },
    });
    return res.status(200).json(person);
  } catch (error) {
    console.error(`An error occurred while trying to edit person ${error}`);
  }
}
