import {
  AVAILABILITY_LABELS,
  formatNaira,
  JOB_TYPE_LABELS,
  LANGUAGE_LEVEL_LABELS,
  WORK_MODE_LABELS,
} from "@/lib/onboarding";
import type { OwnProfile } from "@/types/candidate";

const month = (value: string | null) =>
  value ? new Date(`${value}-01T00:00:00`).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "";

const Section = function ({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="text-primary mt-6 mb-2 border-b pb-1 text-[11px] font-bold tracking-[0.12em] uppercase">
        {title}
      </h4>
      {children}
    </section>
  );
};

export const ProfilePaper = function ({ profile }: { profile: OwnProfile }) {
  const { personal, headline, experience, education, skills, preferences, privacy } = profile;

  return (
    <article className="mx-auto max-w-160 rounded-md bg-white px-6 py-8 text-[13px] leading-relaxed text-slate-800 shadow-[0_2px_6px_rgba(15,23,42,.08),0_20px_40px_-20px_rgba(15,23,42,.25)] sm:px-12 sm:py-11">
      <h2 className="text-[22px] font-extrabold tracking-tight">
        {[personal.first_name, personal.last_name].filter(Boolean).join(" ")}
      </h2>
      <p className="text-muted-foreground">
        {[
          headline.headline,
          [personal.city, personal.state].filter(Boolean).join(", "),
          personal.email,
          personal.phone_no,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>

      {headline.summary && (
        <Section title="Summary">
          <p className="whitespace-pre-line">{headline.summary}</p>
        </Section>
      )}
      <Section title="Target roles">
        <p>{headline.target_roles.join(", ")}</p>
      </Section>

      <Section title="Experience">
        {experience.has_no_experience ? (
          <p className="text-muted-foreground">No work experience yet.</p>
        ) : (
          experience.experiences.map((entry) => (
            <div key={entry.id} className="mt-2.5 first:mt-0">
              <p className="flex flex-wrap justify-between gap-x-3 font-bold">
                <span>
                  {entry.title}, {entry.employer}
                </span>
                <span className="font-semibold text-slate-500">
                  {month(entry.started_at)} – {entry.is_current ? "present" : month(entry.ended_at)}
                </span>
              </p>
              {entry.location && <p className="text-muted-foreground">{entry.location}</p>}
              {entry.achievements && <p className="mt-1 whitespace-pre-line">{entry.achievements}</p>}
            </div>
          ))
        )}
      </Section>

      <Section title="Education">
        {education.educations.map((entry) => (
          <p key={entry.id}>
            <b>
              {entry.qualification}
              {entry.field_of_study ? ` ${entry.field_of_study}` : ""}
            </b>
            , {entry.institution}
            {entry.grade ? ` · ${entry.grade}` : ""}
            {entry.end_year ? ` · ${entry.start_year ? `${entry.start_year}–` : ""}${entry.end_year}` : ""}
          </p>
        ))}
        {education.certifications.map((entry) => (
          <p key={entry.id}>
            {entry.name}
            {entry.issuer ? `, ${entry.issuer}` : ""}
            {entry.year ? ` · ${entry.year}` : ""}
          </p>
        ))}
      </Section>

      <Section title="Skills and languages">
        <p>{skills.skills.join(" · ")}</p>
        <p className="text-muted-foreground">
          {skills.languages.map((entry) => `${entry.name} (${LANGUAGE_LEVEL_LABELS[entry.level]})`).join(", ")}
        </p>
      </Section>

      <Section title="Preferences">
        <p>
          {[
            preferences.job_types.map((value) => JOB_TYPE_LABELS[value]).join(", "),
            preferences.work_modes.map((value) => WORK_MODE_LABELS[value]).join(", "),
            preferences.salary_min !== null &&
              `${formatNaira(preferences.salary_min)}–${formatNaira(preferences.salary_max ?? 0)} a month`,
            preferences.availability && `Starts ${AVAILABILITY_LABELS[preferences.availability].toLowerCase()}`,
            preferences.open_to_relocate && "Will relocate",
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {!!privacy.hidden_companies.length && (
          <p className="text-muted-foreground">
            Hidden from {privacy.hidden_companies.map((entry) => entry.name).join(", ")}
          </p>
        )}
      </Section>
    </article>
  );
};
