# File Index - Leerlijnentool

Complete list of all files in the project with descriptions.

## Total Files: 47

## Configuration Files (9)

| File | Description |
|------|-------------|
| `package.json` | Dependencies, scripts, and project metadata |
| `tsconfig.json` | TypeScript compiler configuration |
| `next.config.js` | Next.js framework configuration |
| `tailwind.config.ts` | Tailwind CSS customization |
| `postcss.config.js` | PostCSS configuration for Tailwind |
| `.eslintrc.json` | ESLint code quality rules |
| `.env.example` | Environment variables template |
| `.gitignore` | Git exclusion patterns |
| `INSTALLATION_COMMANDS.sh` | Automated setup script |

## Documentation Files (5)

| File | Description |
|------|-------------|
| `README.md` | Complete project documentation |
| `QUICKSTART.md` | 5-minute setup guide |
| `PROJECT_SUMMARY.md` | Comprehensive feature list and architecture |
| `SETUP_CHECKLIST.md` | Interactive setup verification checklist |
| `FILE_INDEX.md` | This file - complete file listing |

## Database & ORM (3)

| File | Description |
|------|-------------|
| `prisma/schema.prisma` | Database schema with 9 models |
| `prisma/seed.ts` | Database seeding script with sample data |
| `lib/prisma.ts` | Prisma client singleton instance |

## Authentication (5)

| File | Description |
|------|-------------|
| `lib/auth.ts` | NextAuth.js configuration |
| `lib/auth-helpers.ts` | Authentication utility functions |
| `types/next-auth.d.ts` | TypeScript type extensions for NextAuth |
| `middleware.ts` | Route protection middleware |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth API handler |

## App Layout & Styling (4)

| File | Description |
|------|-------------|
| `app/layout.tsx` | Root layout with metadata |
| `app/providers.tsx` | SessionProvider wrapper |
| `app/globals.css` | Global styles and Tailwind directives |
| `app/page.tsx` | Home page with role-based redirect |

## Authentication Pages (2)

| File | Description |
|------|-------------|
| `app/login/page.tsx` | Login page with credentials form |
| `app/unauthorized/page.tsx` | 403 access denied page |

## Admin Interface (2)

| File | Description |
|------|-------------|
| `app/admin/page.tsx` | Admin dashboard with management links |
| `app/admin/users/page.tsx` | Complete user management (CRUD) |

## Docent Interface (2)

| File | Description |
|------|-------------|
| `app/docent/page.tsx` | Docent dashboard with assigned programs |
| `app/docent/programs/[programId]/page.tsx` | Content management with bulk import |

## Student Interface (3)

| File | Description |
|------|-------------|
| `app/student/page.tsx` | Program selection grid |
| `app/student/programs/[programId]/page.tsx` | Learning line selection |
| `app/student/programs/[programId]/learning-lines/[learningLineId]/page.tsx` | Content view with filters |

## API Routes - Users (2)

| File | Description |
|------|-------------|
| `app/api/users/route.ts` | GET (list), POST (create) |
| `app/api/users/[id]/route.ts` | PUT (update), DELETE (delete) |

## API Routes - Programs (2)

| File | Description |
|------|-------------|
| `app/api/programs/route.ts` | GET (list), POST (create) |
| `app/api/programs/[id]/route.ts` | PUT (update), DELETE (delete) |

## API Routes - Learning Lines (2)

| File | Description |
|------|-------------|
| `app/api/learning-lines/route.ts` | GET (list), POST (create) |
| `app/api/learning-lines/[id]/route.ts` | PUT (update), DELETE (delete) |

## API Routes - Content (3)

| File | Description |
|------|-------------|
| `app/api/contents/route.ts` | GET (list with filters), POST (create) |
| `app/api/contents/[id]/route.ts` | PUT (update), DELETE (delete) |
| `app/api/contents/bulk-import/route.ts` | POST (bulk import JSON) |

## API Routes - Other Entities (3)

| File | Description |
|------|-------------|
| `app/api/courses/route.ts` | GET (list), POST (create) |
| `app/api/tracks/route.ts` | GET (list), POST (create) |
| `app/api/components/route.ts` | GET (list), POST (create) |

## Reusable Components (2)

| File | Description |
|------|-------------|
| `components/Navbar.tsx` | Navigation bar with user info and "View As" |
| `components/RichTextEditor.tsx` | TipTap rich text editor with toolbar |

