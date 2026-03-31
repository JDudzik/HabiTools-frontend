## TODO:
- After the app is online and has a public URL, use https://www.pwabuilder.com/ to analyze additional details for PWA configuration

## Getting Started with the `development` environment
- Install `yarn` globally with `npm install --global yarn`.
- Install packages with: `yarn install`.
- Create .env files. Duplicate `.env.example` to `.env`,
  - Set environment variables appropriately.
- Run the development environment with: `yarn start`.
- Access the server from: http://localhost:3000.

## Getting Started with the `production` environment locally
- **Note:** This is only recommended for local testing of production.
- Install `yarn` globally with `npm install --global yarn`.
- Install packages with: `yarn install --production`.
- Create .env files. Duplicate `.env.example` to `.env`,
  - If you want to separate dev and production env, you can use `.env.production` instead.
  - Set environment variables appropriately for each file.
- Build the static production site and serve it:
  - Build it with `yarn build:prod`.
  - Serve it with `yarn start:prod`. This will host the `out` folder on port 3000.

## Getting started with `production` with Docker
- **Note:** This is the recommended method for live production environments.
- Make sure your env variables are attached. It's recommended to NOT use an `.env` file in production as this is a security risk and maintainability liablity. Instead, use a build system or PaaS that will inject env variables into the application at build-time.
- The build process can be quite resource intensive, so a good strategy is to use a build pipeline such as Github Actions to build the static site and push the assets to another branch, which can then be loaded into your production environment and served directly.
  - [This is the provided Github Action in this repo](./.github/workflows/Build%20&%20Push%20static%20files.yml). If you use this one, you will also need to add your environment variables into Github so it can inject them into the code.



## License

This project is licensed under the GNU Affero General Public License v3 (AGPLv3).

You are free to use, modify, and distribute this software under the terms of the AGPLv3.

### Commercial Use

If you wish to use this software in a proprietary product, offer it as a service without releasing source code, or otherwise not comply with AGPLv3 requirements, you must obtain a commercial license.

For commercial licensing inquiries, contact: JDudzik950@gmail.com

### Contributor License Agreement (CLA)

By contributing to this project, you agree to the Contributor License Agreement (CLA).

See the `CLA.md` file for details.