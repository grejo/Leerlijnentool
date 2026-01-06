# Leerlijnentool - Curriculum Management Application

Een complete applicatie voor het beheren van curricula binnen verschillende opleidingsprogramma's.

## Functionaliteiten

### Voor Studenten
- Bekijk beschikbare programma's
- Navigeer door leerlijnen per programma
- Filter leerinhoud op leertraject en opleidingsonderdeel
- Bekijk gegroepeerde inhoud per leercomponent (accordion interface)

### Voor Docenten
- Beheer leerinhoud voor toegewezen programma's
- Maak, bewerk en verwijder leerinhoud
- Gebruik rich text editor (TipTap) voor geformatteerde inhoud
- Bulk import functionaliteit voor efficiënte data-invoer
- "View As Student" functie om de student-ervaring te simuleren

### Voor Beheerders
- Volledige CRUD operaties op alle tabellen
- Gebruikersbeheer (aanmaken, bewerken, verwijderen)
- Toewijzen van docenten aan specifieke programma's
- Beheer van programma's, leerlijnen, leertrajecten en componenten
- "View As" functie voor Docent en Student perspectieven

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Prisma ORM met SQLite (dev) / PostgreSQL (productie)
- **Authentication:** NextAuth.js (Credentials provider)
- **Rich Text Editor:** TipTap
- **TypeScript:** Volledig type-safe

## Database Schema

### Models
- **User:** Gebruikers met rollen (ADMIN, DOCENT, STUDENT)
- **Program:** Opleidingsprogramma's
- **LearningLine:** Leerlijnen (Many-to-Many met Programs)
- **Track:** Leertrajecten (bijv. Jaar 1, Fase 2)
- **Course:** Opleidingsonderdelen (behoort tot Program)
- **Component:** Leercomponenten (behoort tot LearningLine)
- **Content:** Leerinhoud (centrale tabel met alle relaties)

## Setup Instructies

### Vereisten
- Node.js 18+ en npm/yarn
- Git

### Installatie

1. **Clone de repository**
   ```bash
   cd /Users/20002728/.claude-worktrees/Leerlijnentool/elegant-yonath
   ```

2. **Installeer dependencies**
   ```bash
   npm install
   # of
   yarn install
   ```

3. **Configureer environment variabelen**
   ```bash
   cp .env.example .env
   ```

   Bewerk `.env` en vul de volgende waardes in:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="genereer-een-veilige-random-string-hier"
   ```

   Voor productie met PostgreSQL:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/leerlijnentool?schema=public"
   ```

   Genereer een veilige NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

4. **Setup database**
   ```bash
   # Push schema naar database
   npm run db:push

   # Seed de database met initiële data
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open de applicatie**
   Navigeer naar [http://localhost:3000](http://localhost:3000)

## Standaard Login Credentials

Na het seeden van de database:

**Admin Account:**
- Email: `admin@leerlijnentool.nl`
- Password: `admin123`

## Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard en beheer pagina's
│   │   ├── users/          # Gebruikersbeheer
│   │   ├── programs/       # Programma beheer
│   │   └── ...
│   ├── docent/             # Docent dashboard
│   │   └── programs/[id]/  # Inhoudsbeheer per programma
│   ├── student/            # Student navigatie flow
│   │   └── programs/       # Program → LearningLine → Content
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── users/          # User CRUD
│   │   ├── programs/       # Program CRUD
│   │   ├── contents/       # Content CRUD + bulk import
│   │   └── ...
│   └── login/              # Login pagina
├── components/
│   ├── Navbar.tsx          # Navigatiebalk met "View As" functionaliteit
│   └── RichTextEditor.tsx  # TipTap editor component
├── lib/
│   ├── auth.ts             # NextAuth configuratie
│   ├── auth-helpers.ts     # Authenticatie helper functies
│   └── prisma.ts           # Prisma client instantie
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
└── types/
    └── next-auth.d.ts      # TypeScript type extensies
```

## Gebruik

### Gebruikers Aanmaken (Admin)
1. Log in als admin
2. Ga naar "Gebruikersbeheer"
3. Klik "+ Nieuwe gebruiker"
4. Vul email, wachtwoord en rol in
5. Voor Docenten: selecteer toegewezen programma's

### Leerinhoud Toevoegen (Docent)
1. Log in als docent
2. Selecteer een toegewezen programma
3. Klik "+ Nieuwe inhoud"
4. Vul alle vereiste velden in:
   - Leerlijn
   - Component
   - Leertraject
   - Opleidingsonderdeel
   - Inhoud (gebruik de rich text editor)
5. Klik "Opslaan"

### Bulk Import (Docent/Admin)
1. Ga naar inhoudsbeheer pagina
2. Klik "Bulk Import"
3. Plak JSON data in het formaat:
   ```json
   [
     {
       "richTextBody": "<p>Uw HTML inhoud hier</p>",
       "programId": "program-id",
       "learningLineId": "leerlijn-id",
       "componentId": "component-id",
       "trackId": "traject-id",
       "courseId": "vak-id"
     }
   ]
   ```
4. Klik "Importeren"

### View As Functionaliteit
**Admin:**
- Kan "View As Docent" of "View As Student" selecteren
- Simuleert de ervaring van die rol
- Klik "Wissen" om terug te keren naar admin view

**Docent:**
- Kan "View As Student" selecteren
- Simuleert de student-ervaring
- Klik "Wissen" om terug te keren naar docent view

## Database Migraties

Voor productie:
```bash
# Genereer migratie
npx prisma migrate dev --name beschrijving_van_wijziging

# Apply migraties in productie
npx prisma migrate deploy
```

## Development Commands

```bash
# Start development server
npm run dev

# Build voor productie
npm run build

# Start productie server
npm start

# Lint code
npm run lint

# Push schema naar database (development)
npm run db:push

# Seed database
npm run db:seed
```

## Beveiligingsoverwegingen

1. **Wachtwoorden:** Worden gehashed met bcryptjs (10 rounds)
2. **Authenticatie:** Session-based met JWT tokens via NextAuth.js
3. **Role-based Access Control:** Middleware beschermt routes op basis van gebruikersrol
4. **API Authorization:** Alle API routes valideren sessie en rol
5. **Docent Permissions:** Docenten kunnen alleen content beheren voor toegewezen programma's

## Productie Deployment

### Vercel (Aanbevolen)
1. Push code naar GitHub
2. Import project in Vercel
3. Configureer environment variabelen
4. Deploy!

### Handmatig
1. Configureer PostgreSQL database
2. Update `DATABASE_URL` in `.env`
3. Run migrations: `npx prisma migrate deploy`
4. Build: `npm run build`
5. Start: `npm start`

## Troubleshooting

**Database errors:**
```bash
# Reset database (LET OP: verwijdert alle data)
rm prisma/dev.db
npm run db:push
npm run db:seed
```

**NextAuth errors:**
- Controleer of `NEXTAUTH_SECRET` is ingesteld
- Controleer of `NEXTAUTH_URL` correct is

**Permission errors:**
- Controleer of gebruiker de juiste rol heeft
- Voor Docenten: controleer of ze toegewezen zijn aan het programma

## Support

Voor vragen of problemen, neem contact op met de beheerder.

## Licentie

Proprietary - Alle rechten voorbehouden
