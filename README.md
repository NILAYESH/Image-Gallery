# Image Gallery

A minimal React + Vite photo gallery app.

This repository contains a small image gallery built with React and Vite. It includes basic ESLint configuration and the scripts to run, build, and lint the project.

## Tech stack

- React 19
- Vite
- ESLint

## Available scripts

Run these from the project root:

- npm install — install dependencies
- npm run dev — start the dev server (Vite + HMR)
- npm run build — build production bundles
- npm run preview — locally preview the production build
- npm run lint — run ESLint

These scripts are defined in package.json.

## Getting started

1. Clone the repo

   git clone https://github.com/NILAYESH/Image-Gallery.git
   cd Image-Gallery

2. Install dependencies

   npm install

3. Start the development server

   npm run dev

Open http://localhost:5173 (or the port shown by Vite) in your browser.

## Project structure (typical)

- index.html
- src/
  - main.jsx — app entry
  - App.jsx — root component
  - components/ — React components
  - assets/ — images and static assets
- public/ — static files (if used)
- package.json

Adjust paths or filenames depending on the exact layout in this repo.

## ESLint

Project includes ESLint dev-dependencies. Run `npm run lint` to check code style. For a production app consider enabling type-aware rules with TypeScript.

## Notes

- The project uses React + Vite (see package.json for exact versions).
- Update this README with features, screenshots, or usage examples specific to your app.

