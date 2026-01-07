// Database seed script with comprehensive dummy data
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { randomUUID } from 'crypto';

function generateId(): string {
  return randomUUID().replace(/-/g, '').substring(0, 25);
}

// Database is in the prisma folder
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
console.log('Seeding database at:', dbPath);

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

async function main() {
  console.log('Start seeding...');
  console.log('Clearing existing data...');

  // Clear existing data in correct order (respecting foreign keys)
  sqlite.exec('DELETE FROM Content');
  sqlite.exec('DELETE FROM Component');
  sqlite.exec('DELETE FROM ProgramLearningLine');
  sqlite.exec('DELETE FROM ProgramTrack');
  sqlite.exec('DELETE FROM UserProgram');
  sqlite.exec('DELETE FROM Course');
  sqlite.exec('DELETE FROM Track');
  sqlite.exec('DELETE FROM LearningLine');
  sqlite.exec('DELETE FROM Program');
  sqlite.exec('DELETE FROM User');

  const now = Date.now();

  // ============ USERS ============
  console.log('\nCreating users...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const docentPassword = await bcrypt.hash('docent123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  const adminId = generateId();
  const docentId1 = generateId();
  const docentId2 = generateId();
  const studentId1 = generateId();
  const studentId2 = generateId();

  const insertUser = sqlite.prepare(`
    INSERT INTO User (id, email, password, role, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(adminId, 'admin@pxl.be', adminPassword, 'ADMIN', now, now);
  insertUser.run(docentId1, 'jan.docent@pxl.be', docentPassword, 'DOCENT', now, now);
  insertUser.run(docentId2, 'marie.docent@pxl.be', docentPassword, 'DOCENT', now, now);
  insertUser.run(studentId1, 'student@pxl.be', studentPassword, 'STUDENT', now, now);
  insertUser.run(studentId2, 'lisa.student@pxl.be', studentPassword, 'STUDENT', now, now);

  console.log('  Created 5 users');

  // ============ PROGRAMS ============
  console.log('\nCreating programs (opleidingen)...');

  const insertProgram = sqlite.prepare(`
    INSERT INTO Program (id, name, createdAt, updatedAt)
    VALUES (?, ?, ?, ?)
  `);

  const programVPK = 'prog-verpleegkunde';
  const programIT = 'prog-informatica';
  const programBM = 'prog-bedrijfsmanagement';

  insertProgram.run(programVPK, 'Bachelor Verpleegkunde', now, now);
  insertProgram.run(programIT, 'Bachelor Toegepaste Informatica', now, now);
  insertProgram.run(programBM, 'Bachelor Bedrijfsmanagement', now, now);

  console.log('  Created 3 programs');

  // ============ LEARNING LINES ============
  console.log('\nCreating learning lines (leerlijnen)...');

  const insertLL = sqlite.prepare(`
    INSERT INTO LearningLine (id, title, createdAt, updatedAt)
    VALUES (?, ?, ?, ?)
  `);

  // Verpleegkunde leerlijnen
  const llKlinisch = 'll-klinisch-redeneren';
  const llCommunicatie = 'll-communicatie';
  const llEthiek = 'll-ethiek';
  const llEvidence = 'll-evidence-based';

  // IT leerlijnen
  const llProgrammeren = 'll-programmeren';
  const llDatabases = 'll-databases';
  const llNetwerken = 'll-netwerken';

  // Bedrijfsmanagement leerlijnen
  const llMarketing = 'll-marketing';
  const llFinancieel = 'll-financieel';

  insertLL.run(llKlinisch, 'Klinisch Redeneren', now, now);
  insertLL.run(llCommunicatie, 'Professionele Communicatie', now, now);
  insertLL.run(llEthiek, 'Ethiek en Deontologie', now, now);
  insertLL.run(llEvidence, 'Evidence Based Practice', now, now);
  insertLL.run(llProgrammeren, 'Programmeren', now, now);
  insertLL.run(llDatabases, 'Databases & Data Management', now, now);
  insertLL.run(llNetwerken, 'Netwerken & Security', now, now);
  insertLL.run(llMarketing, 'Marketing & Sales', now, now);
  insertLL.run(llFinancieel, 'Financieel Management', now, now);

  console.log('  Created 9 learning lines');

  // ============ LINK PROGRAMS TO LEARNING LINES ============
  console.log('\nLinking programs to learning lines...');

  const insertPLL = sqlite.prepare(`
    INSERT INTO ProgramLearningLine (id, programId, learningLineId, createdAt)
    VALUES (?, ?, ?, ?)
  `);

  // Verpleegkunde
  insertPLL.run(generateId(), programVPK, llKlinisch, now);
  insertPLL.run(generateId(), programVPK, llCommunicatie, now);
  insertPLL.run(generateId(), programVPK, llEthiek, now);
  insertPLL.run(generateId(), programVPK, llEvidence, now);

  // IT
  insertPLL.run(generateId(), programIT, llProgrammeren, now);
  insertPLL.run(generateId(), programIT, llDatabases, now);
  insertPLL.run(generateId(), programIT, llNetwerken, now);

  // Bedrijfsmanagement
  insertPLL.run(generateId(), programBM, llMarketing, now);
  insertPLL.run(generateId(), programBM, llFinancieel, now);

  console.log('  Linked learning lines to programs');

  // ============ TRACKS ============
  console.log('\nCreating tracks (leertrajecten)...');

  const insertTrack = sqlite.prepare(`
    INSERT INTO Track (id, name, "order", createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?)
  `);

  const trackJ1S1 = 'track-j1s1';
  const trackJ1S2 = 'track-j1s2';
  const trackJ2S1 = 'track-j2s1';
  const trackJ2S2 = 'track-j2s2';
  const trackJ3S1 = 'track-j3s1';
  const trackJ3S2 = 'track-j3s2';

  insertTrack.run(trackJ1S1, 'Jaar 1 - Semester 1', 1, now, now);
  insertTrack.run(trackJ1S2, 'Jaar 1 - Semester 2', 2, now, now);
  insertTrack.run(trackJ2S1, 'Jaar 2 - Semester 1', 3, now, now);
  insertTrack.run(trackJ2S2, 'Jaar 2 - Semester 2', 4, now, now);
  insertTrack.run(trackJ3S1, 'Jaar 3 - Semester 1', 5, now, now);
  insertTrack.run(trackJ3S2, 'Jaar 3 - Semester 2', 6, now, now);

  console.log('  Created 6 tracks');

  // ============ LINK PROGRAMS TO TRACKS ============
  console.log('\nLinking programs to tracks...');

  const insertPT = sqlite.prepare(`
    INSERT INTO ProgramTrack (id, programId, trackId, createdAt)
    VALUES (?, ?, ?, ?)
  `);

  const allTracks = [trackJ1S1, trackJ1S2, trackJ2S1, trackJ2S2, trackJ3S1, trackJ3S2];
  const allPrograms = [programVPK, programIT, programBM];

  for (const prog of allPrograms) {
    for (const track of allTracks) {
      insertPT.run(generateId(), prog, track, now);
    }
  }

  console.log('  Linked tracks to all programs');

  // ============ COURSES ============
  console.log('\nCreating courses (vakken)...');

  const insertCourse = sqlite.prepare(`
    INSERT INTO Course (id, name, programId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Verpleegkunde vakken
  const courseAnatomie = 'course-anatomie';
  const courseFysiologie = 'course-fysiologie';
  const courseVVT = 'course-vvt';
  const courseFarmaco = 'course-farmaco';
  const courseStage1 = 'course-stage1';
  const courseGGZ = 'course-ggz';

  insertCourse.run(courseAnatomie, 'Anatomie & Fysiologie', programVPK, now, now);
  insertCourse.run(courseFysiologie, 'Pathofysiologie', programVPK, now, now);
  insertCourse.run(courseVVT, 'Verpleegtechnische Vaardigheden', programVPK, now, now);
  insertCourse.run(courseFarmaco, 'Farmacologie', programVPK, now, now);
  insertCourse.run(courseStage1, 'Stage Algemene Ziekenhuizen', programVPK, now, now);
  insertCourse.run(courseGGZ, 'Geestelijke Gezondheidszorg', programVPK, now, now);

  // IT vakken
  const courseProg1 = 'course-prog1';
  const courseProg2 = 'course-prog2';
  const courseDB = 'course-db';
  const courseWeb = 'course-web';
  const courseNetw = 'course-netw';

  insertCourse.run(courseProg1, 'Programming Essentials', programIT, now, now);
  insertCourse.run(courseProg2, 'Object Oriented Programming', programIT, now, now);
  insertCourse.run(courseDB, 'Database Fundamentals', programIT, now, now);
  insertCourse.run(courseWeb, 'Web Development', programIT, now, now);
  insertCourse.run(courseNetw, 'Network Administration', programIT, now, now);

  // Bedrijfsmanagement vakken
  const courseMark1 = 'course-mark1';
  const courseAcc = 'course-acc';
  const courseHRM = 'course-hrm';

  insertCourse.run(courseMark1, 'Marketing Basics', programBM, now, now);
  insertCourse.run(courseAcc, 'Boekhouden & Accounting', programBM, now, now);
  insertCourse.run(courseHRM, 'Human Resource Management', programBM, now, now);

  console.log('  Created 14 courses');

  // ============ COMPONENTS ============
  console.log('\nCreating components (vakgebieden)...');

  const insertComp = sqlite.prepare(`
    INSERT INTO Component (id, name, learningLineId, "order", createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Klinisch Redeneren components
  const compAnamnese = 'comp-anamnese';
  const compDiagnose = 'comp-diagnose';
  const compInterventie = 'comp-interventie';
  const compEvaluatie = 'comp-evaluatie';

  insertComp.run(compAnamnese, 'Anamnese & Assessment', llKlinisch, 1, now, now);
  insertComp.run(compDiagnose, 'Verpleegkundige Diagnose', llKlinisch, 2, now, now);
  insertComp.run(compInterventie, 'Interventies & Handelingen', llKlinisch, 3, now, now);
  insertComp.run(compEvaluatie, 'Evaluatie & Rapportage', llKlinisch, 4, now, now);

  // Communicatie components
  const compMondelinge = 'comp-mondeling';
  const compSchriftelijk = 'comp-schriftelijk';
  const compInterpersoonlijk = 'comp-interpersoonlijk';

  insertComp.run(compMondelinge, 'Mondelinge Communicatie', llCommunicatie, 1, now, now);
  insertComp.run(compSchriftelijk, 'Schriftelijke Rapportage', llCommunicatie, 2, now, now);
  insertComp.run(compInterpersoonlijk, 'Interpersoonlijke Vaardigheden', llCommunicatie, 3, now, now);

  // Ethiek components
  const compWetgeving = 'comp-wetgeving';
  const compDilemma = 'comp-dilemma';

  insertComp.run(compWetgeving, 'Wetgeving & Deontologie', llEthiek, 1, now, now);
  insertComp.run(compDilemma, 'Ethische Dilemma\'s', llEthiek, 2, now, now);

  // Evidence Based components
  const compOnderzoek = 'comp-onderzoek';
  const compLiteratuur = 'comp-literatuur';

  insertComp.run(compOnderzoek, 'Onderzoeksmethoden', llEvidence, 1, now, now);
  insertComp.run(compLiteratuur, 'Literatuuronderzoek', llEvidence, 2, now, now);

  // Programmeren components
  const compBasis = 'comp-basis';
  const compOOP = 'comp-oop';
  const compAdvanced = 'comp-advanced';

  insertComp.run(compBasis, 'Basis Syntax & Logica', llProgrammeren, 1, now, now);
  insertComp.run(compOOP, 'Object Georiënteerd Programmeren', llProgrammeren, 2, now, now);
  insertComp.run(compAdvanced, 'Advanced Programming Concepts', llProgrammeren, 3, now, now);

  // Database components
  const compSQL = 'comp-sql';
  const compModeling = 'comp-modeling';

  insertComp.run(compSQL, 'SQL & Query Languages', llDatabases, 1, now, now);
  insertComp.run(compModeling, 'Data Modeling', llDatabases, 2, now, now);

  // Netwerken components
  const compTCP = 'comp-tcp';
  const compSecurity = 'comp-security';

  insertComp.run(compTCP, 'TCP/IP & Protocols', llNetwerken, 1, now, now);
  insertComp.run(compSecurity, 'Network Security', llNetwerken, 2, now, now);

  // Marketing components
  const compDigital = 'comp-digital';
  const compBranding = 'comp-branding';

  insertComp.run(compDigital, 'Digital Marketing', llMarketing, 1, now, now);
  insertComp.run(compBranding, 'Branding & Positioning', llMarketing, 2, now, now);

  // Financieel components
  const compBoekhouding = 'comp-boekhouding';
  const compAnalyse = 'comp-analyse';

  insertComp.run(compBoekhouding, 'Boekhoudkundige Principes', llFinancieel, 1, now, now);
  insertComp.run(compAnalyse, 'Financiële Analyse', llFinancieel, 2, now, now);

  console.log('  Created 22 components');

  // ============ ASSIGN DOCENTS TO PROGRAMS ============
  console.log('\nAssigning docents to programs...');

  const insertUP = sqlite.prepare(`
    INSERT INTO UserProgram (id, userId, programId, createdAt)
    VALUES (?, ?, ?, ?)
  `);

  insertUP.run(generateId(), docentId1, programVPK, now);
  insertUP.run(generateId(), docentId1, programIT, now);
  insertUP.run(generateId(), docentId2, programBM, now);
  insertUP.run(generateId(), docentId2, programVPK, now);

  console.log('  Assigned docents to programs');

  // ============ CONTENT ============
  console.log('\nCreating content (leerinhoud)...');

  const insertContent = sqlite.prepare(`
    INSERT INTO Content (id, richTextBody, programId, learningLineId, componentId, trackId, courseId, createdById, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // --- VERPLEEGKUNDE CONTENT ---

  // Klinisch Redeneren - Anamnese
  insertContent.run(
    generateId(),
    `<h2>Introductie Anamnese</h2>
<p>De anamnese is het systematisch verzamelen van gegevens over de gezondheidstoestand van de patiënt. Het is de eerste stap in het verpleegkundig proces.</p>
<h3>Doelstellingen</h3>
<ul>
<li>De student kan een gestructureerde anamnese afnemen</li>
<li>De student herkent relevante informatie voor de zorgverlening</li>
<li>De student past actief luisteren toe tijdens het gesprek</li>
</ul>
<h3>Gordon's Functionele Gezondheidspatronen</h3>
<p>We gebruiken de 11 functionele gezondheidspatronen van Gordon als framework:</p>
<ol>
<li>Gezondheidsbeleving en -instandhouding</li>
<li>Voeding en stofwisseling</li>
<li>Uitscheiding</li>
<li>Activiteit en beweging</li>
<li>Slaap en rust</li>
<li>Cognitie en waarneming</li>
<li>Zelfbeleving</li>
<li>Rollen en relaties</li>
<li>Seksualiteit en voortplanting</li>
<li>Coping en stresstolerantie</li>
<li>Waarden en levensovertuiging</li>
</ol>`,
    programVPK, llKlinisch, compAnamnese, trackJ1S1, courseAnatomie, docentId1, now, now
  );

  insertContent.run(
    generateId(),
    `<h2>Verdieping Anamnese Technieken</h2>
<p>In dit onderdeel verdiepen we de technieken voor het afnemen van een anamnese.</p>
<h3>SBAR Communicatie</h3>
<p><strong>SBAR</strong> staat voor:</p>
<ul>
<li><strong>S</strong>ituation - Wat is de huidige situatie?</li>
<li><strong>B</strong>ackground - Wat is de relevante achtergrond?</li>
<li><strong>A</strong>ssessment - Wat is jouw beoordeling?</li>
<li><strong>R</strong>ecommendation - Wat stel je voor?</li>
</ul>
<h3>Praktijkoefening</h3>
<p>Oefen het SBAR-model in de vaardigheidstraining met een medestudent.</p>`,
    programVPK, llKlinisch, compAnamnese, trackJ1S2, courseVVT, docentId1, now, now
  );

  // Klinisch Redeneren - Diagnose
  insertContent.run(
    generateId(),
    `<h2>Verpleegkundige Diagnoses</h2>
<p>Een verpleegkundige diagnose beschrijft de reactie van een patiënt op een gezondheidsprobleem of levensproces.</p>
<h3>PES-structuur</h3>
<p>Elke diagnose bestaat uit drie onderdelen:</p>
<ul>
<li><strong>P</strong>robleem - Het gezondheidsprobleem</li>
<li><strong>E</strong>tiologie - De oorzaak (samenhangende factoren)</li>
<li><strong>S</strong>ymptomen - Kenmerken en verschijnselen</li>
</ul>
<h3>Voorbeeld</h3>
<p><em>"Verstoord slaappatroon (P) gerelateerd aan pijn (E) blijkend uit frequente nachtelijke ontwaking en vermoeidheid overdag (S)"</em></p>`,
    programVPK, llKlinisch, compDiagnose, trackJ1S2, courseVVT, docentId1, now, now
  );

  // Klinisch Redeneren - Interventies
  insertContent.run(
    generateId(),
    `<h2>Verpleegkundige Interventies</h2>
<p>Interventies zijn de handelingen die verpleegkundigen uitvoeren om de gewenste patiëntuitkomsten te bereiken.</p>
<h3>Typen Interventies</h3>
<ol>
<li><strong>Directe zorg</strong> - Handelingen bij de patiënt</li>
<li><strong>Indirecte zorg</strong> - Coördinatie en management</li>
<li><strong>Educatie</strong> - Voorlichting en instructie</li>
</ol>
<h3>NIC-classificatie</h3>
<p>De Nursing Interventions Classification (NIC) biedt een gestandaardiseerde taal voor verpleegkundige interventies.</p>`,
    programVPK, llKlinisch, compInterventie, trackJ2S1, courseVVT, docentId1, now, now
  );

  // Communicatie content
  insertContent.run(
    generateId(),
    `<h2>Professionele Communicatie in de Zorg</h2>
<p>Effectieve communicatie is essentieel voor kwaliteitsvolle zorgverlening en patiëntveiligheid.</p>
<h3>Kerncompetenties</h3>
<ul>
<li>Actief luisteren</li>
<li>Empathisch reageren</li>
<li>Duidelijk en beknopt communiceren</li>
<li>Non-verbale communicatie herkennen</li>
</ul>
<h3>Communicatie met kwetsbare doelgroepen</h3>
<p>Bijzondere aandacht voor communicatie met:</p>
<ul>
<li>Oudere patiënten met cognitieve beperkingen</li>
<li>Patiënten met een andere moedertaal</li>
<li>Patiënten in acute stress</li>
</ul>`,
    programVPK, llCommunicatie, compMondelinge, trackJ1S1, courseAnatomie, docentId2, now, now
  );

  // Ethiek content
  insertContent.run(
    generateId(),
    `<h2>Ethiek in de Verpleegkunde</h2>
<p>Verpleegkundigen worden regelmatig geconfronteerd met ethische vraagstukken in de dagelijkse praktijk.</p>
<h3>Vier Ethische Principes (Beauchamp & Childress)</h3>
<ol>
<li><strong>Autonomie</strong> - Respect voor zelfbeschikking</li>
<li><strong>Weldoen</strong> - Handelen in het belang van de patiënt</li>
<li><strong>Niet schaden</strong> - Vermijden van schade</li>
<li><strong>Rechtvaardigheid</strong> - Eerlijke verdeling van zorg</li>
</ol>
<h3>Beroepsgeheim</h3>
<p>Het beroepsgeheim is wettelijk vastgelegd en beschermt de vertrouwelijke informatie van patiënten.</p>`,
    programVPK, llEthiek, compWetgeving, trackJ2S1, courseFarmaco, docentId2, now, now
  );

  // Evidence Based Practice
  insertContent.run(
    generateId(),
    `<h2>Evidence Based Practice (EBP)</h2>
<p>EBP integreert het beste beschikbare bewijs met klinische expertise en patiëntvoorkeuren.</p>
<h3>De 5 Stappen van EBP</h3>
<ol>
<li><strong>Ask</strong> - Formuleer een klinische vraag (PICO)</li>
<li><strong>Acquire</strong> - Zoek naar het beste bewijs</li>
<li><strong>Appraise</strong> - Beoordeel het bewijs kritisch</li>
<li><strong>Apply</strong> - Pas het bewijs toe in de praktijk</li>
<li><strong>Assess</strong> - Evalueer de uitkomsten</li>
</ol>
<h3>PICO-vraagstelling</h3>
<p><strong>P</strong>atiënt/Probleem, <strong>I</strong>nterventie, <strong>C</strong>omparison, <strong>O</strong>utcome</p>`,
    programVPK, llEvidence, compOnderzoek, trackJ2S2, courseGGZ, docentId1, now, now
  );

  // --- IT CONTENT ---

  // Programmeren - Basis
  insertContent.run(
    generateId(),
    `<h2>Introductie Programmeren</h2>
<p>Welkom bij Programming Essentials! In dit vak leer je de fundamenten van programmeren.</p>
<h3>Wat is programmeren?</h3>
<p>Programmeren is het schrijven van instructies die een computer kan uitvoeren om taken te vervullen.</p>
<h3>Variabelen en Datatypes</h3>
<pre><code>// Voorbeelden in JavaScript
let naam = "Jan";           // String
let leeftijd = 25;          // Number
let isStudent = true;       // Boolean
let scores = [85, 90, 78];  // Array
</code></pre>
<h3>Opdracht Week 1</h3>
<p>Maak een programma dat je naam en leeftijd afdrukt.</p>`,
    programIT, llProgrammeren, compBasis, trackJ1S1, courseProg1, docentId1, now, now
  );

  insertContent.run(
    generateId(),
    `<h2>Control Flow & Loops</h2>
<p>Controlestructuren bepalen de volgorde waarin code wordt uitgevoerd.</p>
<h3>If-else statements</h3>
<pre><code>if (score >= 50) {
    console.log("Geslaagd!");
} else {
    console.log("Niet geslaagd");
}
</code></pre>
<h3>Loops</h3>
<pre><code>// For loop
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// While loop
while (condition) {
    // code
}
</code></pre>`,
    programIT, llProgrammeren, compBasis, trackJ1S1, courseProg1, docentId1, now, now
  );

  // Programmeren - OOP
  insertContent.run(
    generateId(),
    `<h2>Object Georiënteerd Programmeren</h2>
<p>OOP is een programmeerparadigma gebaseerd op objecten die data en gedrag combineren.</p>
<h3>Klassen en Objecten</h3>
<pre><code>class Student {
    constructor(naam, studentnummer) {
        this.naam = naam;
        this.studentnummer = studentnummer;
    }

    toonInfo() {
        return \`\${this.naam} - \${this.studentnummer}\`;
    }
}

const student1 = new Student("Lisa", "S12345");
</code></pre>
<h3>De 4 Pilaren van OOP</h3>
<ul>
<li><strong>Encapsulation</strong> - Data verbergen</li>
<li><strong>Inheritance</strong> - Overerving</li>
<li><strong>Polymorphism</strong> - Meerdere vormen</li>
<li><strong>Abstraction</strong> - Abstractie</li>
</ul>`,
    programIT, llProgrammeren, compOOP, trackJ1S2, courseProg2, docentId1, now, now
  );

  // Databases
  insertContent.run(
    generateId(),
    `<h2>SQL Fundamentals</h2>
<p>SQL (Structured Query Language) is de standaardtaal voor het werken met relationele databases.</p>
<h3>CRUD Operaties</h3>
<pre><code>-- Create
INSERT INTO studenten (naam, email)
VALUES ('Jan', 'jan@pxl.be');

-- Read
SELECT * FROM studenten WHERE actief = true;

-- Update
UPDATE studenten SET email = 'nieuw@pxl.be' WHERE id = 1;

-- Delete
DELETE FROM studenten WHERE id = 1;
</code></pre>
<h3>Joins</h3>
<p>Joins combineren data uit meerdere tabellen op basis van gerelateerde kolommen.</p>`,
    programIT, llDatabases, compSQL, trackJ1S2, courseDB, docentId1, now, now
  );

  // Netwerken
  insertContent.run(
    generateId(),
    `<h2>Netwerk Fundamenten</h2>
<p>Computernetwerken vormen de basis van moderne IT-infrastructuur.</p>
<h3>OSI Model</h3>
<ol>
<li>Physical Layer</li>
<li>Data Link Layer</li>
<li>Network Layer</li>
<li>Transport Layer</li>
<li>Session Layer</li>
<li>Presentation Layer</li>
<li>Application Layer</li>
</ol>
<h3>IP Adressen</h3>
<p>IPv4 adressen bestaan uit 4 octetten, bijv: <code>192.168.1.1</code></p>`,
    programIT, llNetwerken, compTCP, trackJ2S1, courseNetw, docentId1, now, now
  );

  // --- BEDRIJFSMANAGEMENT CONTENT ---

  // Marketing
  insertContent.run(
    generateId(),
    `<h2>Digital Marketing Basics</h2>
<p>Digital marketing omvat alle marketingactiviteiten die digitale kanalen gebruiken.</p>
<h3>Belangrijke Kanalen</h3>
<ul>
<li><strong>SEO</strong> - Zoekmachineoptimalisatie</li>
<li><strong>SEA</strong> - Zoekmachine-adverteren</li>
<li><strong>Social Media Marketing</strong></li>
<li><strong>Email Marketing</strong></li>
<li><strong>Content Marketing</strong></li>
</ul>
<h3>KPI's</h3>
<p>Meet je succes met relevante KPI's zoals CTR, conversieratio, en ROI.</p>`,
    programBM, llMarketing, compDigital, trackJ1S1, courseMark1, docentId2, now, now
  );

  // Financieel
  insertContent.run(
    generateId(),
    `<h2>Boekhouden Basis</h2>
<p>Boekhouden is het systematisch registreren van financiële transacties.</p>
<h3>De Balans</h3>
<p>De balans toont de financiële positie op een bepaald moment:</p>
<ul>
<li><strong>Activa</strong> = Bezittingen</li>
<li><strong>Passiva</strong> = Schulden + Eigen Vermogen</li>
</ul>
<h3>De Balansvergelijking</h3>
<p><em>Activa = Passiva + Eigen Vermogen</em></p>
<h3>Debet en Credit</h3>
<p>Elke transactie heeft een debet- en creditkant (dubbel boekhouden).</p>`,
    programBM, llFinancieel, compBoekhouding, trackJ1S1, courseAcc, docentId2, now, now
  );

  // Extra content voor meer variatie
  insertContent.run(
    generateId(),
    `<h2>Farmacologie voor Verpleegkundigen</h2>
<p>Basiskennis van geneesmiddelen is essentieel voor veilige medicatietoediening.</p>
<h3>Farmacokinetiek</h3>
<ul>
<li><strong>Absorptie</strong> - Opname in het lichaam</li>
<li><strong>Distributie</strong> - Verspreiding door het lichaam</li>
<li><strong>Metabolisme</strong> - Afbraak (vooral in de lever)</li>
<li><strong>Excretie</strong> - Uitscheiding (vooral via nieren)</li>
</ul>
<h3>De 5 Juistheden</h3>
<ol>
<li>Juiste patiënt</li>
<li>Juist medicament</li>
<li>Juiste dosis</li>
<li>Juiste tijd</li>
<li>Juiste toedieningsweg</li>
</ol>`,
    programVPK, llKlinisch, compInterventie, trackJ2S1, courseFarmaco, docentId1, now, now
  );

  insertContent.run(
    generateId(),
    `<h2>Web Development met React</h2>
<p>React is een populaire JavaScript library voor het bouwen van user interfaces.</p>
<h3>Components</h3>
<pre><code>function Welcome({ naam }) {
    return <h1>Hallo, {naam}!</h1>;
}

// Gebruik
<Welcome naam="Student" />
</code></pre>
<h3>State Management</h3>
<pre><code>const [count, setCount] = useState(0);

<button onClick={() => setCount(count + 1)}>
    Klikken: {count}
</button>
</code></pre>`,
    programIT, llProgrammeren, compAdvanced, trackJ2S2, courseWeb, docentId1, now, now
  );

  console.log('  Created 16 content items');

  // ============ SUMMARY ============
  console.log('\n========================================');
  console.log('Seeding completed successfully!');
  console.log('========================================\n');
  console.log('Test accounts:');
  console.log('  Admin:    admin@pxl.be / admin123');
  console.log('  Docent 1: jan.docent@pxl.be / docent123');
  console.log('  Docent 2: marie.docent@pxl.be / docent123');
  console.log('  Student:  student@pxl.be / student123');
  console.log('\nPrograms:');
  console.log('  - Bachelor Verpleegkunde (4 leerlijnen)');
  console.log('  - Bachelor Toegepaste Informatica (3 leerlijnen)');
  console.log('  - Bachelor Bedrijfsmanagement (2 leerlijnen)');
  console.log('\nTotal content: 16 items across all programs');
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
