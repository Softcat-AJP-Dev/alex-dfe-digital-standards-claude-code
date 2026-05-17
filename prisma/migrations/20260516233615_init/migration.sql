-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "app";

-- CreateEnum
CREATE TYPE "app"."standard_category" AS ENUM ('Core', 'Additional');

-- CreateEnum
CREATE TYPE "app"."school_phase" AS ENUM ('Primary', 'Secondary', 'AllThrough', 'FE', 'SpecialSEND');

-- CreateEnum
CREATE TYPE "app"."assessment_status" AS ENUM ('InProgress', 'Completed', 'Archived');

-- CreateEnum
CREATE TYPE "app"."evidence_kind" AS ENUM ('Note', 'Link', 'InlineFile');

-- CreateTable
CREATE TABLE "app"."standards_version" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "sourceNotes" TEXT,

    CONSTRAINT "standards_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."standard" (
    "id" TEXT NOT NULL,
    "version_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "app"."standard_category" NOT NULL,
    "summary" TEXT NOT NULL,
    "gov_uk_url" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "standard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."sub_criterion" (
    "id" TEXT NOT NULL,
    "standard_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rationale" TEXT,
    "must_have" BOOLEAN NOT NULL DEFAULT false,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "sub_criterion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."level_descriptor" (
    "id" TEXT NOT NULL,
    "sub_criterion_id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "descriptor" TEXT NOT NULL,
    "evidence_hints" TEXT,

    CONSTRAINT "level_descriptor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "urn" TEXT,
    "phase" "app"."school_phase" NOT NULL,
    "trust_name" TEXT,
    "owner_oid" TEXT NOT NULL,
    "owner_email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."assessment" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "version_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "app"."assessment_status" NOT NULL DEFAULT 'InProgress',
    "assessor_oid" TEXT NOT NULL,
    "assessor_email" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."response" (
    "id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "sub_criterion_id" TEXT NOT NULL,
    "level" INTEGER,
    "not_applicable" BOOLEAN NOT NULL DEFAULT false,
    "rationale" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."evidence" (
    "id" TEXT NOT NULL,
    "response_id" TEXT NOT NULL,
    "kind" "app"."evidence_kind" NOT NULL,
    "label" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."report" (
    "id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generated_by_oid" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "overall_score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "standards_version_version_key" ON "app"."standards_version"("version");

-- CreateIndex
CREATE UNIQUE INDEX "standard_version_id_slug_key" ON "app"."standard"("version_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "sub_criterion_standard_id_code_key" ON "app"."sub_criterion"("standard_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "level_descriptor_sub_criterion_id_level_key" ON "app"."level_descriptor"("sub_criterion_id", "level");

-- CreateIndex
CREATE INDEX "customer_owner_oid_idx" ON "app"."customer"("owner_oid");

-- CreateIndex
CREATE INDEX "assessment_customer_id_idx" ON "app"."assessment"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "response_assessment_id_sub_criterion_id_key" ON "app"."response"("assessment_id", "sub_criterion_id");

-- AddForeignKey
ALTER TABLE "app"."standard" ADD CONSTRAINT "standard_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "app"."standards_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."sub_criterion" ADD CONSTRAINT "sub_criterion_standard_id_fkey" FOREIGN KEY ("standard_id") REFERENCES "app"."standard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."level_descriptor" ADD CONSTRAINT "level_descriptor_sub_criterion_id_fkey" FOREIGN KEY ("sub_criterion_id") REFERENCES "app"."sub_criterion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."assessment" ADD CONSTRAINT "assessment_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "app"."customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."assessment" ADD CONSTRAINT "assessment_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "app"."standards_version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."response" ADD CONSTRAINT "response_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "app"."assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."response" ADD CONSTRAINT "response_sub_criterion_id_fkey" FOREIGN KEY ("sub_criterion_id") REFERENCES "app"."sub_criterion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."evidence" ADD CONSTRAINT "evidence_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "app"."response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."report" ADD CONSTRAINT "report_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "app"."assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
