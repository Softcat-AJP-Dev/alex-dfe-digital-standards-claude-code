-- Set CURRENT_TIMESTAMP defaults on updated_at columns. The Prisma
-- @updatedAt annotation is application-side and doesn't generate a
-- Postgres default; raw-SQL INSERTs (used by this app) leave it NULL
-- and the NOT NULL constraint fails.

-- AlterTable
ALTER TABLE "app"."customer" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "app"."response" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
