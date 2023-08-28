# Guarapi
Guarapi is a framework for building web applications with nodejs. It aims to provide a simple and elegant way to create fast and scalable web apps, without sacrificing functionality or performance. Guarapi offers a minimalist and expressive syntax, a flexible routing engine, and a rich set of built-in features. Guarapi is designed to be easy to learn, use, and extend, making it a great choice for beginners and experts alike.

## Installation

To install the project dependencies, run the following command:

```bash
npm i
```

## Start
To start production read code in dist, run the following command:

```bash
npm start
```

Starts the application by running the index.js file in the dist folder.

## Development

To run the project in development mode, run the following command:

```bash
npm run dev
```

This will start nodemon, which will monitor the changes in the files and restart the server automatically.

## Build

To build the project for production, run the following command:

```bash
npm run build
```

This will use swc to transpile the TypeScript files into JavaScript and place them in the dist folder.

## Clean

To remove the artifacts, run the following command:

```bash
npm run clean
```

Removes the dist folder, which contains the files generated by swc.

## Lint

To check if the code is following the eslint and prettier rules, run the following command:

```bash
npm run lint
```

This will show the possible errors and warnings in the code and suggest how to fix them.
