# Quick Start Guide - Leerlijnentool

## Snelle Setup (5 minuten)

### Stap 1: Installeer Dependencies
```bash
npm install
```

### Stap 2: Configureer Environment
```bash
cp .env.example .env
```

Genereer een veilige NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

Plak deze in `.env` bij `NEXTAUTH_SECRET`.

### Stap 3: Setup Database
```bash
npm run db:push
npm run db:seed
```

### Stap 4: Start de Applicatie
```bash
npm run dev
```

### Stap 5: Login
Open [http://localhost:3000](http://localhost:3000)

**Admin credentials:**
- Email: `admin@leerlijnentool.nl`
- Password: `admin123`

## Eerste Stappen

### Als Admin

1. **Maak een Docent aan**
   - Ga naar "Gebruikersbeheer"
   - Klik "+ Nieuwe gebruiker"
   - Vul in:
     - Email: `docent@example.nl`
     - Password: `docent123`
     - Rol: Docent
     - Selecteer programma's: "Bachelor Informatica"
   - Klik "Opslaan"

2. **Maak een Student aan**
   - Klik "+ Nieuwe gebruiker"
   - Vul in:
     - Email: `student@example.nl`
     - Password: `student123`
     - Rol: Student
   - Klik "Opslaan"

3. **Test "View As" functie**
   - Op het dashboard, klik "Bekijk als Docent"
   - Of klik "Bekijk als Student"
   - Klik "Wissen" om terug te keren

### Als Docent

1. **Login als Docent**
   - Log uit als admin
   - Log in met `docent@example.nl` / `docent123`

2. **Voeg Leerinhoud toe**
   - Klik op "Bachelor Informatica"
   - Klik "+ Nieuwe inhoud"
   - Vul alle velden in:
     - Leerlijn: "Programmeren"
     - Component: "Basis Syntax"
     - Leertraject: "Jaar 1"
     - Opleidingsonderdeel: "Inleiding Programmeren"
     - Inhoud: Gebruik de editor om tekst op te maken
   - Klik "Opslaan"

3. **Probeer Bulk Import**
   - Klik "Bulk Import"
   - Kopieer en plak voorbeelddata (zie README.md)
   - Klik "Importeren"

### Als Student

1. **Login als Student**
   - Log uit als docent
   - Log in met `student@example.nl` / `student123`

2. **Navigeer door Content**
   - Klik op "Bachelor Informatica"
   - Klik op "Programmeren" (leerlijn)
   - Gebruik de filters:
     - Selecteer "Jaar 1" bij Leertraject
     - Selecteer "Inleiding Programmeren" bij Opleidingsonderdeel
   - Klik op een component om de inhoud te zien

## Veelvoorkomende Taken

### Nieuw Programma Toevoegen (Admin)
1. Ga naar "Programma's"
2. Klik "+ Nieuw programma"
3. Vul naam in en sla op

### Nieuwe Leerlijn Toevoegen (Admin)
1. Ga naar "Leerlijnen"
2. Klik "+ Nieuwe leerlijn"
3. Vul titel in
4. Selecteer programma's
5. Sla op

### Nieuw Leertraject Toevoegen (Admin)
1. Ga naar "Leertrajecten"
2. Klik "+ Nieuw traject"
3. Vul naam in (bijv. "Jaar 2", "Fase 1")
4. Sla op

### Nieuwe Component Toevoegen (Admin)
1. Ga naar "Leercomponenten"
2. Klik "+ Nieuwe component"
3. Vul naam in
4. Selecteer leerlijn
5. Sla op

## Tips

- **Rich Text Editor:** Gebruik de toolbar knoppen om tekst op te maken (Bold, Italic, Koppen, Lijsten)
- **View As:** Handig om te zien hoe content er uitziet voor andere rollen
- **Bulk Import:** Ideaal voor grote hoeveelheden data - gebruik JSON formaat
- **Filters:** Studenten kunnen content filteren op traject en vak voor betere organisatie

## Troubleshooting

**Kan niet inloggen:**
- Controleer of de database is geseeded: `npm run db:seed`

**"Unauthorized" error:**
- Controleer of de gebruiker de juiste rol heeft
- Voor Docenten: controleer of ze toegewezen zijn aan het programma

**Database problemen:**
```bash
# Reset alles
rm prisma/dev.db
npm run db:push
npm run db:seed
```

## Volgende Stappen

Zie de volledige [README.md](README.md) voor:
- Gedetailleerde feature documentatie
- Database schema uitleg
- Productie deployment instructies
- API documentatie
