/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "full_description" TEXT,
ADD COLUMN     "full_description_html" TEXT,
ADD COLUMN     "full_description_json" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name";
