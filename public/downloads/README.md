# Technical datasheets

Drop real PDF datasheets here to make the "Product Datasheet (PDF)" button on a Silo 1
product page link directly to the file instead of falling back to an on-request state.

Expected path for each product segment slug:

```
public/downloads/<segment-slug>/datasheet-en.pdf
public/downloads/<segment-slug>/datasheet-fr.pdf
```

Example for the LED bar lights page (`/eclairages/barres-led-barlights`):

```
public/downloads/barres-led-barlights/datasheet-en.pdf
public/downloads/barres-led-barlights/datasheet-fr.pdf
```

No code change is needed — `lib/technical-downloads.ts` checks for the file's existence
at request time and links to it automatically once it's present.
