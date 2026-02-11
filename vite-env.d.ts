/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  // add other env variables here as you create them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}