# PXL Huisstijl Implementatie Guide

Dit document beschrijft hoe de officiële PXL huisstijl is geïmplementeerd in de Leerlijnentool applicatie.

## Kleurenpallet

De applicatie gebruikt drie hoofdkleuren uit de PXL huisstijl:

### Primaire Kleuren

```css
--pxl-black: #030203  /* Rijk Zwart - hoofdkleur */
--pxl-white: #FFFFFF  /* Wit - hoofdkleur */
--pxl-gold: #AE9A64   /* Goud - accentkleur */
```

### Tailwind Classes

```html
<!-- Achtergrondkleuren -->
<div class="bg-pxl-black">Zwarte achtergrond</div>
<div class="bg-pxl-white">Witte achtergrond</div>
<div class="bg-pxl-gold">Goud achtergrond (alleen voor accenten!)</div>

<!-- Tekstkleuren -->
<p class="text-pxl-black">Zwarte tekst</p>
<p class="text-pxl-white">Witte tekst</p>
<p class="text-pxl-gold">Goud tekst (alleen voor accenten!)</p>

<!-- Borders -->
<div class="border-pxl-gold">Goud border</div>
```

## Typografie

### Lettertypen

**Body tekst:** Museo Sans (via Adobe Typekit)
- Font weights: 100, 300, 500, 700, 900
- Standaard weight: 300

**Headings:** Raleway (via Google Fonts)
- Font weights: 400, 700, 800, 900
- Standaard weight voor headings: 900 (Black)

### Tailwind Font Classes

```html
<!-- Body tekst (standaard) -->
<p class="font-sans">Museo Sans font</p>

<!-- Headings -->
<h1 class="font-heading">Raleway font</h1>

<!-- Of gebruik gewoon h1-h6 tags - ze gebruiken automatisch Raleway -->
<h1>Deze gebruikt automatisch Raleway Black</h1>
```

### Typography Scale

```css
h1 { font-size: 2.5rem; font-weight: 900; }  /* 40px */
h2 { font-size: 2rem; font-weight: 900; }    /* 32px */
h3 { font-size: 1.5rem; font-weight: 700; }  /* 24px */
h4 { font-size: 1.25rem; font-weight: 700; } /* 20px */
h5 { font-size: 1.125rem; font-weight: 700; } /* 18px */
h6 { font-size: 1rem; font-weight: 700; }    /* 16px */
body { font-size: 1rem; font-weight: 300; }  /* 16px */
```

## PXL Component Classes

### Buttons

```html
<!-- Primaire button (goud achtergrond) -->
<button class="btn-pxl-primary">
  Call to Action
</button>

<!-- Secundaire button (wit met zwarte border) -->
<button class="btn-pxl-secondary">
  Secundaire actie
</button>

<!-- Outline button (transparant met zwarte border) -->
<button class="btn-pxl-outline">
  Minder prominent
</button>
```

### Cards

```html
<!-- Standaard card met goud accent bovenaan -->
<div class="card-pxl">
  <h3>Card titel</h3>
  <p>Card inhoud...</p>
</div>

<!-- Card met hover effect -->
<div class="card-pxl-hover">
  <h3>Interactieve card</h3>
  <p>Lift effect bij hover</p>
</div>
```

### Links

```html
<!-- PXL styled link met goud underline bij hover -->
<a href="#" class="link-pxl">
  Klik hier
</a>
```

### Forms

```html
<!-- Input veld -->
<label class="label-pxl">
  Naam
</label>
<input type="text" class="input-pxl" />

<!-- Select dropdown -->
<label class="label-pxl">
  Kies een optie
</label>
<select class="select-pxl">
  <option>Optie 1</option>
  <option>Optie 2</option>
</select>
```

### Layout

```html
<!-- Section met correcte padding -->
<section class="section-pxl">
  <!-- Container met max-width en padding -->
  <div class="container-pxl">
    <h2>Section titel</h2>
    <p>Section content...</p>
  </div>
</section>
```

### Hero Section

```html
<!-- Hero met curved bottom border (zoals op PXL website) -->
<div class="hero-pxl">
  <img src="hero-image.jpg" alt="Hero" />
  <!-- Het curved effect wordt automatisch toegevoegd via ::after -->
</div>
```

### Goud Accent Line

```html
<!-- Heading met goud accent onderlijning -->
<h2 class="accent-gold">
  Belangrijke titel
</h2>
```

### Tables

```html
<!-- PXL styled table -->
<table class="table-pxl">
  <thead>
    <tr>
      <th>Kolom 1</th>
      <th>Kolom 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

## Utility Classes

### Heading Styling

```html
<!-- Pas Raleway font toe op niet-heading elementen -->
<div class="text-pxl-heading">
  Deze tekst gebruikt Raleway Black
</div>
```

### Shadows

```html
<!-- Card shadow -->
<div class="shadow-pxl-card">Card met subtiele shadow</div>

<!-- Hover shadow -->
<div class="shadow-pxl-hover">Grotere shadow voor hover</div>

<!-- Lift shadow -->
<div class="shadow-pxl-lift">Shadow voor lifted elementen</div>
```

### Gradients

```html
<!-- PXL zwart gradient -->
<div class="bg-gradient-pxl">
  Zwart naar donkergrijs gradient
