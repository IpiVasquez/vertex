declare namespace Model {
  abstract class User {
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
    password: string;
    // Methods
    checkPassword: (pswd: string) => Promise<boolean>;
    tokenize: () => string;
  }
}
