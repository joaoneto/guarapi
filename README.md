# Guarapi

![CI](https://github.com/guarapi/guarapi/actions/workflows/ci.yml/badge.svg?branch=main)
[![license](https://img.shields.io/github/license/guarapi/guarapi)](LICENSE)

Welcome to Guarapi! This repository contains packages related to the Guarapi framework ecosystem. Each package can be used independently or in combination to build powerful web applications with Guarapi.

## Packages
Explore the individual packages in this monorepo:

- [**guarapi**](./packages/guarapi): Guarapi framework package.
- [**@guarapi/eslint-config-guarapi**](./packages/eslint-config-guarapi): Recommended code style configuration.
- [**@guarapi/create-guarapi-app**](./packages/create-guarapi-app): The starter kit package.

Click on the package names above to view their respective READMEs and learn more about each package's features and usage.

## Contributing
We enthusiastically welcome contributions from the Guarapi community. If you're interested in contributing to the project, please follow the steps outlined in our [Contribution Guidelines](CONTRIBUTING.md). Your contributions can include bug fixes, new features, documentation improvements, or any other enhancements that benefit the Guarapi framework.

## Code of Conduct
To maintain a friendly and inclusive environment, we expect all contributors and community members to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). This code sets the standard for respectful and collaborative interactions within the Guarapi community.

## Getting Started
If you're new to Guarapi, start by checking out the README for the [**guarapi**](./packages/guarapi) package. It provides instructions on installation, basic usage, and API details.

For code style guidelines, refer to the [**@guarapi/eslint-config-guarapi**](./packages/eslint-config-guarapi) package README.

To create a Guarapi from starter kit package, you can use the following command format:

### Using pnpm:

```shell
pnpm create @guarapi/guarapi-app
```

### Using yarn:

```shell
yarn create @guarapi/guarapi-app
```

### Using npx:

```shell
npx @guarapi/create-guarapi-app
```

This command will generate a new Guarapi application starter kit with the following options:

- `--name <name>`: Project name (default: my-project).
- `--example <example>`: Example folder name (default: basic-api). You can pick one from the [examples](https://github.com/guarapi/guarapi/tree/main/examples).
- `--yes`: Create the app automatically and answer "yes" to any prompts.

For example, to create a Guarapi app with a custom name and example, you can run:

```shell
pnpm create @guarapi/guarapi-app --name my-custom-project --example my-custom-example
```

## Running Examples
To run examples located in the `./examples` directory, you can use the following command format:

### Using pnpm:

```shell
pnpm example --filter=basic-api
```

This command will execute the example named `basic-api`. You can replace `basic-api` with the name of the specific example you want to run.

Feel free to explore the Guarapi documentation for more details on effectively and efficiently utilizing the framework in your projects. If you have any questions or require further assistance, don't hesitate to reach out to our vibrant and supportive community.

Happy coding with Guarapi!
