# Agam Pad

Agam Pad is a tiny local-first notebook for quick thoughts, class notes, and random brain dumps.

I built it to feel simple on purpose: open it, write stuff, close it, and your notes are still there when you come back.

## Why I made this

Most note apps feel too heavy for the kind of writing I do every day. I wanted something that felt lightweight, private, and easy to keep open in a browser tab without getting in the way.

## What it does right now

- Local-first note storage using the browser, so your notes stay on your device.
- Add, edit, and delete notes from a clean split-screen layout.
- Copy any note quickly with one click.
- Save changes manually when you are done editing.
- Keep everything inside one simple notebook instead of juggling multiple screens.

## What I want this to become

These are the ideas I would love to add next:

- Session-based locking so the notebook feels safer when multiple tabs are open.
- Markdown support for nicer formatting and better writing flow.
- Encryption and decryption for notes, so private writing feels even more private.
- A stronger private notebook experience that still stays local-first.

## Tech Stack

- [Next.js](https://nextjs.org)
- React
- TypeScript
- Tailwind CSS

## Run Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- [src/app/page.tsx](src/app/page.tsx) contains the notebook UI and local storage logic.
- [src/app/components/NotePreview.tsx](src/app/components/NotePreview.tsx) handles the note editor.
- [src/app/lib/types.ts](src/app/lib/types.ts) defines the note shape used across the app.

## Small Note

This project is still pretty small and very handmade, which I kind of like. It is not trying to be a huge production app yet. It is just a cozy notebook with room to grow.
