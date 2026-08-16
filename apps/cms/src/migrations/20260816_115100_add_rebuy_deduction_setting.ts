import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tourney"
    ADD COLUMN IF NOT EXISTS "deduct_rebuy_costs" boolean DEFAULT false NOT NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "tourney"
    DROP COLUMN IF EXISTS "deduct_rebuy_costs";
  `)
}
