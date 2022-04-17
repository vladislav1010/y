/*
  Warnings:

  - Changed the type of `level` on the `BasePermissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BasePermissionLevel" AS ENUM ('creator', 'editor', 'commenter', 'readonly');

-- AlterTable
ALTER TABLE "BasePermissions"
ADD COLUMN     "level" "BasePermissionLevel" NOT NULL;
