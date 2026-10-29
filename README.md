# books-front

Interfaz web del catálogo.


## Requisitos

- Node 22
- `book-service` y, opcionalmente, `api-gateway` corriendo


## Instalar

```bash
npm i
```


## Modo A: sin gateway ni Keycloak

Crear `.env.development.local`:

```
VITE_AUTH_DISABLED=true
VITE_API_URL=http://localhost:8081/api/v1
VITE_DEV_USER_ID=dev-user-1
VITE_DEV_ROLE=ADMIN
```

Levantar `book-service` con perfil `dev` y luego:

```bash
npm run dev
```

## Modo B: con gateway y Keycloak


```
VITE_AUTH_DISABLED=false
VITE_API_URL=http://localhost:9000/api/v1
VITE_KEYCLOAK_URL=<url-de-keycloak>
VITE_KEYCLOAK_REALM=books-realm
VITE_KEYCLOAK_CLIENT_ID=books-front
```
Levantar `book-service`, `api-gateway` y luego:

```bash
npm run dev
```


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
