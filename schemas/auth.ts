import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email address"));

// Mirrors the server rule and the sign-up hint: 8+ characters with a letter and a number.
export const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(72, "Password must be at most 72 characters long")
  .regex(/[A-Za-z]/, "Password must include at least one letter")
  .regex(/\d/, "Password must include at least one number");

const phone = z
  .string()
  .trim()
  .regex(/^\+?\d[\d\s-]{6,18}\d$/, "Enter a valid phone number");

const acceptedTerms = z.boolean().refine((value) => value, "You must accept the Terms and Privacy Policy");

export const candidateSignupSchema = z.object({
  role: z.literal("CANDIDATE"),
  first_name: z.string().trim().min(1, "First name is required").max(80),
  last_name: z.string().trim().min(1, "Last name is required").max(80),
  email,
  password: passwordField,
  accepted_terms: acceptedTerms,
});

export const clientSignupSchema = z.object({
  role: z.literal("CLIENT"),
  company_name: z.string().trim().min(2, "Company name is required").max(120),
  contact_name: z.string().trim().min(2, "Your name is required").max(120),
  phone_no: phone,
  email,
  password: passwordField,
  accepted_terms: acceptedTerms,
});

export const signinSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
  remember: z.boolean(),
});

export const emailOnlySchema = z.object({ email });

export const changeEmailSchema = z.object({
  new_email: email,
  password: z.string().min(1, "Enter your password to confirm"),
});

export const resetPasswordSchema = z
  .object({ password: passwordField, confirm_password: z.string().min(1, "Repeat your new password") })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const companyDetailsSchema = z.object({
  company_name: z.string().trim().min(2, "Company name is required").max(120),
  contact_name: z.string().trim().min(2, "Your name is required").max(120),
  phone_no: phone,
});

export type CandidateSignupValues = z.infer<typeof candidateSignupSchema>;
export type ClientSignupValues = z.infer<typeof clientSignupSchema>;
export type SigninValues = z.infer<typeof signinSchema>;
export type EmailOnlyValues = z.infer<typeof emailOnlySchema>;
export type ChangeEmailValues = z.infer<typeof changeEmailSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type CompanyDetailsValues = z.infer<typeof companyDetailsSchema>;
