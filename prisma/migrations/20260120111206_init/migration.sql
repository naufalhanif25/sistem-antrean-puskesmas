-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DOKTER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nip" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nip_key" ON "User"("nip");
