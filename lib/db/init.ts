// Database initialization script
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_URL?.replace('file:', '') || path.join(process.cwd(), 'prisma', 'dev.db');

console.log('Initializing database at:', dbPath);

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Program (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS UserProgram (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    programId TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (programId) REFERENCES Program(id) ON DELETE CASCADE,
    UNIQUE(userId, programId)
  );

  CREATE TABLE IF NOT EXISTS Course (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    programId TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    FOREIGN KEY (programId) REFERENCES Program(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS LearningLine (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ProgramLearningLine (
    id TEXT PRIMARY KEY,
    programId TEXT NOT NULL,
    learningLineId TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    FOREIGN KEY (programId) REFERENCES Program(id) ON DELETE CASCADE,
    FOREIGN KEY (learningLineId) REFERENCES LearningLine(id) ON DELETE CASCADE,
    UNIQUE(programId, learningLineId)
  );

  CREATE TABLE IF NOT EXISTS Track (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ProgramTrack (
    id TEXT PRIMARY KEY,
    programId TEXT NOT NULL,
    trackId TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    FOREIGN KEY (programId) REFERENCES Program(id) ON DELETE CASCADE,
    FOREIGN KEY (trackId) REFERENCES Track(id) ON DELETE CASCADE,
    UNIQUE(programId, trackId)
  );

  CREATE TABLE IF NOT EXISTS Component (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    learningLineId TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    FOREIGN KEY (learningLineId) REFERENCES LearningLine(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Content (
    id TEXT PRIMARY KEY,
    richTextBody TEXT NOT NULL,
    programId TEXT NOT NULL,
    learningLineId TEXT NOT NULL,
    componentId TEXT NOT NULL,
    trackId TEXT NOT NULL,
    courseId TEXT NOT NULL,
    createdById TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    FOREIGN KEY (programId) REFERENCES Program(id) ON DELETE CASCADE,
    FOREIGN KEY (learningLineId) REFERENCES LearningLine(id) ON DELETE CASCADE,
    FOREIGN KEY (componentId) REFERENCES Component(id) ON DELETE CASCADE,
    FOREIGN KEY (trackId) REFERENCES Track(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES Course(id) ON DELETE CASCADE,
    FOREIGN KEY (createdById) REFERENCES User(id)
  );

  CREATE INDEX IF NOT EXISTS idx_user_email ON User(email);
  CREATE INDEX IF NOT EXISTS idx_userprogram_userid ON UserProgram(userId);
  CREATE INDEX IF NOT EXISTS idx_userprogram_programid ON UserProgram(programId);
  CREATE INDEX IF NOT EXISTS idx_course_programid ON Course(programId);
  CREATE INDEX IF NOT EXISTS idx_programlearningline_programid ON ProgramLearningLine(programId);
  CREATE INDEX IF NOT EXISTS idx_programlearningline_learninglineid ON ProgramLearningLine(learningLineId);
  CREATE INDEX IF NOT EXISTS idx_programtrack_programid ON ProgramTrack(programId);
  CREATE INDEX IF NOT EXISTS idx_programtrack_trackid ON ProgramTrack(trackId);
  CREATE INDEX IF NOT EXISTS idx_component_learninglineid ON Component(learningLineId);
  CREATE INDEX IF NOT EXISTS idx_content_programid ON Content(programId);
  CREATE INDEX IF NOT EXISTS idx_content_learninglineid ON Content(learningLineId);
  CREATE INDEX IF NOT EXISTS idx_content_componentid ON Content(componentId);
  CREATE INDEX IF NOT EXISTS idx_content_trackid ON Content(trackId);
  CREATE INDEX IF NOT EXISTS idx_content_courseid ON Content(courseId);
  CREATE INDEX IF NOT EXISTS idx_content_createdbyid ON Content(createdById);
`);

console.log('Database tables created successfully!');
sqlite.close();
