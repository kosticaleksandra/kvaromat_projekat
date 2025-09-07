export type AuthForm = {
  username?: string;
  password?: string;
};

export type AuthValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

export function validacijaPodatakaAuth(data: AuthForm): AuthValidationResult {
  const errors: Record<string, string> = {};

  const user = (data.username ?? "").trim();
  const pass = (data.password ?? "").trim();

  if (!user) errors.username = "Korisničko ime je obavezno.";
  if (!pass) errors.password = "Lozinka je obavezna.";

  return { isValid: Object.keys(errors).length === 0, errors };
}
