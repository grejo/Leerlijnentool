// Database seed script
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { randomUUID } from 'crypto';

function generateId(): string {
  return randomUUID().replace(/-/g, '').substring(0, 25);
}

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
console.log('Seeding database at:', dbPath);

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

async function main() {
  console.log('Start seeding...');

  const now = Date.now();

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminId = generateId();

  sqlite.prepare(`
    INSERT OR REPLACE INTO User (id, email, password, role, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(adminId, 'admin@leerlijnentool.nl', hashedPassword, 'ADMIN', now, now);
  console.log('Created admin user: admin@leerlijnentool.nl');

  // Create docent user
  const docentPassword = await bcrypt.hash('docent123', 10);
  const docentId = generateId();
  sqlite.prepare(`
    INSERT OR REPLACE INTO User (id, email, password, role, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(docentId, 'docent@leerlijnentool.nl', docentPassword, 'DOCENT', now, now);
  console.log('Created docent user: docent@leerlijnentool.nl');

  // Create student user
  const studentPassword = await bcrypt.hash('student123', 10);
  const studentId = generateId();
  sqlite.prepare(`
    INSERT OR REPLACE INTO User (id, email, password, role, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(studentId, 'student@leerlijnentool.nl', studentPassword, 'STUDENT', now, now);
  console.log('Created student user: student@leerlijnentool.nl');

  // Create programs
  const programId1 = 'program-1';
  const programId2 = 'program-2';

  sqlite.prepare(`
    INSERT OR REPLACE INTO Program (id, name, createdAt, updatedAt)
    VALUES (?, ?, ?, ?)
  `).run(programId1, 'Bachelor Informatica', now, now);

  sqlite.prepare(`
    INSERT OR REPLACE INTO Program (id, name, createdAt, updatedAt)
    VALUES (?, ?, ?, ?)
  `).run(programId2, 'Bachelor Bedrijfsmanagement', now, now);
  console.log('Created programs');

  // Assign docent to program
  sqlite.prepare(`
    INSERT OR REPLACE INTO UserProgram (id, userId, programId, createdAt)
    VALUES (?, ?, ?, ?)
  `).run(generateId(), docentId, programId1, now);
  console.log('Assigned docent to program');

  // Create learning lines
  const llId1 = 'll-1';
  const llId2 = 'll-2';

  sqlite.prepare(`
    INSERT OR REPLACE INTO LearningLine (id, title, createdAt, updatedAt)
    VALUES (?, ?, ?, ?)
  `).run(llId1, 'Programmeren', now, now);

  sqlite.prepare(`
    INSERT OR REPLACE INTO LearningLine (id, title, createdAt, updatedAt)
    VALUES (?, ?, ?, ?)
  `).run(llId2, 'Databases', now, now);
  console.log('Created learning lines');

  // Link learning lines to programs
  sqlite.prepare(`
    INSERT OR REPLACE INTO ProgramLearningLine (id, programId, learningLineId, createdAt)
    VALUES (?, ?, ?, ?)
  `).run('pll-1', programId1, llId1, now);

  sqlite.prepare(`
    INSERT OR REPLACE INTO ProgramLearningLine (id, programId, learningLineId, createdAt)
    VALUES (?, ?, ?, ?)
  `).run('pll-2', programId1, llId2, now);
  console.log('Linked learning lines to programs');

  // Create tracks
  const trackId1 = 'track-1';
  const trackId2 = 'track-2';

  sqlite.prepare(`
    INSERT OR REPLACE INTO Track (id, name, "order", createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?)
  `).run(trackId1, 'Jaar 1', 1, now, now);

  sqlite.prepare(`
    INSERT OR REPLACE INTO Track (id, name, "order", createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?)
  `).run(trackId2, 'Jaar 2', 2, now, now);
  console.log('Created tracks');

  // Create courses
  const courseId1 = 'course-1';
  const courseId2 = 'course-2';

  sqlite.prepare(`
    INSERT OR REPLACE INTO Course (id, name, programId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?)
  `).run(courseId1, 'Inleiding Programmeren', programId1, now, now);

  sqlite.prepare(`
    INSERT OR REPLACE INTO Course (id, name, programId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?)
  `).run(courseId2, 'Datamodellering', programId1, now, now);
  console.log('Created courses');

  // Create components
  const compId1 = 'comp-1';
  const compId2 = 'comp-2';

  sqlite.prepare(`
    INSERT OR REPLACE INTO Component (id, name, learningLineId, "order", createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(compId1, 'Basis Syntax', llId1, 1, now, now);

  sqlite.prepare(`
    INSERT OR REPLACE INTO Component (id, name, learningLineId, "order", createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(compId2, 'Object Georiënteerd Programmeren', llId1, 2, now, now);
  console.log('Created components');

  // Create sample content
  sqlite.prepare(`
    INSERT OR REPLACE INTO Content (id, richTextBody, programId, learningLineId, componentId, trackId, courseId, createdById, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'content-1',
    '<h3>Introductie tot Variabelen</h3><p>In deze les leer je over <strong>variabelen</strong> en datatypes.</p><ul><li>String</li><li>Integer</li><li>Boolean</li></ul>',
    programId1,
    llId1,
    compId1,
    trackId1,
    courseId1,
    adminId,
    now,
    now
  );
  console.log('Created sample content');

  console.log('Seeding finished.');
  console.log('');
  console.log('Test accounts:');
  console.log('  Admin:   admin@leerlijnentool.nl / admin123');
  console.log('  Docent:  docent@leerlijnentool.nl / docent123');
  console.log('  Student: student@leerlijnentool.nl / student123');
}

main()
  .then(() => {
    sqlite.close();
  })
  .catch((e) => {
    console.error(e);
    sqlite.close();
    process.exit(1);
  });
