# Modo offline-first (frontend)

Noctiluca es una PWA **offline-first**: la fuente de verdad para la UI es **IndexedDB** (vía Dexie). La red alimenta la base local y drena una cola de cambios; la UI no depende de React Query para leer datos de negocio.

## Arquitectura en una imagen

```
┌─────────────┐     lectura/escritura      ┌──────────────┐
│   Pantallas │ ◄────────────────────────► │ Dexie (local)│
└──────┬──────┘                            └──────┬───────┘
       │                                           │
       │ hooks en src/sync/lecturas.ts             │ outbox
       │                                           ▼
       │                                    ┌──────────────┐
       └──────────────────────────────────► │ sync-engine  │
                                            └──────┬───────┘
                                                   │ push / pull
                                                   ▼
                                            GET  /api/Sync/cambios
                                            POST /api/Sync/aplicar
```

## Capas principales (`src/sync/`)

| Módulo | Rol |
|--------|-----|
| `db.ts` | Esquema Dexie (escritos, carpetas, hábitos, objetivos, outbox, meta) |
| `tipos.ts` | Tipos locales y operaciones del outbox |
| `outbox.ts` | Compactación de operaciones (ej. varios upserts → uno) |
| `sync-engine.ts` | Pull incremental, push del outbox, Web Locks, listeners online/visibility |
| `estado-sync.ts` | Estado global Zustand: online, pendientes, sincronizando, error |
| `lecturas-core.ts` | Lógica pura: reconstruir `CarpetaDTO` / `EscritoDTO` desde registros locales |
| `lecturas.ts` | Hooks `useLiveQuery` para la UI |
| `repositorio-*.ts` | Mutaciones offline: escriben local + encolan outbox |
| `busqueda-core.ts` / `busqueda.ts` | Búsqueda offline sobre título y cuerpo |
| `pedir-sync.ts` | Import lazy del motor (no pesa el arranque) |

## Flujo de lectura

1. Tras login, `app.tsx` carga `iniciarSync()` (chunk lazy).
2. El motor hace **pull** (`GET /api/Sync/cambios?desde={cursor}`) y upsert en Dexie.
3. Las pantallas usan hooks como `usarCarpetasRaiz()`, `usarEscrito()`, etc.
4. `useLiveQuery` re-renderiza cuando cambia IndexedDB.

Si un escrito no está local (ej. link directo), `sembrarEscrito()` puede traerlo una vez por API y guardarlo en Dexie.

## Flujo de escritura (mutación offline)

1. El repositorio escribe en Dexie con `pendiente: true`.
2. Encola una operación en `outbox` (`entityType`, `operation`, `payload`, `baseVersion`).
3. Llama a `sincronizarPronto()`.
4. El motor **push** (`POST /api/Sync/aplicar`), recibe resultados por operación.
5. Si `aplicado`: actualiza `serverId`/`version` local y borra la op del outbox.
6. Si `rechazado` (LWW): marca no pendiente y el próximo pull trae el estado del servidor.

## Identificadores

- **`clientId`**: GUID estable (generado en el cliente para altas offline o asignado por el servidor).
- **`serverId`**: entero autoincremental del backend (`id` en DTOs).
- La UI navega con ids de servidor cuando existen; offline usa `clientId`.

## Resolución de conflictos

**Last-write-wins** en el servidor: cada push lleva `clientTimestamp` y `baseVersion`. Si el servidor tiene una versión más nueva concurrente, rechaza la op y devuelve el estado actual.

## Indicador global de sync

Componente `src/components/indicador-sync.tsx`, visible en todas las pantallas autenticadas (`encuadre.tsx`):

| Estado visual | Significado |
|---------------|-------------|
| Punto verde — «Sincronizado» | Outbox vacío, al día con el servidor |
| Punto ámbar + número | Hay N operaciones pendientes de subir |
| «Sin conexión» | Offline; los cambios quedan en local |
| «Sincronizando…» | Push/pull en curso |
| «Error al sincronizar» | Falló el último ciclo (401, red, etc.) |

**Tap en el indicador** (con conexión): fuerza un ciclo completo push + pull (equivalente a «refrescar sync»).

## Qué funciona offline

| Funcionalidad | Offline |
|---------------|---------|
| Ver carpetas / escritos / papelera / modo lectura | Sí (Dexie) |
| Crear/editar/borrar escritos | Sí (outbox) |
| Crear/editar/borrar carpetas, criterio de orden | Sí |
| Objetivos del día, tracker de hábitos | Sí |
| Búsqueda de escritos | Sí (índice local) |
| Autoguardado de escritos | Sí |

## Qué requiere conexión (solo online)

| Funcionalidad | Comportamiento offline |
|---------------|------------------------|
| Mover escrito entre carpetas | Toast; no abre el modal |
| Reordenar carpetas (drag) | Sin handles de arrastre |
| Administrar hábitos (CRUD) | Banner + botones deshabilitados |
| Histórico de objetivos / resumen semanal | API directa |
| Login inicial | Requiere red |

## PWA y performance

- El **precache** del service worker incluye solo el app shell (~700–900 KiB).
- Chunks lazy (editor, sync-engine, búsqueda…) **no** están en precache inicial.
- Reglas en `.cursor/rules/pwa-performance.mdc` y chequeo `yarn build:ci`.

## Tests relevantes

- `src/sync/outbox.test.ts` — compactación del outbox
- `src/sync/lecturas-core.test.ts` — reconstrucción de DTOs y búsqueda
- `src/sync/busqueda-core.test.ts` — búsqueda offline
- `src/components/indicador-sync.test.tsx` — indicador global
- `src/pantallas/escritos/usar-autoguardado.test.tsx` — autoguardado

## Documentación relacionada

- Backend sync: [noctiluca-be/docs/modo-offline.md](../../noctiluca-be/docs/modo-offline.md)
- Contexto general del monorepo: [docs/CONTEXTO-NOCTILUCA.md](../../docs/CONTEXTO-NOCTILUCA.md)
