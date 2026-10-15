# Tests end-to-end de Facturín

Usan la app en un Chromium real con [Playwright](https://playwright.dev): levantan el backend (Nest) y el
frontend (Angular), hacen clic, escriben y verifican lo que se ve. También auditan la accesibilidad con axe.

## Requisito: los tres repos en la misma carpeta

Los tests levantan el backend y el frontend desde las carpetas vecinas `../facturin-back-nest` y
`../facturin-front-angular`, así que los tres repos tienen que estar clonados juntos y **con esos nombres de
carpeta** (distintos de los nombres de los repos en GitHub):

```bash
mkdir facturin && cd facturin
git clone https://github.com/ulisesbasualdo/facturin-gestor-de-finanzas facturin-back-nest
git clone https://github.com/ulisesbasualdo/facturin-gestor-de-finanzas-front facturin-front-angular
git clone https://github.com/ulisesbasualdo/facturin-gestor-de-finanzas-e2e test-auto
```

Quedaría así:

```
facturin/
├── facturin-back-nest/       ← backend (Nest)
├── facturin-front-angular/   ← frontend (Angular)
└── test-auto/                ← estos tests
```

Cada proyecto necesita sus dependencias (`npm install`) y el backend su propio `.env`.

## Preparación (una sola vez)

1. Crear la base de prueba en MySQL (tiene que terminar en `_test`, porque los tests la vacían):
   ```sql
   CREATE DATABASE facturin_test;
   ```
2. Copiar `.env.example` como `.env` y completar los datos de conexión.
3. Instalar dependencias y el navegador:
   ```bash
   npm install
   npx playwright install chromium
   ```

## Antes de cada corrida

- `mockable: false` en `facturin-front-angular/src/environments/environment.development.ts`.
- Nada corriendo en los puertos 3000 (Nest) y 4200 (Angular): los tests levantan sus propios servidores
  y fallan si los puertos están ocupados, para no escribir nunca en la base de desarrollo.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm test` | Corre todos los tests sin ventana |
| `npm run test:headed` | Los corre mostrando el navegador |
| `npm run test:ui` | Abre la interfaz de Playwright para correrlos de a uno y ver cada paso |
| `npm run report` | Abre el reporte de la última corrida (con video y traza de los que fallaron) |
| `npm run typecheck` | Verifica los tipos de TypeScript |

## Estructura

- `support/env.ts`: carga `.env` y protege que la base termine en `_test`.
- `support/global-setup.ts`: verifica `mockable: false` y migra la base de prueba.
- `support/database.ts` y `support/seed.ts`: vacían la base y cargan los datos de cada test.
- `support/facturin-app.ts`: cómo encontrar cada parte de la pantalla (por rol y nombre accesible).
- `tests/`: los tests, agrupados por tema.
