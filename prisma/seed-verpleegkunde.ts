import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding PXL Verpleegkunde...')

  // Clear existing data
  await prisma.content.deleteMany({})
  await prisma.component.deleteMany({})
  await prisma.course.deleteMany({})
  await prisma.track.deleteMany({})
  await prisma.programLearningLine.deleteMany({})
  await prisma.learningLine.deleteMany({})
  await prisma.userProgram.deleteMany({})
  await prisma.program.deleteMany({})
  await prisma.user.deleteMany({})
  console.log('Cleared existing data')

  // Create users
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@pxl.be',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const docent1 = await prisma.user.create({
    data: {
      email: 'sara.jansen@pxl.be',
      password: hashedPassword,
      role: 'DOCENT',
    },
  })

  const student1 = await prisma.user.create({
    data: {
      email: 'student@pxl.be',
      password: hashedPassword,
      role: 'STUDENT',
    },
  })
  console.log('Created users')

  // Create program
  const verpleegkunde = await prisma.program.create({
    data: {
      id: 'verpleegkunde-bachelor',
      name: 'Bachelor Verpleegkunde - PXL',
    },
  })
  console.log('Created program: Bachelor Verpleegkunde')

  // Link docent to program
  await prisma.userProgram.create({
    data: {
      userId: docent1.id,
      programId: verpleegkunde.id,
    },
  })

  // Create tracks (jaren)
  const jaar1 = await prisma.track.create({
    data: {
      id: 'jaar-1',
      name: 'Jaar 1',
      order: 1,
    },
  })

  const jaar2 = await prisma.track.create({
    data: {
      id: 'jaar-2',
      name: 'Jaar 2',
      order: 2,
    },
  })

  const jaar3 = await prisma.track.create({
    data: {
      id: 'jaar-3',
      name: 'Jaar 3',
      order: 3,
    },
  })

  const jaar4 = await prisma.track.create({
    data: {
      id: 'jaar-4',
      name: 'Jaar 4',
      order: 4,
    },
  })
  console.log('Created tracks (jaren)')

  // Create courses
  const anatomie = await prisma.course.create({
    data: {
      id: 'anatomie-fysiologie',
      name: 'Anatomie en Fysiologie',
      programId: verpleegkunde.id,
    },
  })

  const verpleegkundige_vaardigheden = await prisma.course.create({
    data: {
      id: 'verpleegkundige-vaardigheden',
      name: 'Verpleegkundige Vaardigheden',
      programId: verpleegkunde.id,
    },
  })

  const klinische_praktijk = await prisma.course.create({
    data: {
      id: 'klinische-praktijk',
      name: 'Klinische Praktijk',
      programId: verpleegkunde.id,
    },
  })

  const farmacologie = await prisma.course.create({
    data: {
      id: 'farmacologie',
      name: 'Farmacologie',
      programId: verpleegkunde.id,
    },
  })

  const evidence_based = await prisma.course.create({
    data: {
      id: 'evidence-based',
      name: 'Evidence Based Practice',
      programId: verpleegkunde.id,
    },
  })

  const gerontologie = await prisma.course.create({
    data: {
      id: 'gerontologie',
      name: 'Gerontologie en Geriatrie',
      programId: verpleegkunde.id,
    },
  })

  const psychiatrie = await prisma.course.create({
    data: {
      id: 'psychiatrie',
      name: 'Psychiatrische Verpleegkunde',
      programId: verpleegkunde.id,
    },
  })

  const management = await prisma.course.create({
    data: {
      id: 'management',
      name: 'Zorgmanagement',
      programId: verpleegkunde.id,
    },
  })
  console.log('Created courses')

  // Create learning lines and components

  // 1. KLINISCH REDENEREN
  const klinischRedeneren = await prisma.learningLine.create({
    data: {
      id: 'll-klinisch-redeneren',
      title: 'Klinisch Redeneren',
    },
  })

  await prisma.programLearningLine.create({
    data: {
      programId: verpleegkunde.id,
      learningLineId: klinischRedeneren.id,
    },
  })

  const kr_anamnese = await prisma.component.create({
    data: {
      id: 'kr-anamnese',
      name: 'Anamnese en Assessment',
      learningLineId: klinischRedeneren.id,
      order: 1,
    },
  })

  const kr_diagnose = await prisma.component.create({
    data: {
      id: 'kr-diagnose',
      name: 'Verpleegkundige Diagnose',
      learningLineId: klinischRedeneren.id,
      order: 2,
    },
  })

  const kr_interventies = await prisma.component.create({
    data: {
      id: 'kr-interventies',
      name: 'Interventies Plannen',
      learningLineId: klinischRedeneren.id,
      order: 3,
    },
  })

  const kr_evaluatie = await prisma.component.create({
    data: {
      id: 'kr-evaluatie',
      name: 'Evaluatie en Bijsturing',
      learningLineId: klinischRedeneren.id,
      order: 4,
    },
  })

  // 2. TECHNISCHE VAARDIGHEDEN
  const technischeVaardigheden = await prisma.learningLine.create({
    data: {
      id: 'll-technische-vaardigheden',
      title: 'Technische Vaardigheden',
    },
  })

  await prisma.programLearningLine.create({
    data: {
      programId: verpleegkunde.id,
      learningLineId: technischeVaardigheden.id,
    },
  })

  const tv_hygiene = await prisma.component.create({
    data: {
      id: 'tv-hygiene',
      name: 'Hygiëne en Infectiepreventie',
      learningLineId: technischeVaardigheden.id,
      order: 1,
    },
  })

  const tv_medicatie = await prisma.component.create({
    data: {
      id: 'tv-medicatie',
      name: 'Medicatietoediening',
      learningLineId: technischeVaardigheden.id,
      order: 2,
    },
  })

  const tv_wondverzorging = await prisma.component.create({
    data: {
      id: 'tv-wondverzorging',
      name: 'Wondverzorging',
      learningLineId: technischeVaardigheden.id,
      order: 3,
    },
  })

  const tv_monitoring = await prisma.component.create({
    data: {
      id: 'tv-monitoring',
      name: 'Vitale Parameters Monitoren',
      learningLineId: technischeVaardigheden.id,
      order: 4,
    },
  })

  // 3. COMMUNICATIE EN SAMENWERKING
  const communicatie = await prisma.learningLine.create({
    data: {
      id: 'll-communicatie',
      title: 'Communicatie en Samenwerking',
    },
  })

  await prisma.programLearningLine.create({
    data: {
      programId: verpleegkunde.id,
      learningLineId: communicatie.id,
    },
  })

  const comm_patient = await prisma.component.create({
    data: {
      id: 'comm-patient',
      name: 'Patiëntcommunicatie',
      learningLineId: communicatie.id,
      order: 1,
    },
  })

  const comm_team = await prisma.component.create({
    data: {
      id: 'comm-team',
      name: 'Interprofessionele Samenwerking',
      learningLineId: communicatie.id,
      order: 2,
    },
  })

  const comm_conflicten = await prisma.component.create({
    data: {
      id: 'comm-conflicten',
      name: 'Conflicthantering',
      learningLineId: communicatie.id,
      order: 3,
    },
  })

  const comm_documentatie = await prisma.component.create({
    data: {
      id: 'comm-documentatie',
      name: 'Professionele Documentatie',
      learningLineId: communicatie.id,
      order: 4,
    },
  })

  console.log('Created learning lines and components')

  // Create content for KLINISCH REDENEREN

  // Jaar 1 - Anamnese
  await prisma.content.create({
    data: {
      richTextBody: `<h2>Basis Anamnese Technieken</h2>
<p>In dit onderdeel leer je de <strong>fundamentele principes</strong> van het afnemen van een anamnese bij patiënten.</p>
<h3>Leerdoelen:</h3>
<ul>
<li>Een systematische anamnese kunnen afnemen</li>
<li>Open en gesloten vragen effectief gebruiken</li>
<li>Actief luisteren en samenvatten</li>
<li>Non-verbale communicatie herkennen</li>
</ul>
<h3>Praktische Oefening:</h3>
<p>Voer een intake gesprek met een simulatiepatiënt en documenteer de bevindingen volgens het SOAPIE-model.</p>`,
      programId: verpleegkunde.id,
      learningLineId: klinischRedeneren.id,
      componentId: kr_anamnese.id,
      trackId: jaar1.id,
      courseId: verpleegkundige_vaardigheden.id,
      createdById: admin.id,
    },
  })

  await prisma.content.create({
    data: {
      richTextBody: `<h2>Lichamelijk Onderzoek: Basisvaardigheden</h2>
<p>Leer de <strong>vier basis onderzoekstechnieken</strong> toepassen tijdens fysiek assessment.</p>
<h3>Technieken:</h3>
<ol>
<li><strong>Inspectie</strong> - Visueel observeren van de patiënt</li>
<li><strong>Palpatie</strong> - Tastend onderzoek</li>
<li><strong>Percussie</strong> - Bekloppen van lichaamsdelen</li>
<li><strong>Auscultatie</strong> - Beluisteren met stethoscoop</li>
</ol>
<p><em>Let op:</em> Begin altijd met inspectie en eindig met auscultatie om beïnvloeding te voorkomen.</p>`,
      programId: verpleegkunde.id,
      learningLineId: klinischRedeneren.id,
      componentId: kr_anamnese.id,
      trackId: jaar1.id,
      courseId: anatomie.id,
      createdById: admin.id,
    },
  })

  // Jaar 2 - Diagnose
  await prisma.content.create({
    data: {
      richTextBody: `<h2>NANDA-I Verpleegkundige Diagnoses</h2>
<p>De <strong>NANDA-I taxonomie</strong> biedt een gestandaardiseerde terminologie voor verpleegkundige diagnoses.</p>
<h3>Structuur van een Diagnose:</h3>
<ul>
<li><strong>PES-structuur:</strong> Problem (probleem) - Etiology (oorzaak) - Signs/Symptoms (kenmerken)</li>
<li>Bijvoorbeeld: "Verminderde mobiliteit gerelateerd aan pijn, blijkend uit moeite met lopen"</li>
</ul>
<h3>Domeinen:</h3>
<p>Verpleegkundige diagnoses zijn ingedeeld in 13 domeinen zoals gezondheidsbevordering, voeding, eliminatie, en coping/stress.</p>
<h3>Opdracht:</h3>
<p>Formuleer 3 verpleegkundige diagnoses voor een patiënt met diabetes mellitus type 2.</p>`,
      programId: verpleegkunde.id,
      learningLineId: klinischRedeneren.id,
      componentId: kr_diagnose.id,
      trackId: jaar2.id,
      courseId: klinische_praktijk.id,
      createdById: admin.id,
    },
  })

  await prisma.content.create({
    data: {
      richTextBody: `<h2>Prioriteren van Zorgproblemen</h2>
<p>Niet alle verpleegkundige diagnoses zijn even urgent. Leer problemen <strong>prioriteren</strong> volgens de ABC-methode.</p>
<h3>ABC-Prioritering:</h3>
<ol>
<li><strong>Airway (luchtweg)</strong> - Levensbedreigende luchtwegproblemen</li>
<li><strong>Breathing (ademhaling)</strong> - Acute ademhalingsproblemen</li>
<li><strong>Circulation (circulatie)</strong> - Cardiovasculaire problemen</li>
</ol>
<p>Daarnaast: gebruik <strong>Maslow's behoeftenhiërarchie</strong> voor niet-acute situaties.</p>
<h3>Case Study:</h3>
<p>Een patiënt heeft: pijn (7/10), angst, risico op decubitus, en verhoogde bloeddruk. Welke prioriteit geef je aan welk probleem?</p>`,
      programId: verpleegkunde.id,
      learningLineId: klinischRedeneren.id,
      componentId: kr_diagnose.id,
      trackId: jaar2.id,
      courseId: verpleegkundige_vaardigheden.id,
      createdById: admin.id,
    },
  })

  // Jaar 3 - Interventies
  await prisma.content.create({
    data: {
      richTextBody: `<h2>Evidence-Based Interventies</h2>
<p>Verpleegkundige interventies moeten gebaseerd zijn op <strong>wetenschappelijk bewijs</strong> en best practices.</p>
<h3>NIC Classificatie:</h3>
<p>De Nursing Interventions Classification (NIC) biedt meer dan 500 gestandaardiseerde interventies, zoals:</p>
<ul>
<li>Pijnmanagement</li>
<li>Huidverzorging</li>
<li>Nutritionele monitoring</li>
<li>Emotionele ondersteuning</li>
</ul>
<h3>SMART Doelen:</h3>
<p>Formuleer interventies volgens SMART-criteria: Specifiek, Meetbaar, Acceptabel, Realistisch, Tijdsgebonden.</p>
<h3>Praktijk:</h3>
<p>Zoek in de literatuur naar evidence-based interventies voor valpreventie bij ouderen.</p>`,
      programId: verpleegkunde.id,
      learningLineId: klinischRedeneren.id,
      componentId: kr_interventies.id,
      trackId: jaar3.id,
      courseId: evidence_based.id,
      createdById: admin.id,
    },
  })

  await prisma.content.create({
    data: {
      richTextBody: `<h2>Zorgplan Opstellen</h2>
<p>Een <strong>individueel zorgplan</strong> is het document waarin je diagnoses, doelen en interventies samenbrengt.</p>
<h3>Onderdelen van een Zorgplan:</h3>
<ol>
<li><strong>Patiëntgegevens</strong> - Naam, leeftijd, medische geschiedenis</li>
<li><strong>Verpleegkundige diagnoses</strong> - Geprioriteerde problemen</li>
<li><strong>Doelstellingen</strong> - Korte en lange termijn doelen</li>
<li><strong>Interventies</strong> - Concrete acties met frequentie</li>
<li><strong>Evaluatiemomenten</strong> - Wanneer wordt het plan herzien?</li>
</ol>
<h3>Multidisciplinair:</h3>
<p>Stem het zorgplan af met andere disciplines: arts, fysiotherapeut, diëtist, maatschappelijk werk.</p>`,
      programId: verpleegkunde.id,
      learningLineId: klinischRedeneren.id,
      componentId: kr_interventies.id,
      trackId: jaar3.id,
      courseId: klinische_praktijk.id,
      createdById: admin.id,
    },
  })

  // Jaar 4 - Evaluatie
  await prisma.content.create({
    data: {
      richTextBody: `<h2>NOC Uitkomstmeting</h2>
<p>De Nursing Outcomes Classification (NOC) helpt om de <strong>effectiviteit van interventies</strong> te meten.</p>
<h3>Meetbare Uitkomsten:</h3>
<ul>
<li>Pijnniveau (schaal 1-10)</li>
<li>Mobiliteitsgraad (volledig bedlegerig tot volledig mobiel)</li>
<li>Kennis over ziekte (schaal onvoldoende tot uitstekend)</li>
<li>Tevredenheid met zorg (schaal zeer ontevreden tot zeer tevreden)</li>
</ul>
<h3>Evaluatiecyclus:</h3>
<p>Evalueer regelmatig: dagelijks bij acute problemen, wekelijks bij chronische condities. Pas het zorgplan aan op basis van de uitkomsten.</p>`,
      programId: verpleegkunde.id,
      learningLineId: klinischRedeneren.id,
      componentId: kr_evaluatie.id,
      trackId: jaar4.id,
      courseId: evidence_based.id,
      createdById: admin.id,
    },
  })

  // Create content for TECHNISCHE VAARDIGHEDEN

  // Jaar 1 - Hygiëne
  await prisma.content.create({
    data: {
      richTextBody: `<h2>Handhygiëne en Asepsie</h2>
<p><strong>Handhygiëne</strong> is de belangrijkste maatregel om infecties te voorkomen in de zorg.</p>
<h3>5 Momenten van Handhygiëne:</h3>
<ol>
<li>Voor patiëntcontact</li>
<li>Voor schone/aseptische handelingen</li>
<li>Na contact met lichaamsvloeistoffen</li>
<li>Na patiëntcontact</li>
<li>Na contact met patiëntomgeving</li>
</ol>
<h3>Technieken:</h3>
<ul>
<li><strong>Handwassen</strong> met water en zeep (40-60 seconden)</li>
<li><strong>Handalcohol</strong> voor desinfectie (20-30 seconden)</li>
</ul>
<p><em>Belangrijk:</em> Handen moeten volledig droog zijn voor optimale werking van handalcohol.</p>`,
      programId: verpleegkunde.id,
      learningLineId: technischeVaardigheden.id,
      componentId: tv_hygiene.id,
      trackId: jaar1.id,
      courseId: verpleegkundige_vaardigheden.id,
      createdById: admin.id,
    },
  })

  await prisma.content.create({
    data: {
      richTextBody: `<h2>Persoonlijke Beschermingsmiddelen (PBM)</h2>
<p>Gebruik van <strong>PBM</strong> beschermt jou en de patiënt tegen overdracht van infecties.</p>
<h3>Soorten PBM:</h3>
<ul>
<li><strong>Handschoenen</strong> - Bij contact met bloed, lichaamsvloeistoffen, slijmvliezen</li>
<li><strong>Schort/jas</strong> - Bij spat- of sproeigevaar</li>
<li><strong>Mondneusmasker</strong> - Bij aerosol-overdraagbare infecties</li>
<li><strong>Veiligheidsbril</strong> - Bij spatgevaar naar ogen</li>
</ul>
<h3>Aan- en Uitkleedvolgorde:</h3>
<p><strong>Aankleden:</strong> 1. Schort 2. Masker 3. Bril 4. Handschoenen</p>
<p><strong>Uitkleden:</strong> 1. Handschoenen 2. Bril 3. Schort 4. Masker → Handhygiëne!</p>`,
      programId: verpleegkunde.id,
      learningLineId: technischeVaardigheden.id,
      componentId: tv_hygiene.id,
      trackId: jaar1.id,
      courseId: verpleegkundige_vaardigheden.id,
      createdById: admin.id,
    },
  })

  // Jaar 2 - Medicatie
  await prisma.content.create({
    data: {
      richTextBody: `<h2>Medicatieveiligheid: De 10 Rights</h2>
<p>Bij <strong>medicatietoediening</strong> volg je altijd de "10 rights" om fouten te voorkomen.</p>
<h3>De 10 Rights:</h3>
<ol>
<li>Juiste patiënt</li>
<li>Juiste medicatie</li>
<li>Juiste dosis</li>
<li>Juiste toedieningsweg</li>
<li>Juiste tijdstip</li>
<li>Juiste documentatie</li>
<li>Juiste actie (indicatie)</li>
<li>Juiste vorm</li>
<li>Juiste response (monitoring)</li>
<li>Recht om te weigeren</li>
</ol>
<h3>Double Check:</h3>
<p>Bij high-risk medicatie (insuline, anticoagulantia, chemotherapie): altijd dubbele controle door tweede verpleegkundige.</p>`,
      programId: verpleegkunde.id,
      learningLineId: technischeVaardigheden.id,
      componentId: tv_medicatie.id,
      trackId: jaar2.id,
      courseId: farmacologie.id,
      createdById: admin.id,
    },
  })

  await prisma.content.create({
    data: {
      richTextBody: `<h2>Toedieningswegen en Technieken</h2>
<p>Verschillende <strong>toedieningswegen</strong> vereisen specifieke technieken en kennis.</p>
<h3>Belangrijkste Toedieningswegen:</h3>
<ul>
<li><strong>Oraal (PO)</strong> - Via de mond, meest voorkomend</li>
<li><strong>Sublinguaal (SL)</strong> - Onder de tong, snelle opname</li>
<li><strong>Subcutaan (SC)</strong> - Onder de huid, bijv. insuline</li>
<li><strong>Intramusculair (IM)</strong> - In de spier, grotere volumes mogelijk</li>
<li><strong>Intraveneus (IV)</strong> - Direct in de bloedbaan, snelste werking</li>
<li><strong>Rectaal (PR)</strong> - Via de endeldarm</li>
<li><strong>Cutaan</strong> - Op de huid (crème, pleister)</li>
</ul>
<h3>SC Injectietechnieken:</h3>
<p>Injectieplaatsen: abdomen, bovenbeen, bovenarm. Roteer injectieplaatsen bij regelmatige toediening (bijv. insuline).</p>`,
      programId: verpleegkunde.id,
      learningLineId: technischeVaardigheden.id,
      componentId: tv_medicatie.id,
      trackId: jaar2.id,
      courseId: farmacologie.id,
      createdById: admin.id,
    },
  })

  // Jaar 3 - Wondverzorging
  await prisma.content.create({
    data: {
      richTextBody: `<h2>Wondbeoordeling en -classificatie</h2>
<p>Een goede <strong>wondbeoordeling</strong> is essentieel voor het kiezen van de juiste behandeling.</p>
<h3>TIME-principe:</h3>
<ul>
<li><strong>T - Tissue (weefsel)</strong> - Necrotisch, granulatie, epithelialisatie?</li>
<li><strong>I - Infection/Inflammation</strong> - Tekenen van infectie?</li>
<li><strong>M - Moisture (vocht)</strong> - Te droog of te nat?</li>
<li><strong>E - Edge (rand)</strong> - Ondermijning? Geïndureerd?</li>
</ul>
<h3>Wonddocumentatie:</h3>
<p>Documenteer: locatie, grootte (LxBxD in cm), wondtype, exsudaat (kleur/hoeveelheid), wondomgeving, pijn.</p>
<h3>Praktijk:</h3>
<p>Oefen wondfotografie volgens protocol: gebruik liniaal, consistent perspectief, goede belichting.</p>`,
      programId: verpleegkunde.id,
      learningLineId: technischeVaardigheden.id,
      componentId: tv_wondverzorging.id,
      trackId: jaar3.id,
      courseId: klinische_praktijk.id,
      createdById: admin.id,
    },
  })

  await prisma.content.create({
    data: {
      richTextBody: `<h2>Moderne Wondverbanden</h2>
<p>Kies het <strong>juiste wondverband</strong> op basis van wondfase en exsudaat.</p>
<h3>Soorten Verbanden:</h3>
<ul>
<li><strong>Hydrocolloïd</strong> - Voor licht exsuderende wonden, creëert vochtige omgeving</li>
<li><strong>Hydrogel</strong> - Voor droge, necrotische wonden, hydrateert</li>
<li><strong>Schuimverband</strong> - Voor matig tot sterk exsuderende wonden, absorberend</li>
<li><strong>Alginaat</strong> - Voor sterk exsuderende wonden, hemostatisch effect</li>
<li><strong>Zilververbanden</strong> - Antimicrobiële werking bij geïnfecteerde wonden</li>
</ul>
<h3>Verschoningsfrequentie:</h3>
<p>Afhankelijk van exsudaat: van dagelijks (veel exsudaat) tot 1x per week (minimaal exsudaat).</p>`,
      programId: verpleegkunde.id,
      learningLineId: technischeVaardigheden.id,
      componentId: tv_wondverzorging.id,
      trackId: jaar3.id,
      courseId: klinische_praktijk.id,
      createdById: admin.id,
    },
  })

  // Jaar 4 - Monitoring
  await prisma.content.create({
    data: {
      richTextBody: `<h2>Early Warning Scores</h2>
<p><strong>Early Warning Scores (EWS)</strong> helpen vroege detectie van verslechtering bij patiënten.</p>
<h3>NEWS2 Score:</h3>
<p>De National Early Warning Score 2 beoordeelt:</p>
<ul>
<li>Ademhalingsfrequentie</li>
<li>Zuurstofsaturatie</li>
<li>Aanvullende zuurstof</li>
<li>Systolische bloeddruk</li>
<li>Hartfrequentie</li>
<li>Bewustzijn (AVPU)</li>
<li>Temperatuur</li>
</ul>
<h3>Interpreteren:</h3>
<ul>
<li><strong>Score 0-4:</strong> Laag risico - continue monitoring</li>
<li><strong>Score 5-6:</strong> Matig risico - verhoog monitoringsfrequentie</li>
<li><strong>Score ≥7:</strong> Hoog risico - alarm en direct arts</li>
</ul>`,
      programId: verpleegkunde.id,
      learningLineId: technischeVaardigheden.id,
      componentId: tv_monitoring.id,
      trackId: jaar4.id,
      courseId: klinische_praktijk.id,
      createdById: admin.id,
    },
  })

  // Create content for COMMUNICATIE

  // Jaar 1 - Patiëntcommunicatie
  await prisma.content.create({
    data: {
      richTextBody: `<h2>Therapeutische Gespreksvoering</h2>
<p><strong>Therapeutische communicatie</strong> is gericht op het welzijn van de patiënt en het opbouwen van vertrouwen.</p>
<h3>Basisvaardigheden:</h3>
<ul>
<li><strong>Actief luisteren</strong> - Volledige aandacht, oogcontact, nicken</li>
<li><strong>Open vragen</strong> - "Hoe voelt u zich?" in plaats van "Voelt u zich goed?"</li>
<li><strong>Parafraseren</strong> - Herhalen in eigen woorden: "U zegt dus dat..."</li>
<li><strong>Reflecteren</strong> - Spiegelen van emoties: "Ik merk dat u angstig bent"</li>
<li><strong>Samenvatten</strong> - Kernpunten samenvatten aan einde gesprek</li>
</ul>
<h3>Te vermijden:</h3>
<p>Gesloten vragen, onderbreken, oordelen, bagatelliseren ("het valt wel mee"), valse geruststelling.</p>`,
      programId: verpleegkunde.id,
      learningLineId: communicatie.id,
      componentId: comm_patient.id,
      trackId: jaar1.id,
      courseId: verpleegkundige_vaardigheden.id,
      createdById: admin.id,
    },
  })

  await prisma.content.create({
    data: {
      richTextBody: `<h2>Slecht Nieuws Gesprekken</h2>
<p>Het brengen van <strong>slecht nieuws</strong> vereist een zorgvuldige en empathische aanpak.</p>
<h3>SPIKES-Protocol:</h3>
<ol>
<li><strong>S - Setting</strong> - Rustige ruimte, privacy, tijd nemen</li>
<li><strong>P - Perception</strong> - Wat weet de patiënt al?</li>
<li><strong>I - Invitation</strong> - Hoeveel wil de patiënt weten?</li>
<li><strong>K - Knowledge</strong> - Geef informatie in begrijpelijke taal</li>
<li><strong>E - Emotions</strong> - Erken emoties, bied steun</li>
<li><strong>S - Strategy & Summary</strong> - Vervolgplan bespreken</li>
</ol>
<h3>Na het Gesprek:</h3>
<p>Bied follow-up aan, zorg voor continuïteit, documenteer het gesprek zorgvuldig.</p>`,
      programId: verpleegkunde.id,
      learningLineId: communicatie.id,
      componentId: comm_patient.id,
      trackId: jaar2.id,
      courseId: gerontologie.id,
      createdById: admin.id,
    },
  })

  // Jaar 2 - Teamcommunicatie
  await prisma.content.create({
    data: {
      richTextBody: `<h2>SBAR Communicatie</h2>
<p><strong>SBAR</strong> is een gestructureerde methode voor effectieve overdracht tussen zorgprofessionals.</p>
<h3>SBAR Structuur:</h3>
<ul>
<li><strong>S - Situation</strong> - "Ik bel over patiënt X op kamer Y met probleem Z"</li>
<li><strong>B - Background</strong> - Relevante achtergrond: diagnose, behandeling, allergieën</li>
<li><strong>A - Assessment</strong> - Jouw inschatting van de situatie</li>
<li><strong>R - Recommendation</strong> - Wat stel je voor? Wat heb je nodig?</li>
</ul>
<h3>Voorbeeld:</h3>
<p><em>"Dr. Janssen, ik bel over meneer Peeters, 68 jaar, kamer 204, met acute dyspnoe. Hij is 3 dagen geleden opgenomen met longontsteking en kreeg IV antibiotica. Nu heeft hij: saturatie 88% op 2L O2, ademfrequentie 28, crепитaties basaal beiderzijds. Ik denk aan decompensatio cordis. Kunt u komen voor evaluatie en mogelijk diuretica?"</em></p>`,
      programId: verpleegkunde.id,
      learningLineId: communicatie.id,
      componentId: comm_team.id,
      trackId: jaar2.id,
      courseId: klinische_praktijk.id,
      createdById: admin.id,
    },
  })

  await prisma.content.create({
    data: {
      richTextBody: `<h2>Multidisciplinaire Samenwerking</h2>
<p>Goede <strong>zorgverlening</strong> vereist effectieve samenwerking tussen verschillende disciplines.</p>
<h3>Het Zorgteam:</h3>
<ul>
<li><strong>Verpleegkundigen</strong> - Coördinatie en continue zorg</li>
<li><strong>Artsen</strong> - Medische diagnose en behandeling</li>
<li><strong>Fysiotherapeuten</strong> - Mobiliteit en ademhalingsproblemen</li>
<li><strong>Ergotherapeuten</strong> - ADL training en hulpmiddelen</li>
<li><strong>Diëtisten</strong> - Voedingsadvies en -planning</li>
<li><strong>Maatschappelijk werk</strong> - Psychosociale ondersteuning</li>
<li><strong>Apothekers</strong> - Medicatiebeheer</li>
</ul>
<h3>Teamvergaderingen:</h3>
<p>Neem actief deel aan MDO (multidisciplinair overleg), bereid je voor, breng verpleegkundig perspectief in.</p>`,
      programId: verpleegkunde.id,
      learningLineId: communicatie.id,
      componentId: comm_team.id,
      trackId: jaar3.id,
      courseId: management.id,
      createdById: admin.id,
    },
  })

  // Jaar 3 - Conflicten
  await prisma.content.create({
    data: {
      richTextBody: `<h2>Omgaan met Agressie en Conflicten</h2>
<p><strong>Agressie en conflicten</strong> kunnen voorkomen in de zorg. Leer deze professioneel te hanteren.</p>
<h3>De-escalatie Technieken:</h3>
<ol>
<li><strong>Blijf kalm</strong> - Behoud zelf-controle, spreek rustig</li>
<li><strong>Toon respect</strong> - Neem de persoon serieus</li>
<li><strong>Luister actief</strong> - Laat de ander uitpraten</li>
<li><strong>Erken emoties</strong> - "Ik zie dat u boos/gefrustreerd bent"</li>
<li><strong>Bied opties</strong> - Geef keuzemogelijkheden</li>
<li><strong>Stel grenzen</strong> - Duidelijk over wat wel en niet acceptabel is</li>
</ol>
<h3>Veiligheid Eerst:</h3>
<p>Bij fysiek geweld: zorg voor eigen veiligheid, roep hulp, documenteer incident, bespreek met team.</p>`,
      programId: verpleegkunde.id,
      learningLineId: communicatie.id,
      componentId: comm_conflicten.id,
      trackId: jaar3.id,
      courseId: psychiatrie.id,
      createdById: admin.id,
    },
  })

  // Jaar 4 - Documentatie
  await prisma.content.create({
    data: {
      richTextBody: `<h2>Juridische Aspecten van Documentatie</h2>
<p><strong>Verpleegkundige documentatie</strong> heeft juridische waarde en moet aan strikte eisen voldoen.</p>
<h3>Documentatieprincipes:</h3>
<ul>
<li><strong>Feitelijk</strong> - Objectieve observaties, geen interpretaties</li>
<li><strong>Volledig</strong> - Alle relevante zorg gedocumenteerd</li>
<li><strong>Tijdig</strong> - Direct na handeling registreren</li>
<li><strong>Leesbaar</strong> - Voor anderen begrijpelijk</li>
<li><strong>Gedateerd en ondertekend</strong> - Altijd identificeerbaar</li>
</ul>
<h3>Wettelijke Bewaartermijn:</h3>
<p>Medische dossiers moeten minimaal <strong>20 jaar</strong> bewaard worden (of tot 20ste verjaardag + 20 jaar bij minderjarigen).</p>
<h3>Juridische Aspecten:</h3>
<p>Je documentatie kan als bewijs dienen bij klachten of juridische procedures. "Niet gedocumenteerd = niet gedaan".</p>`,
      programId: verpleegkunde.id,
      learningLineId: communicatie.id,
      componentId: comm_documentatie.id,
      trackId: jaar4.id,
      courseId: management.id,
      createdById: admin.id,
    },
  })

  console.log('Created all content for PXL Verpleegkunde')
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
