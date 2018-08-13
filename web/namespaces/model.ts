namespace Model {
  export interface User {
    email: string;
    profile: {
      name: string;
      lastName: string;
      image: string;
    };
    settings: {
      expiry: number;
      locale: string;
    };
  }
}
