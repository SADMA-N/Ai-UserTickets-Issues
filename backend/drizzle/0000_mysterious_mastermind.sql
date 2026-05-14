CREATE TYPE "public"."TaskState" AS ENUM('pending', 'processing', 'completed', 'completed_with_fallback', 'needs_manual_review');--> statement-breakpoint
CREATE TABLE "Task" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"state" "TaskState" DEFAULT 'pending' NOT NULL,
	"currentPhase" text,
	"phase1Retries" integer DEFAULT 0 NOT NULL,
	"phase2Retries" integer DEFAULT 0 NOT NULL,
	"phase1Done" boolean DEFAULT false NOT NULL,
	"phase2Done" boolean DEFAULT false NOT NULL,
	"inputTicket" jsonb NOT NULL,
	"phase1Output" jsonb,
	"phase2Output" jsonb,
	"fallbackReason" text,
	"fallbackAt" timestamp (3),
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"stateChangedAt" timestamp (3) DEFAULT now() NOT NULL,
	"lastMutatedAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX "Task_state_idx" ON "Task" USING btree ("state");--> statement-breakpoint
CREATE INDEX "Task_createdAt_idx" ON "Task" USING btree ("createdAt");