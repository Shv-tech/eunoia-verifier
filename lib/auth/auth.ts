export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}

export function authorize(
  user: User,
  required: User["role"]
): boolean {
  return user.role === required;
}
