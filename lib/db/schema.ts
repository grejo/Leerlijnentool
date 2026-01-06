import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = sqliteTable('User', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(), // ADMIN, DOCENT, or STUDENT
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Programs table
export const programs = sqliteTable('Program', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// UserProgram join table
export const userPrograms = sqliteTable('UserProgram', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  programId: text('programId').notNull().references(() => programs.id, { onDelete: 'cascade' }),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Courses table
export const courses = sqliteTable('Course', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  programId: text('programId').notNull().references(() => programs.id, { onDelete: 'cascade' }),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// LearningLines table
export const learningLines = sqliteTable('LearningLine', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ProgramLearningLine join table
export const programLearningLines = sqliteTable('ProgramLearningLine', {
  id: text('id').primaryKey(),
  programId: text('programId').notNull().references(() => programs.id, { onDelete: 'cascade' }),
  learningLineId: text('learningLineId').notNull().references(() => learningLines.id, { onDelete: 'cascade' }),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Tracks table
export const tracks = sqliteTable('Track', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  order: integer('order').notNull().default(0),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Components table
export const components = sqliteTable('Component', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  learningLineId: text('learningLineId').notNull().references(() => learningLines.id, { onDelete: 'cascade' }),
  order: integer('order').notNull().default(0),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Contents table
export const contents = sqliteTable('Content', {
  id: text('id').primaryKey(),
  richTextBody: text('richTextBody').notNull(),
  programId: text('programId').notNull().references(() => programs.id, { onDelete: 'cascade' }),
  learningLineId: text('learningLineId').notNull().references(() => learningLines.id, { onDelete: 'cascade' }),
  componentId: text('componentId').notNull().references(() => components.id, { onDelete: 'cascade' }),
  trackId: text('trackId').notNull().references(() => tracks.id, { onDelete: 'cascade' }),
  courseId: text('courseId').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  createdById: text('createdById').notNull().references(() => users.id),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  programs: many(userPrograms),
  contents: many(contents),
}));

export const programsRelations = relations(programs, ({ many }) => ({
  users: many(userPrograms),
  courses: many(courses),
  learningLines: many(programLearningLines),
  contents: many(contents),
}));

export const userProgramsRelations = relations(userPrograms, ({ one }) => ({
  user: one(users, { fields: [userPrograms.userId], references: [users.id] }),
  program: one(programs, { fields: [userPrograms.programId], references: [programs.id] }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  program: one(programs, { fields: [courses.programId], references: [programs.id] }),
  contents: many(contents),
}));

export const learningLinesRelations = relations(learningLines, ({ many }) => ({
  programs: many(programLearningLines),
  components: many(components),
  contents: many(contents),
}));

export const programLearningLinesRelations = relations(programLearningLines, ({ one }) => ({
  program: one(programs, { fields: [programLearningLines.programId], references: [programs.id] }),
  learningLine: one(learningLines, { fields: [programLearningLines.learningLineId], references: [learningLines.id] }),
}));

export const tracksRelations = relations(tracks, ({ many }) => ({
  contents: many(contents),
}));

export const componentsRelations = relations(components, ({ one, many }) => ({
  learningLine: one(learningLines, { fields: [components.learningLineId], references: [learningLines.id] }),
  contents: many(contents),
}));

export const contentsRelations = relations(contents, ({ one }) => ({
  program: one(programs, { fields: [contents.programId], references: [programs.id] }),
  learningLine: one(learningLines, { fields: [contents.learningLineId], references: [learningLines.id] }),
  component: one(components, { fields: [contents.componentId], references: [components.id] }),
  track: one(tracks, { fields: [contents.trackId], references: [tracks.id] }),
  course: one(courses, { fields: [contents.courseId], references: [courses.id] }),
  createdBy: one(users, { fields: [contents.createdById], references: [users.id] }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type LearningLine = typeof learningLines.$inferSelect;
export type NewLearningLine = typeof learningLines.$inferInsert;
export type Track = typeof tracks.$inferSelect;
export type NewTrack = typeof tracks.$inferInsert;
export type Component = typeof components.$inferSelect;
export type NewComponent = typeof components.$inferInsert;
export type Content = typeof contents.$inferSelect;
export type NewContent = typeof contents.$inferInsert;
