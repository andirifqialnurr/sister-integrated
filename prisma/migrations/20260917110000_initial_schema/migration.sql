-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "app_role" AS ENUM ('ADMIN', 'OPERATOR', 'REVIEWER', 'VIEWER');

-- CreateEnum
CREATE TYPE "sister_operation_status" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'NEEDS_REVIEW');

-- CreateEnum
CREATE TYPE "security_severity" AS ENUM ('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "security_outcome" AS ENUM ('SUCCESS', 'DENIED', 'FAILED', 'BLOCKED', 'DETECTED');

-- CreateTable
CREATE TABLE "app_user" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "role" "app_role" NOT NULL DEFAULT 'VIEWER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sister_integration" (
    "id" UUID NOT NULL,
    "external_pt_id" VARCHAR(128),
    "base_url" VARCHAR(2048) NOT NULL,
    "api_version" VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    "credential_ref" VARCHAR(255) NOT NULL,
    "expected_role" VARCHAR(32),
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "last_health_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sister_integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sister_reference_cache" (
    "id" UUID NOT NULL,
    "integration_id" UUID NOT NULL,
    "endpoint" VARCHAR(255) NOT NULL,
    "query_hash" VARCHAR(128) NOT NULL,
    "payload_json" JSONB NOT NULL,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_error" TEXT,

    CONSTRAINT "sister_reference_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sister_sdm_index_cache" (
    "integration_id" UUID NOT NULL,
    "id_sdm" VARCHAR(128) NOT NULL,
    "nama_sdm" VARCHAR(255) NOT NULL,
    "nidn" VARCHAR(64),
    "nip" VARCHAR(64),
    "nuptk" VARCHAR(64),
    "nama_status_aktif" VARCHAR(128),
    "nama_status_pegawai" VARCHAR(128),
    "jenis_sdm" VARCHAR(128),
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sister_sdm_index_cache_pkey" PRIMARY KEY ("integration_id","id_sdm")
);

-- CreateTable
CREATE TABLE "sister_operation" (
    "id" UUID NOT NULL,
    "integration_id" UUID NOT NULL,
    "actor_user_id" UUID,
    "method" VARCHAR(8) NOT NULL,
    "path_template" VARCHAR(512) NOT NULL,
    "resource_type" VARCHAR(128) NOT NULL,
    "resource_id" VARCHAR(128),
    "request_fingerprint" VARCHAR(128) NOT NULL,
    "request_redacted_json" JSONB,
    "response_status" INTEGER,
    "external_id" VARCHAR(128),
    "local_status" "sister_operation_status" NOT NULL DEFAULT 'PENDING',
    "external_message" TEXT,
    "external_detail" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "sister_operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_audit_event" (
    "id" UUID NOT NULL,
    "event_type" VARCHAR(128) NOT NULL,
    "severity" "security_severity" NOT NULL,
    "outcome" "security_outcome" NOT NULL,
    "actor_user_id" UUID,
    "integration_id" UUID,
    "request_id" VARCHAR(128) NOT NULL,
    "route_or_procedure" VARCHAR(512) NOT NULL,
    "target_type" VARCHAR(128),
    "target_id" VARCHAR(128),
    "source_ip_hash" VARCHAR(128),
    "user_agent_hash" VARCHAR(128),
    "metadata_redacted_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" UUID,

    CONSTRAINT "security_audit_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_user_email_key" ON "app_user"("email");

-- CreateIndex
CREATE INDEX "sister_integration_is_enabled_idx" ON "sister_integration"("is_enabled");

-- CreateIndex
CREATE INDEX "sister_reference_cache_expires_at_idx" ON "sister_reference_cache"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "sister_reference_cache_integration_id_endpoint_query_hash_key" ON "sister_reference_cache"("integration_id", "endpoint", "query_hash");

-- CreateIndex
CREATE INDEX "sister_sdm_index_cache_integration_id_nama_sdm_idx" ON "sister_sdm_index_cache"("integration_id", "nama_sdm");

-- CreateIndex
CREATE INDEX "sister_sdm_index_cache_integration_id_nidn_idx" ON "sister_sdm_index_cache"("integration_id", "nidn");

-- CreateIndex
CREATE INDEX "sister_sdm_index_cache_integration_id_nip_idx" ON "sister_sdm_index_cache"("integration_id", "nip");

-- CreateIndex
CREATE INDEX "sister_operation_integration_id_started_at_idx" ON "sister_operation"("integration_id", "started_at");

-- CreateIndex
CREATE INDEX "sister_operation_integration_id_local_status_idx" ON "sister_operation"("integration_id", "local_status");

-- CreateIndex
CREATE INDEX "sister_operation_actor_user_id_started_at_idx" ON "sister_operation"("actor_user_id", "started_at");

-- CreateIndex
CREATE INDEX "security_audit_event_created_at_idx" ON "security_audit_event"("created_at");

-- CreateIndex
CREATE INDEX "security_audit_event_severity_outcome_created_at_idx" ON "security_audit_event"("severity", "outcome", "created_at");

-- CreateIndex
CREATE INDEX "security_audit_event_actor_user_id_created_at_idx" ON "security_audit_event"("actor_user_id", "created_at");

-- CreateIndex
CREATE INDEX "security_audit_event_integration_id_created_at_idx" ON "security_audit_event"("integration_id", "created_at");

-- AddForeignKey
ALTER TABLE "sister_reference_cache" ADD CONSTRAINT "sister_reference_cache_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "sister_integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sister_sdm_index_cache" ADD CONSTRAINT "sister_sdm_index_cache_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "sister_integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sister_operation" ADD CONSTRAINT "sister_operation_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "sister_integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sister_operation" ADD CONSTRAINT "sister_operation_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_audit_event" ADD CONSTRAINT "security_audit_event_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_audit_event" ADD CONSTRAINT "security_audit_event_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "sister_integration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_audit_event" ADD CONSTRAINT "security_audit_event_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
