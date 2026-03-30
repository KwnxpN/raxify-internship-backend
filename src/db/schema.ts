import { pgTable, text, timestamp, varchar, uuid, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql/sql";

export const events = pgTable("events", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  maxParticipants: integer("max_participants"),
  registeredCount: integer("registered_count").default(0),
});