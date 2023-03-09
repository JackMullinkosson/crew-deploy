-- CreateTable
CREATE TABLE "User" (
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "name" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL DEFAULT '0001-01-01 00:00:00'::timestamp without time zone,
    "logLine" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT '0001-01-01 00:00:00'::timestamp without time zone,
    "crewedUp" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Day" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT '0001-01-01 00:00:00'::timestamp without time zone,
    "endTime" TIMESTAMP(3) NOT NULL DEFAULT '0001-01-01 00:00:00'::timestamp without time zone,
    "location" TEXT NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "name" TEXT NOT NULL,
    "order" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "status" TEXT,
    "statusIcon" INTEGER,
    "roleId" INTEGER NOT NULL,
    "goToId" INTEGER NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoTos" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" INTEGER NOT NULL DEFAULT 1,
    "defaultGoTo" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" INTEGER NOT NULL,
    "projectId" INTEGER,

    CONSTRAINT "GoTos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "name" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "goToId" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_id_goToId_key" ON "Role"("id", "goToId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Day" ADD CONSTRAINT "Day_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_goToId_fkey" FOREIGN KEY ("goToId") REFERENCES "GoTos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoTos" ADD CONSTRAINT "GoTos_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoTos" ADD CONSTRAINT "GoTos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_goToId_fkey" FOREIGN KEY ("goToId") REFERENCES "GoTos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
