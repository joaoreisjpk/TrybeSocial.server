/*
  Warnings:

  - You are about to drop the column `name` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `labs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "name",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT E'';

-- AlterTable
ALTER TABLE "labs" DROP COLUMN "name",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT E'';
