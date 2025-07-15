/*
  Warnings:

  - The `full_description_json` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "full_description_json",
ADD COLUMN     "full_description_json" JSONB;
