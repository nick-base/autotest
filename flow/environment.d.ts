declare namespace NodeJS {
  export interface ProcessEnv {
    readonly REDIS_URL: string;
    readonly MONGODB_URI: string;
  }
}
