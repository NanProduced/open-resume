"use client";
import { Fragment } from "react";
import type { Resume } from "lib/redux/types";
import { initialEducation, initialWorkExperience } from "lib/redux/resumeSlice";
import { deepClone } from "lib/deep-clone";
import { cx } from "lib/cx";
import { useTranslation } from "lib/i18n";

const TableRowHeader = ({ children }: { children: React.ReactNode }) => (
  <tr className="divide-x bg-gray-50">
    <th className="px-3 py-2 font-semibold" scope="colgroup" colSpan={2}>
      {children}
    </th>
  </tr>
);

const TableRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string | string[];
  className?: string | false;
}) => (
  <tr className={cx("divide-x", className)}>
    <th className="px-3 py-2 font-medium" scope="row">
      {label}
    </th>
    <td className="w-full px-3 py-2">
      {typeof value === "string"
        ? value
        : value.map((x, idx) => (
            <Fragment key={idx}>
              • {x}
              <br />
            </Fragment>
          ))}
    </td>
  </tr>
);

export const ResumeTable = ({ resume }: { resume: Resume }) => {
  const educations =
    resume.educations.length === 0
      ? [deepClone(initialEducation)]
      : resume.educations;
  const workExperiences =
    resume.workExperiences.length === 0
      ? [deepClone(initialWorkExperience)]
      : resume.workExperiences;
  const skills = [...resume.skills.descriptions];
  const featuredSkills = resume.skills.featuredSkills
    .filter((item) => item.skill.trim())
    .map((item) => item.skill)
    .join(", ")
    .trim();
  if (featuredSkills) {
    skills.unshift(featuredSkills);
  }
  const { t } = useTranslation();

  return (
    <table className="mt-2 w-full border text-sm text-gray-900">
      <tbody className="divide-y text-left align-top">
        <TableRowHeader>{t.parserTable.profile}</TableRowHeader>
        <TableRow label={t.parserTable.name} value={resume.profile.name} />
        <TableRow label={t.parserTable.email} value={resume.profile.email} />
        <TableRow label={t.parserTable.phone} value={resume.profile.phone} />
        <TableRow label={t.parserTable.location} value={resume.profile.location} />
        <TableRow label={t.parserTable.link} value={resume.profile.url} />
        <TableRow label={t.parserTable.summary} value={resume.profile.summary} />
        <TableRowHeader>{t.parserTable.education}</TableRowHeader>
        {educations.map((education, idx) => (
          <Fragment key={idx}>
            <TableRow label={t.parserTable.school} value={education.school} />
            <TableRow label={t.parserTable.degree} value={education.degree} />
            <TableRow label={t.parserTable.gpa} value={education.gpa} />
            <TableRow label={t.parserTable.date} value={education.date} />
            <TableRow
              label={t.parserTable.descriptions}
              value={education.descriptions}
              className={
                educations.length - 1 !== 0 &&
                idx !== educations.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        <TableRowHeader>{t.parserTable.workExperience}</TableRowHeader>
        {workExperiences.map((workExperience, idx) => (
          <Fragment key={idx}>
            <TableRow label={t.parserTable.company} value={workExperience.company} />
            <TableRow label={t.parserTable.jobTitle} value={workExperience.jobTitle} />
            <TableRow label={t.parserTable.date} value={workExperience.date} />
            <TableRow
              label={t.parserTable.descriptions}
              value={workExperience.descriptions}
              className={
                workExperiences.length - 1 !== 0 &&
                idx !== workExperiences.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        {resume.projects.length > 0 && (
          <TableRowHeader>{t.parserTable.projects}</TableRowHeader>
        )}
        {resume.projects.map((project, idx) => (
          <Fragment key={idx}>
            <TableRow label={t.parserTable.project} value={project.project} />
            <TableRow label={t.parserTable.date} value={project.date} />
            <TableRow
              label={t.parserTable.descriptions}
              value={project.descriptions}
              className={
                resume.projects.length - 1 !== 0 &&
                idx !== resume.projects.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        <TableRowHeader>{t.parserTable.skills}</TableRowHeader>
        <TableRow label={t.parserTable.descriptions} value={skills} />
      </tbody>
    </table>
  );
};
