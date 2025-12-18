
// Fix: Use interface augmentation for the global NodeJS namespace to define environment variable types.
// This avoids redeclaring 'process' as a variable, which causes conflicts with existing type definitions in the environment.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
