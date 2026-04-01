# Copilot AI Agent Instructions for boilerplate-frontend

## Project Overview
- This is a Next.js-based frontend boilerplate with modular structure under `src/` and `modules/`.
- Major UI components are in `src/components/`, organized by feature or type (e.g., `BadgeIconButton`, `LoadingElement`).
- Business logic, API calls, and context providers are in `src/lib/` (see `api/`, `contexts/`, `hooks/`, `utils/`).
- Page-level logic and routing are handled in `modules/` and `pages/`.
- Page routing is handled in `pages/` which directly imports pages from `modules/`.

## Key Workflows
- **Development:**
  - Install dependencies: `yarn install`
  - Start dev server: `yarn start` (http://localhost:3000)
  - Use `.env` for environment variables (copy from `.env.example`).

## Patterns & Conventions
- **Component Exports:** Each component folder has an `index.js` for re-exports. Import from the folder root, not the file.
- **Context/State:** Use React context providers in `src/lib/contexts/` for app-wide state (e.g., `UserContext`, `ConfirmationModalContext`).
- **API Calls:** Centralized in `src/lib/api/` with methods organized by feature. All API calls utilize tanstack-query. Refer to `src/lib/api/methods/@exampleApi/` for examples of API requests with Tanstack query.
- **Custom Hooks:** Place reusable hooks in `src/lib/hooks/`.
- **Theming:** Theme settings in `src/lib/data/themeSettings.js` for MUI.
- **PWA:** Manifest and icons in `public/`. Update for new projects.
- **Form Components:** Forms use Formik for logic and MUI for UI. Most form field components are in `src/components/formik-mui`.
- **Page Layouts:** Whenever possible, utilize the `L` component, which is a wrapper on top of most common layout components. For example, `L.div` instead of `div`. `L.h2` instead of `Typography variant="h2"`.
- **Modules:** This project uses ESmodules (import/export) throughout except in very specific scenarios. Whenever possible, look at sibling content to determine the standards of how to implement (eg: Should you use an index file? Should you `export default` or just `export`, etc).
- **Functions:** Use async/await for asynchronous code. Use arrow functions whenever possible.

## Integration & Cross-Component Communication
- Use context providers for cross-cutting concerns (auth, navigation, modals).
- API methods are imported from `src/lib/api/methods/`.
- Most pages utilize the `usePageManager` hook for state, navigation, and error management.

## Examples
- To add a new feature module: create a folder in `modules/`, add an `index.js`, and register routes in `pages/`.
- To add a new context: create in `src/lib/contexts/`, wrap in `modules/_app/components/GlobalProviders`. Avoid creating new providers without confirming with the user.

## References
- See [README.md](../../README.md) for setup and deployment details.
- See `.env.example` for required environment variables.
- See `.github/workflows/Build & Push static files.yml` for CI/CD example.

---
**When in doubt, follow the structure and patterns of existing modules/components.**
