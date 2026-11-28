import { z } from "zod";

const text = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, min <= 1 ? `${label} is required` : `${label} needs at least ${min} characters`)
    .max(max, `${label} must be ${max} characters or fewer`);

const optional = (label: string, max: number) =>
  z.string().trim().max(max, `${label} must be ${max} characters or fewer`);

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Pick a month");

const yearText = z
  .string()
  .trim()
  .refine((value) => value === "" || /^(19[5-9]\d|20\d\d)$/.test(value), "Enter a year like 2016");

export const personalSchema = z.object({
  first_name: text("First name", 2, 60),
  last_name: text("Last name", 2, 60),
  phone_no: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{10,17}$/, "Enter a valid phone number"),
  state: z.string().min(1, "Choose your state"),
  city: text("City", 2, 80),
});

export const headlineSchema = z.object({
  headline: text("Headline", 5, 90),
  summary: optional("Summary", 1200),
  target_roles: z.array(z.string()).min(1, "Add at least one target role").max(5, "Add no more than 5 roles"),
});

export const experienceSchema = z
  .object({
    has_no_experience: z.boolean(),
    experiences: z.array(
      z
        .object({
          title: text("Job title", 2, 80),
          employer: text("Employer", 2, 100),
          location: optional("Location", 80),
          started_at: month,
          ended_at: z.string(),
          is_current: z.boolean(),
          achievements: optional("Achievements", 1500),
        })
        .refine((entry) => entry.is_current || /^\d{4}-\d{2}$/.test(entry.ended_at), {
          message: "Add an end date or tick “I work here now”",
          path: ["ended_at"],
        })
        .refine((entry) => entry.is_current || !entry.ended_at || entry.ended_at >= entry.started_at, {
          message: "The end date is before the start date",
          path: ["ended_at"],
        }),
    ),
  })
  .refine((data) => data.has_no_experience || data.experiences.length > 0, {
    message: "Add a role, or tick that you have no work experience yet",
    path: ["experiences"],
  });

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        institution: text("Institution", 2, 120),
        qualification: text("Qualification", 2, 80),
        field_of_study: optional("Field of study", 100),
        grade: optional("Grade", 40),
        start_year: yearText,
        end_year: yearText,
      }),
    )
    .min(1, "Add at least one qualification"),
  certifications: z.array(
    z.object({ name: text("Certification", 2, 120), issuer: optional("Issuer", 120), year: yearText }),
  ),
});

export const skillsSchema = z.object({
  skills: z.array(z.string()).min(3, "Add at least 3 skills").max(30, "Add no more than 30 skills"),
  languages: z
    .array(z.object({ name: text("Language", 2, 40), level: z.enum(["BASIC", "CONVERSATIONAL", "FLUENT", "NATIVE"]) }))
    .min(1, "Add at least one language"),
});

const naira = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine((value) => /^\d+$/.test(value.replace(/[,\s]/g, "")), `${label} must be a whole number`);

export const preferencesSchema = z
  .object({
    job_types: z
      .array(z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]))
      .min(1, "Choose at least one job type"),
    work_modes: z.array(z.enum(["ONSITE", "HYBRID", "REMOTE"])).min(1, "Choose at least one way of working"),
    salary_min: naira("Minimum salary"),
    salary_max: naira("Maximum salary"),
    availability: z.string().min(1, "Choose when you can start"),
    open_to_relocate: z.boolean(),
  })
  .refine((data) => Number(data.salary_max.replace(/\D/g, "")) >= Number(data.salary_min.replace(/\D/g, "")), {
    message: "The maximum is below the minimum",
    path: ["salary_max"],
  });

export const privacySchema = z.object({
  hidden_companies: z.array(z.string()).max(25, "Hide no more than 25 companies"),
});

export type PersonalValues = z.infer<typeof personalSchema>;
export type HeadlineValues = z.infer<typeof headlineSchema>;
export type ExperienceValues = z.infer<typeof experienceSchema>;
export type EducationValues = z.infer<typeof educationSchema>;
export type SkillsValues = z.infer<typeof skillsSchema>;
export type PreferencesValues = z.infer<typeof preferencesSchema>;
export type PrivacyValues = z.infer<typeof privacySchema>;

export const toNumber = (value: string) => Number(value.replace(/\D/g, ""));
export const toOptionalYear = (value: string) => (value ? Number(value) : undefined);
