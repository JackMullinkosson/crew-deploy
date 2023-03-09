import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { thisGoTo, defaultGoTo, projectId, projectName, people, ownerId } =
      req.body;

    const createdGoTo = await prisma.goTos.create({
      data: {
        name: `${projectName} Go-To List`,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        icon: thisGoTo.icon,
        defaultGoTo: defaultGoTo,
        project: {
          connect: {
            id: Number(projectId),
          },
        },
      },
    });

    const newRoles = thisGoTo.roles.map((existingRole) => ({
      ...existingRole,
      id: undefined,
      goToId: createdGoTo.id,
    }));

    await prisma.role.createMany({
      data: newRoles,
    });

    const createdRoles = await prisma.role.findMany({
      where: {
        goToId: createdGoTo.id,
      },
    });

    const newPeople = thisGoTo.roles.flatMap((existingRole) =>
      people
        .filter(
          (existingPerson) =>
            existingPerson.roleId ===
            thisGoTo.roles.find((r) => r.name === existingRole.name).id
        )
        .map((existingPerson) => ({
          ...existingPerson,
          id: undefined,
          goToId: createdGoTo.id,
          roleId: createdRoles.find((r) => r.name === existingRole.name).id,
        }))
    );

    await prisma.person.createMany({
      data: newPeople,
    });

    const completeGoTo = await prisma.project.findFirst({
      where: { id: createdGoTo.id },
    });

    return await res.status(200).json({ completeGoTo });
  } catch (e) {
    console.error(e);
  }
}
