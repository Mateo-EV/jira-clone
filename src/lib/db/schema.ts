import { createId } from "@paralleldrive/cuid2"
import { relations } from "drizzle-orm"
import {
  date,
  index,
  integer,
  pgTable,
  primaryKey,
  timestamp,
  varchar
} from "drizzle-orm/pg-core"

const id = varchar("id", { length: 30 })
  .primaryKey()
  .$defaultFn(() => createId())

export const usersTable = pgTable("users", {
  id,
  name: varchar("name", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull().unique(),
  password: varchar("password", { length: 191 }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
    precision: 0
  })
    .notNull()
    .defaultNow()
})

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  workspaces: many(workspacesTable),
  members: many(membersTable),
  tasksAssigned: many(tasksTable)
}))

export const workspacesTable = pgTable("workspaces", {
  id,
  name: varchar("name", { length: 191 }).notNull(),
  image: varchar("image", { length: 191 }),
  creatorId: varchar("user_id", { length: 30 })
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade"
    })
    .notNull(),
  inviteCode: varchar("invite_code", { length: 20 }).unique().notNull()
})

export const workspacesTableRelations = relations(
  workspacesTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [workspacesTable.creatorId],
      references: [usersTable.id]
    }),
    members: many(membersTable),
    projects: many(projectsTable),
    tasks: many(tasksTable)
  })
)

export const membersTable = pgTable(
  "members",
  {
    userId: varchar("user_id", { length: 30 })
      .references(() => usersTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade"
      })
      .notNull(),
    workspaceId: varchar("workspace_id", { length: 30 })
      .references(() => workspacesTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade"
      })
      .notNull(),
    role: varchar("role", { enum: ["admin", "member"] }).notNull()
  },
  t => ({
    primary: primaryKey({ columns: [t.userId, t.workspaceId] })
  })
)

export const membersTableRelations = relations(membersTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [membersTable.userId],
    references: [usersTable.id]
  }),
  workspace: one(workspacesTable, {
    fields: [membersTable.workspaceId],
    references: [workspacesTable.id]
  })
}))

export const projectsTable = pgTable(
  "projects",
  {
    id,
    name: varchar("name", { length: 191 }).notNull(),
    workspaceId: varchar("workspace_id", { length: 30 })
      .references(() => workspacesTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade"
      })
      .notNull(),
    image: varchar("image", { length: 191 }),
    lastModifiedAt: timestamp("last_modified_at", {
      mode: "date",
      withTimezone: true,
      precision: 0
    })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  t => ({
    lastModifiedIndex: index().on(t.lastModifiedAt)
  })
)

export const projectsTableRelations = relations(
  projectsTable,
  ({ one, many }) => ({
    workspace: one(workspacesTable, {
      fields: [projectsTable.workspaceId],
      references: [workspacesTable.id]
    }),
    tasks: many(tasksTable)
  })
)

export const tasksTable = pgTable("tasks", {
  id,
  name: varchar("name", { length: 191 }).notNull(),
  description: varchar("description", { length: 255 }),
  projectId: varchar("project_id", { length: 30 })
    .references(() => projectsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade"
    })
    .notNull(),
  workspaceId: varchar("workspace_id", { length: 30 })
    .references(() => workspacesTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade"
    })
    .notNull(),
  assigneeId: varchar("assignee_id", { length: 30 })
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade"
    })
    .notNull(),
  status: integer("status").notNull(),
  dueDate: date("due_date", { mode: "date" }).notNull(),
  position: integer("position").notNull()
})

export const tasksTableRelations = relations(tasksTable, ({ one }) => ({
  workspace: one(workspacesTable, {
    fields: [tasksTable.workspaceId],
    references: [workspacesTable.id]
  }),
  project: one(projectsTable, {
    fields: [tasksTable.projectId],
    references: [projectsTable.id]
  }),
  assignee: one(usersTable, {
    fields: [tasksTable.projectId],
    references: [usersTable.id]
  })
}))
