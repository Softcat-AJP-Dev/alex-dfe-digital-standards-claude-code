/*
  Warnings:

  - You are about to drop the column `publishedAt` on the `standards_version` table. All the data in the column will be lost.
  - You are about to drop the column `sourceNotes` on the `standards_version` table. All the data in the column will be lost.
  - Added the required column `published_at` to the `standards_version` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "app"."standards_version" DROP COLUMN "publishedAt",
DROP COLUMN "sourceNotes",
ADD COLUMN     "published_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "source_notes" TEXT;
