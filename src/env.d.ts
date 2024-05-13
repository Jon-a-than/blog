/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ViewTransition {
  ready: Promise<void>
}
interface Document {
  startViewTransition: (callback: () => void) => ViewTransition
}