</div>
```

## Spacing Systeem (8px Grid)

De applicatie gebruikt een 8px grid systeem:

```css
--spacing-xs: 8px
--spacing-sm: 16px
--spacing-md: 24px
--spacing-lg: 32px
--spacing-xl: 48px
--spacing-2xl: 64px
```

In Tailwind gebruik je de standaard spacing scale die aligned is met dit systeem:
- `p-2` = 8px
- `p-4` = 16px
- `p-6` = 24px
- `p-8` = 32px
- `p-12` = 48px
- `p-16` = 64px

## Design Principes

### 1. Goud alleen als accent

⚠️ **BELANGRIJK:** Gebruik goud ALLEEN voor:
- Call-to-action buttons
- Belangrijke links (hover states)
- Decoratieve elementen (borders, underlines)
- Focus states

❌ **NIET gebruiken voor:**
- Grote vlakken
- Body tekst
- Achtergronden van sections

### 2. Hoog contrast

- Gebruik altijd zwart (#030203) tekst op witte achtergrond
- Of witte tekst op zwarte achtergrond
- Minimale contrast ratio: 4.5:1 voor normale tekst, 3:1 voor grote tekst

### 3. Ruime witruimte

- Gebruik generous padding en margins
- Section padding: 64px verticaal op desktop, 32px op mobiel
- Card padding: 24px tot 32px

### 4. Professionele uitstraling

- Cleane, minimalistsche layouts
- Solide lettertypen (Raleway Black voor headings)
- Subtiele animaties en hover effects

## Responsive Design

### Breakpoints

```css
sm: 576px   /* Small devices (landscape phones) */
md: 768px   /* Medium devices (tablets) */
lg: 992px   /* Large devices (desktops) */
xl: 1200px  /* Extra large devices */
```

### Mobile Typography

Op mobiel worden heading sizes automatisch verkleind:

```css
@media (max-width: 768px) {
  h1 { font-size: 2rem; }      /* Was 2.5rem */
  h2 { font-size: 1.75rem; }   /* Was 2rem */
  h3 { font-size: 1.375rem; }  /* Was 1.5rem */
}
```

## Toegankelijkheid

### Focus States

Alle interactieve elementen hebben een goud focus ring:

```css
focus:outline-none focus:ring-2 focus:ring-pxl-gold focus:ring-offset-2
```

### Hover States

```html
<!-- Button hover -->
<button class="hover:shadow-pxl-hover hover:-translate-y-0.5">
  Hover me
</button>

<!-- Link hover -->
<a href="#" class="hover:text-pxl-gold hover:border-pxl-gold">
  Hover link
</a>

<!-- Card hover -->
<div class="hover:shadow-pxl-hover hover:-translate-y-1">
  Hover card
</div>
```

## Voorbeelden

### Compleet Button Voorbeeld

```html
<button class="px-6 py-3 bg-pxl-gold text-pxl-black font-medium rounded-lg transition-all duration-200 ease-in-out hover:shadow-pxl-hover hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-pxl-gold focus:ring-offset-2">
  Inschrijven
</button>

<!-- Of gebruik de component class: -->
<button class="btn-pxl-primary">
  Inschrijven
</button>
```

### Compleet Card Voorbeeld

```html
<div class="bg-white rounded-pxl shadow-pxl-card p-6 md:p-8 border-t-4 border-pxl-gold transition-all duration-200 hover:shadow-pxl-hover hover:-translate-y-1">
  <h3 class="text-xl font-bold mb-4">Card Titel</h3>
  <p class="text-pxl-black">Card inhoud met Museo Sans font...</p>
  <a href="#" class="link-pxl mt-4 inline-block">
    Lees meer →
  </a>
</div>

<!-- Of gebruik de component class: -->
<div class="card-pxl-hover">
  <h3 class="text-xl font-bold mb-4">Card Titel</h3>
  <p>Card inhoud...</p>
  <a href="#" class="link-pxl mt-4 inline-block">
    Lees meer →
  </a>
</div>
```

### Compleet Hero Section Voorbeeld

```html
<div class="hero-pxl bg-pxl-black text-white py-24 md:py-32">
  <div class="container-pxl">
    <h1 class="text-4xl md:text-5xl font-bold mb-6">
      Welkom bij <span class="text-pxl-gold">PXL</span>
    </h1>
    <p class="text-xl mb-8">
      Hogeschool PXL - Passie voor onderwijs
    </p>
    <button class="btn-pxl-primary">
      Ontdek meer
    </button>
  </div>
</div>
```

## Migratie van Bestaande Code

Als je bestaande componenten wilt updaten naar PXL huisstijl:

### Buttons

```html
<!-- Oud -->
<button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">

<!-- Nieuw -->
<button class="btn-pxl-primary">
```

### Cards

```html
<!-- Oud -->
<div class="bg-white rounded-lg shadow-sm p-6">

<!-- Nieuw -->
<div class="card-pxl">
```

### Headings

```html
<!-- Oud -->
<h1 class="text-3xl font-bold text-gray-900">

<!-- Nieuw -->
<h1 class="text-3xl font-heading text-pxl-black">
<!-- Of gewoon: -->
<h1>  <!-- gebruikt automatisch Raleway Black en juiste size -->
```

### Links

```html
<!-- Oud -->
<a href="#" class="text-blue-600 hover:text-blue-800">

<!-- Nieuw -->
<a href="#" class="link-pxl">
```

## Tips & Best Practices

1. **Gebruik component classes waar mogelijk** - Ze zijn geoptimaliseerd en consistent
2. **Goud spaarzaam gebruiken** - Het is een accent, geen hoofdkleur
3. **Respecteer de spacing scale** - Blijf bij de 8px grid
4. **Test toegankelijkheid** - Gebruik voldoende contrast en focus states
5. **Mobile-first** - Begin met mobiele layout, breid uit naar desktop
6. **Consistentie** - Gebruik dezelfde patterns door de hele app

## Support

Voor vragen over de PXL huisstijl implementatie:
- Bekijk de officiële PXL brand guidelines
- Check `tailwind.config.ts` voor alle beschikbare kleuren
- Check `app/globals.css` voor alle component classes
