"use client";
import { Form, FormSection } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  Input,
} from "components/ResumeForm/Form/InputGroup";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeEducations, selectEducations } from "lib/redux/resumeSlice";
import type { ResumeEducation } from "lib/redux/types";
import {
  changeShowBulletPoints,
  selectShowBulletPoints,
} from "lib/redux/settingsSlice";
import { useTranslation } from "lib/i18n";

export const EducationsForm = () => {
  const educations = useAppSelector(selectEducations);
  const dispatch = useAppDispatch();
  const showDelete = educations.length > 1;
  const form = "educations";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));
  const { t } = useTranslation();

  return (
    <Form form={form} addButtonText={t.resumeForm.education.addButton}>
      {educations.map(({ school, degree, gpa, date, descriptions }, idx) => {
        const handleEducationChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeEducation>
        ) => {
          dispatch(changeEducations({ idx, field, value } as any));
        };

        const handleShowBulletPoints = (value: boolean) => {
          dispatch(changeShowBulletPoints({ field: form, value }));
        };

        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== educations.length - 1;

        return (
          <FormSection
            key={idx}
            form="educations"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText={t.resumeForm.education.deleteTooltip}
          >
            <Input
              label={t.resumeForm.education.school}
              labelClassName="col-span-4"
              name="school"
              placeholder={t.resumeForm.education.schoolPlaceholder}
              value={school}
              onChange={handleEducationChange}
            />
            <Input
              label={t.resumeForm.education.date}
              labelClassName="col-span-2"
              name="date"
              placeholder={t.resumeForm.education.datePlaceholder}
              value={date}
              onChange={handleEducationChange}
            />
            <Input
              label={t.resumeForm.education.degree}
              labelClassName="col-span-4"
              name="degree"
              placeholder={t.resumeForm.education.degreePlaceholder}
              value={degree}
              onChange={handleEducationChange}
            />
            <Input
              label={t.resumeForm.education.gpa}
              labelClassName="col-span-2"
              name="gpa"
              placeholder={t.resumeForm.education.gpaPlaceholder}
              value={gpa}
              onChange={handleEducationChange}
            />
            <div className="relative col-span-full">
              <BulletListTextarea
                label={t.resumeForm.education.additionalInfo}
                labelClassName="col-span-full"
                name="descriptions"
                placeholder={t.resumeForm.education.additionalInfoPlaceholder}
                value={descriptions}
                onChange={handleEducationChange}
                showBulletPoints={showBulletPoints}
              />
              <div className="absolute left-[15.6rem] top-[0.07rem]">
                <BulletListIconButton
                  showBulletPoints={showBulletPoints}
                  onClick={handleShowBulletPoints}
                />
              </div>
            </div>
          </FormSection>
        );
      })}
    </Form>
  );
};
