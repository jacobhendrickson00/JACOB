# Firefly Event Rentals

A static storefront redesign inspired by the SEZAM.STUDIO reference, preserving Firefly branding and rental inventory.

## Preview
Serve `dist` with any static HTTP server. The self-contained catalog also works in a direct-file preview.

## Vercel
Import this repository into Vercel. Select Other as the framework and `dist` as the output directory. No install or build command is required. `vercel.json` includes this configuration.

## Booking
Product and package reservations continue to the existing Firefly booking store. Catalog prices are the September 18, 2026 snapshot, not live availability. Inquiry forms prepare email/text messages for the customer to send; they do not create reservations.

## Main files
- `dist/index.html`: page and accessible forms
- `dist/site.css`: responsive design
- `dist/app.js`: package comparison, catalog, galleries and inquiry flow
- `dist/catalog.json` and `dist/catalog-data.js`: rental inventory
- `dist/package-extras.js`: optional extras quote flow
- `dist/assets`: existing Firefly logo and imagery

The previous local homepage is preserved in `backups/pre-remake`.
