# Setup Checklist - Leerlijnentool

Use this checklist to set up the Leerlijnentool application.

## Pre-requisites
- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Git installed (for version control)

## Installation Steps

### 1. Install Dependencies
```bash
cd /Users/20002728/.claude-worktrees/Leerlijnentool/elegant-yonath
npm install
```
- [ ] Dependencies installed successfully
- [ ] No errors in console

### 2. Environment Configuration
```bash
cp .env.example .env
```
- [ ] `.env` file created
- [ ] Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Paste secret into `.env` file
- [ ] Verify DATABASE_URL is set correctly

**Your .env should contain:**
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<your-generated-secret-here>"
```

### 3. Database Setup
```bash
npm run db:push
```
- [ ] Database created successfully
- [ ] No Prisma errors
- [ ] File `prisma/dev.db` exists

```bash
npm run db:seed
```
- [ ] Seed completed successfully
- [ ] Admin user created
- [ ] Sample data populated

### 4. Start Development Server
```bash
npm run dev
```
- [ ] Server started successfully
- [ ] Running on http://localhost:3000
- [ ] No compilation errors

### 5. Verify Installation

**Test Login:**
- [ ] Navigate to http://localhost:3000
- [ ] Redirects to /login
- [ ] Login page loads correctly

**Admin Login:**
- [ ] Email: `admin@leerlijnentool.nl`
- [ ] Password: `admin123`
- [ ] Login successful
- [ ] Redirects to /admin dashboard

**Check Admin Dashboard:**
- [ ] All cards visible (6 total)
- [ ] "Bekijk als" buttons work
- [ ] Navigation links clickable

**Check User Management:**
- [ ] Click "Gebruikersbeheer"
- [ ] Admin user visible in table
- [ ] "+ Nieuwe gebruiker" button works
- [ ] Can open creation modal

### 6. Create Test Users

**Create Docent:**
- [ ] Click "+ Nieuwe gebruiker"
- [ ] Fill in:
  - Email: `docent@test.nl`
  - Password: `docent123`
  - Rol: Docent
- [ ] Check "Bachelor Informatica" in programs
- [ ] Click "Opslaan"
- [ ] Docent appears in user table

**Create Student:**
- [ ] Click "+ Nieuwe gebruiker"
- [ ] Fill in:
  - Email: `student@test.nl`
  - Password: `student123`
  - Rol: Student
- [ ] Click "Opslaan"
- [ ] Student appears in user table

### 7. Test Docent Interface

**Login as Docent:**
- [ ] Sign out from admin
- [ ] Login with `docent@test.nl` / `docent123`
- [ ] Redirects to /docent
- [ ] "Bachelor Informatica" card visible

**Create Content:**
- [ ] Click "Bachelor Informatica"
- [ ] Click "+ Nieuwe inhoud"
- [ ] Select:
  - Leerlijn: Programmeren
  - Component: Basis Syntax
  - Leertraject: Jaar 1
  - Opleidingsonderdeel: Inleiding Programmeren
- [ ] Add some formatted text in editor
- [ ] Click "Opslaan"
- [ ] Content appears in table

**Test Bulk Import:**
- [ ] Click "Bulk Import"
- [ ] Modal opens
- [ ] Paste valid JSON
- [ ] Click "Importeren"
- [ ] Success message appears
- [ ] New content in table

### 8. Test Student Interface

**Login as Student:**
- [ ] Sign out from docent
- [ ] Login with `student@test.nl` / `student123`
- [ ] Redirects to /student
- [ ] Program cards visible

**Navigate to Content:**
- [ ] Click "Bachelor Informatica"
- [ ] Learning lines visible
- [ ] Click "Programmeren"
- [ ] Content view loads
- [ ] Filters visible

**Test Filters:**
- [ ] Select "Jaar 1" in Leertraject filter
- [ ] Select a course in Opleidingsonderdeel filter
- [ ] Content updates correctly
- [ ] Clear filters works

**Test Accordion:**
- [ ] Click on a component header
- [ ] Content expands/collapses
- [ ] HTML renders correctly
- [ ] Course and track badges visible

### 9. Test "View As" Feature

**Admin View As Docent:**
- [ ] Login as admin
- [ ] Click "Bekijk als Docent"
- [ ] Redirects to /docent
- [ ] Yellow badge shows "Weergave als: Docent"
- [ ] Click "Wissen"
- [ ] Returns to admin dashboard

**Admin View As Student:**
- [ ] Click "Bekijk als Student"
- [ ] Redirects to /student
- [ ] Yellow badge shows "Weergave als: Student"
- [ ] Student interface works
- [ ] Click "Wissen"
- [ ] Returns to admin dashboard

**Docent View As Student:**
- [ ] Login as docent
- [ ] Click "Bekijk als Student"
- [ ] Redirects to /student
- [ ] Yellow badge visible
- [ ] Click "Wissen"
- [ ] Returns to docent dashboard

### 10. Final Checks

**Security:**
- [ ] Cannot access /admin as docent (redirects)
- [ ] Cannot access /admin as student (redirects)
- [ ] Cannot access /docent as student (redirects)
- [ ] Cannot edit content without login
- [ ] Passwords are not visible in database

**Responsive Design:**
- [ ] Resize browser window
- [ ] Mobile view works (< 640px)
- [ ] Tablet view works (640-1024px)
- [ ] Desktop view works (> 1024px)

**Navigation:**
- [ ] All "Terug" links work
- [ ] Breadcrumb navigation works
- [ ] Sign out works from all pages
- [ ] Auto-redirect works after login

## Troubleshooting

### Common Issues

**Error: "Cannot find module '@prisma/client'"**
```bash
npm run postinstall
```

**Error: "Invalid NEXTAUTH_SECRET"**
- Generate new secret: `openssl rand -base64 32`
- Update `.env` file

**Database locked error:**
```bash
rm prisma/dev.db
npm run db:push
npm run db:seed
```

**Port 3000 already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
npm run dev -- -p 3001
```

**Rich text editor not loading:**
- Clear browser cache
- Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

## Production Deployment Checklist

### Before Deployment
- [ ] Change default admin password
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Enable HTTPS
- [ ] Set proper NEXTAUTH_URL
- [ ] Run `npm run build` successfully
- [ ] Test production build locally

### Environment Variables (Production)
- [ ] DATABASE_URL updated for PostgreSQL
- [ ] NEXTAUTH_URL set to production domain
- [ ] NEXTAUTH_SECRET is secure and unique
- [ ] All variables set in hosting platform

### Database (Production)
- [ ] PostgreSQL database provisioned
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Seed with real data (not test data)
- [ ] Backups configured

### Post-Deployment
- [ ] Test all user flows
- [ ] Verify authentication works
- [ ] Check all API endpoints
- [ ] Monitor error logs
- [ ] Set up analytics (optional)

## Success!

If all checkboxes are ticked, your Leerlijnentool is ready to use! 🎉

**Next Steps:**
- Read [QUICKSTART.md](QUICKSTART.md) for common workflows
- Read [README.md](README.md) for full documentation
- Start creating your curriculum content!

## Support

For issues or questions:
1. Check the [README.md](README.md) troubleshooting section
2. Review the [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for technical details
3. Contact your system administrator
