declare namespace Auth {
  interface LoginRequest {
    email: string;
    password: string;
  }

  interface LoginResponse {
    token: string;
  }

  interface RegisterRequest {
    email: string;
    password: string;
    name: string;
  }
}