## File Breakdown by Category

### By Type
- **TypeScript/React (31)**: .tsx, .ts files
- **Configuration (9)**: .json, .js, .ts config files
- **Documentation (5)**: .md files
- **Database (1)**: .prisma file
- **Styles (1)**: .css file
- **Scripts (1)**: .sh file

### By Feature Area
- **API Routes (13)**: Complete RESTful API
- **User Interfaces (7)**: Admin, Docent, Student pages
- **Authentication (5)**: Login, middleware, helpers
- **Database (3)**: Schema, seed, client
- **Components (2)**: Reusable UI components
- **Configuration (9)**: Project setup files
- **Documentation (5)**: User and developer guides

## Key File Relationships

```
Root
├── Configuration Files
│   └── Define how the project runs
├── Documentation
│   └── Guides for users and developers
├── app/
│   ├── layout.tsx (wraps everything)
│   ├── providers.tsx (SessionProvider)
│   ├── page.tsx (role-based redirect)
│   ├── login/
│   ├── admin/ (uses API routes)
│   ├── docent/ (uses API routes)
│   ├── student/ (uses API routes)
│   └── api/
│       ├── auth/ (NextAuth)
│       ├── users/ (User CRUD)
│       ├── programs/ (Program CRUD)
│       ├── learning-lines/ (LearningLine CRUD)
│       ├── contents/ (Content CRUD + bulk)
│       └── [other entities]/ (CRUD)
├── components/
│   ├── Navbar.tsx (used by all dashboards)
│   └── RichTextEditor.tsx (used by content forms)
├── lib/
│   ├── auth.ts (NextAuth config)
│   ├── auth-helpers.ts (used by pages/API)
│   └── prisma.ts (used by API routes)
├── prisma/
│   ├── schema.prisma (defines database)
│   └── seed.ts (populates database)
├── types/
│   └── next-auth.d.ts (TypeScript types)
└── middleware.ts (protects routes)
```

## Quick File Lookup

### Need to modify authentication?
- `lib/auth.ts` - NextAuth configuration
- `lib/auth-helpers.ts` - Helper functions
- `middleware.ts` - Route protection

### Need to modify database schema?
- `prisma/schema.prisma` - All models
- `prisma/seed.ts` - Sample data

### Need to modify UI?
- `app/[role]/` - Role-specific pages
- `components/` - Reusable components
- `app/globals.css` - Global styles

### Need to modify API?
- `app/api/[entity]/` - Entity-specific endpoints
- All routes use `lib/prisma.ts` for database access

### Need to modify styling?
- `tailwind.config.ts` - Tailwind customization
- `app/globals.css` - Custom CSS
- Component files - Inline Tailwind classes

## Lines of Code (Approximate)

- **Total TypeScript/React**: ~4,500 lines
- **API Routes**: ~1,800 lines
- **UI Components**: ~2,000 lines
- **Configuration**: ~200 lines
- **Database Schema**: ~200 lines
- **Documentation**: ~1,500 lines

## Notable Implementation Details

1. **app/docent/programs/[programId]/page.tsx** (largest file)
   - Complete content management interface
   - Rich text editor integration
   - Bulk import functionality
   - ~550 lines

2. **app/admin/users/page.tsx** (second largest)
   - Full user CRUD interface
   - Program assignment UI
   - Modal-based forms
   - ~400 lines

3. **app/student/programs/[programId]/learning-lines/[learningLineId]/page.tsx**
   - Advanced filtering
   - Accordion component display
   - Real-time content updates
   - ~300 lines

4. **components/RichTextEditor.tsx**
   - TipTap integration
   - Custom toolbar
   - HTML output
   - ~150 lines

5. **prisma/seed.ts**
   - Creates admin user
   - Sample programs, learning lines, tracks
   - All relationships
   - ~150 lines

## Missing Files (Intentionally)

These files are generated or not needed:
- `node_modules/` - Generated by npm install
- `.next/` - Generated by Next.js build
- `prisma/dev.db` - Generated by db:push
- `.env` - Created from .env.example by user

## Update History

All files created in a single development session with:
- Complete functionality
- Type safety
- Error handling
- Responsive design
- Dutch language UI
- English code/comments

---

**Total Project Size**: 47 files, ~6,400 lines of code + documentation
