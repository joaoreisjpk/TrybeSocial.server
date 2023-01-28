/*
  Warnings:

  - You are about to drop the column `link` on the `labs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "labs" DROP COLUMN "link",
ADD COLUMN     "contactLink" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "contactNumber" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "repositoryLink" TEXT NOT NULL DEFAULT E'';
