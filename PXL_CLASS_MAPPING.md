# PXL Class Mapping Guide

Dit document toont hoe oude Tailwind classes gemapt worden naar PXL huisstijl classes.

## Globale Replacements

### Achtergronden
```
bg-gray-50 → bg-gray-50 (behouden voor subtiele achtergronden)
bg-white → bg-white (behouden)
bg-blue-600 → bg-pxl-gold (voor primary buttons)
bg-blue-100 → bg-pxl-gold/10 (voor badges/tags)
```

### Tekst Kleuren
```
text-gray-900 → text-pxl-black
text-gray-700 → text-pxl-black
text-gray-600 → text-gray-600 (behouden voor subtiele tekst)
text-gray-500 → text-gray-500 (behouden voor disabled/placeholder)
text-blue-600 → text-pxl-gold (voor links/accenten)
text-blue-800 → text-pxl-black (voor hover states op links)
```

### Borders
```
border-gray-200 → border-gray-200 (behouden)
border-gray-300 → border-gray-300 (behouden)
border-blue-500 → border-pxl-gold
```

### Buttons
```
bg-blue-600 text-white hover:bg-blue-700 → btn-pxl-primary
bg-white border text-gray-700 hover:bg-gray-50 → btn-pxl-secondary
```

### Links
```
text-blue-600 hover:text-blue-800 → link-pxl
OF
text-pxl-gold hover:text-pxl-black
```

### Focus States
```
focus:ring-blue-500 → focus:ring-pxl-gold
focus:border-blue-500 → focus:border-pxl-gold
```

### Cards
```
bg-white rounded-lg shadow-sm → card-pxl
```

### Headings
```
text-3xl font-bold text-gray-900 → text-3xl font-heading font-black text-pxl-black
text-2xl font-semibold → text-2xl font-heading font-black text-pxl-black
```

### Inputs
```
px-3 py-2 border border-gray-300 rounded-md → input-pxl
```

### Labels
```
block text-sm font-medium text-gray-700 → label-pxl
```

## Per Component Type

### Navbar
- Achtergrond: `bg-pxl-black`
- Border: `border-b-4 border-pxl-gold`
- Logo: Witte cirkel met zwarte PXL tekst
- Tekst: `text-pxl-white`
- Button: `btn-pxl-primary`

### Tables
- Gebruik `table-pxl` class
- Headers: Zwarte achtergrond, witte tekst
- Rows: Hover gray-50

### Modals
- Card: `card-pxl`
- Overlay: `bg-black bg-opacity-50`
- Inputs: `input-pxl`
- Labels: `label-pxl`
- Submit button: `btn-pxl-primary`
- Cancel button: `btn-pxl-secondary`

### Dashboard Cards
- Gebruik `card-pxl-hover` voor interactieve cards
- Heading met `accent-gold` class voor gouden onderlijning
