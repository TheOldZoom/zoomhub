/*
  Warnings:

  - You are about to drop the column `published` on the `Journal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Journal" DROP COLUMN "published",
ADD COLUMN     "published_at" TIMESTAMP(3);
