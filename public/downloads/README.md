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

## Per-series datasheets (Gamme & Séries pages)

Pages that break a range down into series (e.g. `/eclairages/barres-led-barlights`) use one
subfolder per series, named `<segment-slug>-<series-code>`:

```
public/downloads/barres-led-barlights-bar-std/datasheet-en.pdf
public/downloads/barres-led-barlights-bar-std/datasheet-fr.pdf
public/downloads/barres-led-barlights-bar-pwr/datasheet-en.pdf
public/downloads/barres-led-barlights-bar-pwr/datasheet-fr.pdf
public/downloads/barres-led-barlights-bar-inox/datasheet-en.pdf
public/downloads/barres-led-barlights-bar-inox/datasheet-fr.pdf
```

Until a given file exists, its "Datasheet (PDF)" button falls back to the browser's print view.
