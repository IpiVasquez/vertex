namespace Request {
  export interface Login {
    email?: string;
    password?: string;
    token?: string;
  }

  export interface Register {
    email?: string;
    password?: string;
    name?: string;
    token?: string;
  }
}
