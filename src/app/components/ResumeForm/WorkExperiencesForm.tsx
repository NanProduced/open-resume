"use client";
import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeWorkExperiences,
  selectWorkExperiences,
} from "lib/redux/resumeSlice";
import type { ResumeWorkExperience } from "lib/redux/types";
import { useTranslation } from "lib/i18n";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const showDelete = workExperiences.length > 1;

  return (
    <Form form="workExperiences" addButtonText={t.resumeForm.work.addButton}>
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
        ) => {
          dispatch(changeWorkExperiences({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== workExperiences.length - 1;

        return (
          <FormSection
            key={idx}
            form="workExperiences"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText={t.resumeForm.work.deleteTooltip}
          >
            <Input
              label={t.resumeForm.work.company}
              labelClassName="col-span-full"
              name="company"
              placeholder={t.resumeForm.work.companyPlaceholder}
              value={company}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label={t.resumeForm.work.jobTitle}
              labelClassName="col-span-4"
              name="jobTitle"
              placeholder={t.resumeForm.work.jobTitlePlaceholder}
              value={jobTitle}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label={t.resumeForm.work.date}
              labelClassName="col-span-2"
              name="date"
              placeholder={t.resumeForm.work.datePlaceholder}
              value={date}
              onChange={handleWorkExperienceChange}
            />
            <BulletListTextarea
              label={t.resumeForm.work.description}
              labelClassName="col-span-full"
              name="descriptions"
              placeholder={t.resumeForm.work.descriptionPlaceholder}
              value={descriptions}
              onChange={handleWorkExperienceChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
