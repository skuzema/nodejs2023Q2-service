/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_login_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
