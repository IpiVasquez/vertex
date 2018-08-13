namespace Api {
  export interface Config {
    version?: number;
  }
}

declare namespace Core {
  interface Language {
    shortName: string;
    name: string;
    code?: string;
  }
}
