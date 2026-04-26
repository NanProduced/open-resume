"use client";
import { BaseForm } from "components/ResumeForm/Form";
import { Input, Textarea } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectProfile } from "lib/redux/resumeSlice";
import { ResumeProfile } from "lib/redux/types";
import { useTranslation } from "lib/i18n";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const { name, email, phone, url, summary, location } = profile;
  const { t } = useTranslation();

  const handleProfileChange = (field: keyof ResumeProfile, value: string) => {
    dispatch(changeProfile({ field, value }));
  };

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label={t.resumeForm.profile.name}
          labelClassName="col-span-full"
          name="name"
          placeholder={t.resumeForm.profile.namePlaceholder}
          value={name}
          onChange={handleProfileChange}
        />
        <Textarea
          label={t.resumeForm.profile.objective}
          labelClassName="col-span-full"
          name="summary"
          placeholder={t.resumeForm.profile.objectivePlaceholder}
          value={summary}
          onChange={handleProfileChange}
        />
        <Input
          label={t.resumeForm.profile.email}
          labelClassName="col-span-4"
          name="email"
          placeholder={t.resumeForm.profile.emailPlaceholder}
          value={email}
          onChange={handleProfileChange}
        />
        <Input
          label={t.resumeForm.profile.phone}
          labelClassName="col-span-2"
          name="phone"
          placeholder={t.resumeForm.profile.phonePlaceholder}
          value={phone}
          onChange={handleProfileChange}
        />
        <Input
          label={t.resumeForm.profile.website}
          labelClassName="col-span-4"
          name="url"
          placeholder={t.resumeForm.profile.websitePlaceholder}
          value={url}
          onChange={handleProfileChange}
        />
        <Input
          label={t.resumeForm.profile.location}
          labelClassName="col-span-2"
          name="location"
          placeholder={t.resumeForm.profile.locationPlaceholder}
          value={location}
          onChange={handleProfileChange}
        />
      </div>
    </BaseForm>
  );
};
