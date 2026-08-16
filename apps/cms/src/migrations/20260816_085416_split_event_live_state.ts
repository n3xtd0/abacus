import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_live_event_status" AS ENUM ('paused', 'running');

    CREATE TABLE "live_event" (
      "id" serial PRIMARY KEY NOT NULL,
      "event_id" integer NOT NULL,
      "num_entries" numeric DEFAULT 0 NOT NULL,
      "num_rebuys" numeric DEFAULT 0,
      "num_addons" numeric DEFAULT 0,
      "num_addups" numeric DEFAULT 0,
      "num_topups" numeric DEFAULT 0,
      "num_maxups" numeric DEFAULT 0,
      "current_level_id" integer NOT NULL,
      "current_time" numeric NOT NULL,
      "status" "enum_live_event_status" DEFAULT 'paused' NOT NULL,
      "clock_started_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    INSERT INTO "live_event" (
      "event_id",
      "num_entries",
      "num_rebuys",
      "num_addons",
      "num_addups",
      "num_topups",
      "num_maxups",
      "current_level_id",
      "current_time",
      "status"
    )
    SELECT
      "event"."id",
      "event"."num_entries",
      "event"."num_rebuys",
      "event"."num_addons",
      "event"."num_addups",
      "event"."num_topups",
      "event"."num_maxups",
      "first_level"."level_id",
      COALESCE("level_duration"."time", "structure"."main_time") * 60,
      'paused'
    FROM "event"
    INNER JOIN "tourney" ON "tourney"."id" = "event"."tourney_id"
    INNER JOIN "structure" ON "structure"."id" = "tourney"."structure_id"
    INNER JOIN LATERAL (
      SELECT "structure_rels"."level_id"
      FROM "structure_rels"
      WHERE "structure_rels"."parent_id" = "structure"."id"
        AND "structure_rels"."path" = 'levels'
        AND "structure_rels"."level_id" IS NOT NULL
      ORDER BY "structure_rels"."order" ASC NULLS LAST, "structure_rels"."id" ASC
      LIMIT 1
    ) AS "first_level" ON true
    LEFT JOIN "structure_level_durations" AS "level_duration"
      ON "level_duration"."_parent_id" = "structure"."id"
      AND "level_duration"."level_id" = "first_level"."level_id";

    ALTER TABLE "live_event"
      ADD CONSTRAINT "live_event_event_id_event_id_fk"
      FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE no action;
    ALTER TABLE "live_event"
      ADD CONSTRAINT "live_event_current_level_id_level_id_fk"
      FOREIGN KEY ("current_level_id") REFERENCES "public"."level"("id") ON DELETE RESTRICT ON UPDATE no action;

    CREATE UNIQUE INDEX "live_event_event_idx" ON "live_event" USING btree ("event_id");
    CREATE INDEX "live_event_current_level_idx" ON "live_event" USING btree ("current_level_id");
    CREATE INDEX "live_event_updated_at_idx" ON "live_event" USING btree ("updated_at");
    CREATE INDEX "live_event_created_at_idx" ON "live_event" USING btree ("created_at");

    ALTER TABLE "event"
      DROP COLUMN "num_entries",
      DROP COLUMN "num_rebuys",
      DROP COLUMN "num_addons",
      DROP COLUMN "num_addups",
      DROP COLUMN "num_topups",
      DROP COLUMN "num_maxups";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "event"
      ADD COLUMN "num_entries" numeric,
      ADD COLUMN "num_rebuys" numeric,
      ADD COLUMN "num_addons" numeric,
      ADD COLUMN "num_addups" numeric,
      ADD COLUMN "num_topups" numeric,
      ADD COLUMN "num_maxups" numeric;

    UPDATE "event"
    SET
      "num_entries" = "live_event"."num_entries",
      "num_rebuys" = "live_event"."num_rebuys",
      "num_addons" = "live_event"."num_addons",
      "num_addups" = "live_event"."num_addups",
      "num_topups" = "live_event"."num_topups",
      "num_maxups" = "live_event"."num_maxups"
    FROM "live_event"
    WHERE "event"."id" = "live_event"."event_id";

    ALTER TABLE "event" ALTER COLUMN "num_entries" SET NOT NULL;

    DROP TABLE "live_event";
    DROP TYPE "public"."enum_live_event_status";
  `)
}
