import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "projects_case_study_strategy" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "projects_case_study_deliverables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "projects_case_study_impact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_projects_v_version_case_study_strategy" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_case_study_deliverables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_case_study_impact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "profile_tools_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "profile_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "profile_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"author" varchar NOT NULL,
  	"context" varchar
  );
  
  ALTER TABLE "projects" ADD COLUMN "case_study_challenge" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_case_study_challenge" varchar;
  ALTER TABLE "profile" ADD COLUMN "availability" varchar;
  ALTER TABLE "profile" ADD COLUMN "drive" varchar;
  ALTER TABLE "profile" ADD COLUMN "contact_lead" varchar;
  ALTER TABLE "profile" ADD COLUMN "cv_id" integer;
  ALTER TABLE "projects_case_study_strategy" ADD CONSTRAINT "projects_case_study_strategy_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_deliverables" ADD CONSTRAINT "projects_case_study_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_impact" ADD CONSTRAINT "projects_case_study_impact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_case_study_strategy" ADD CONSTRAINT "_projects_v_version_case_study_strategy_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_case_study_deliverables" ADD CONSTRAINT "_projects_v_version_case_study_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_case_study_impact" ADD CONSTRAINT "_projects_v_version_case_study_impact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_tools_items" ADD CONSTRAINT "profile_tools_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_tools" ADD CONSTRAINT "profile_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_testimonials" ADD CONSTRAINT "profile_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_case_study_strategy_order_idx" ON "projects_case_study_strategy" USING btree ("_order");
  CREATE INDEX "projects_case_study_strategy_parent_id_idx" ON "projects_case_study_strategy" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_deliverables_order_idx" ON "projects_case_study_deliverables" USING btree ("_order");
  CREATE INDEX "projects_case_study_deliverables_parent_id_idx" ON "projects_case_study_deliverables" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_impact_order_idx" ON "projects_case_study_impact" USING btree ("_order");
  CREATE INDEX "projects_case_study_impact_parent_id_idx" ON "projects_case_study_impact" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_case_study_strategy_order_idx" ON "_projects_v_version_case_study_strategy" USING btree ("_order");
  CREATE INDEX "_projects_v_version_case_study_strategy_parent_id_idx" ON "_projects_v_version_case_study_strategy" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_case_study_deliverables_order_idx" ON "_projects_v_version_case_study_deliverables" USING btree ("_order");
  CREATE INDEX "_projects_v_version_case_study_deliverables_parent_id_idx" ON "_projects_v_version_case_study_deliverables" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_case_study_impact_order_idx" ON "_projects_v_version_case_study_impact" USING btree ("_order");
  CREATE INDEX "_projects_v_version_case_study_impact_parent_id_idx" ON "_projects_v_version_case_study_impact" USING btree ("_parent_id");
  CREATE INDEX "profile_tools_items_order_idx" ON "profile_tools_items" USING btree ("_order");
  CREATE INDEX "profile_tools_items_parent_id_idx" ON "profile_tools_items" USING btree ("_parent_id");
  CREATE INDEX "profile_tools_order_idx" ON "profile_tools" USING btree ("_order");
  CREATE INDEX "profile_tools_parent_id_idx" ON "profile_tools" USING btree ("_parent_id");
  CREATE INDEX "profile_testimonials_order_idx" ON "profile_testimonials" USING btree ("_order");
  CREATE INDEX "profile_testimonials_parent_id_idx" ON "profile_testimonials" USING btree ("_parent_id");
  ALTER TABLE "profile" ADD CONSTRAINT "profile_cv_id_media_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "profile_cv_idx" ON "profile" USING btree ("cv_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_case_study_strategy" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_case_study_deliverables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_case_study_impact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_case_study_strategy" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_case_study_deliverables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_case_study_impact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "profile_tools_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "profile_tools" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "profile_testimonials" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_case_study_strategy" CASCADE;
  DROP TABLE "projects_case_study_deliverables" CASCADE;
  DROP TABLE "projects_case_study_impact" CASCADE;
  DROP TABLE "_projects_v_version_case_study_strategy" CASCADE;
  DROP TABLE "_projects_v_version_case_study_deliverables" CASCADE;
  DROP TABLE "_projects_v_version_case_study_impact" CASCADE;
  DROP TABLE "profile_tools_items" CASCADE;
  DROP TABLE "profile_tools" CASCADE;
  DROP TABLE "profile_testimonials" CASCADE;
  ALTER TABLE "profile" DROP CONSTRAINT "profile_cv_id_media_id_fk";
  
  DROP INDEX "profile_cv_idx";
  ALTER TABLE "projects" DROP COLUMN "case_study_challenge";
  ALTER TABLE "_projects_v" DROP COLUMN "version_case_study_challenge";
  ALTER TABLE "profile" DROP COLUMN "availability";
  ALTER TABLE "profile" DROP COLUMN "drive";
  ALTER TABLE "profile" DROP COLUMN "contact_lead";
  ALTER TABLE "profile" DROP COLUMN "cv_id";`)
}
