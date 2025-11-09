// noinspection JSUnusedGlobalSymbols

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_ORIGIN: string;
      EXPO_PUBLIC_DEVELOPMENT: string;

      [key: string]: string | undefined;
    }
  }
}
