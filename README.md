# M.V.G.B. Group Links

Directory of the Mission Vishwaguru Bharat Arattai groups (40 links: 1 channel, 2 community groups, 28 states, 1 Gurukul group, 8 union territories). Built with Next.js (App Router) and JavaScript.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## What it does

- Search by state name, short code (UP, TN, KL), old spelling (Orissa, Bangalore) or local script. Press `/` to jump to the search box, `Esc` to clear it.
- Filter by Community, States or Union territories. The counts update with your search.
- **Join** opens the Arattai link, **Copy** copies it, and the QR button opens a scannable code with the exact group name, Copy, and Share (on phones).
- Light and dark theme, saved in the browser. Follows the device setting on first visit.
- Works without JavaScript for the links themselves. Only search and filters need it.

## Edit the data

All groups live in `src/data/groups.js`. To add or change one, edit its entry:

| Field | Meaning |
| --- | --- |
| `category` | `channel`, `community`, `state`, `gurukul` or `ut` |
| `code` | Two-letter code shown on the plate |
| `name` / `native` | Display name and the name in the local script |
| `groupName` | Exact name of the group in Arattai (shown in the QR dialog) |
| `link` | Arattai invite link |
| `keywords` | Lowercase words people may search for |

The QR codes are generated from `link`, so they never go out of sync.

## Privacy

Anyone with an invite link can join these groups. The page sets `noindex` so search engines skip it, but if you deploy it publicly the links are still visible to anyone who has the address. Put it behind a login or share the address only with people you trust.

## Structure

```
src/
  app/          layout, page, global styles, favicon
  components/   GroupDirectory (search + filters), GroupRow, QrDialog, ThemeToggle
  data/         groups.js
  lib/          search.js, clipboard.js
```
