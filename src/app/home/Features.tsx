"use client";
import Image from "next/image";
import featureFreeSrc from "public/assets/feature-free.svg";
import featureUSSrc from "public/assets/feature-us.svg";
import featurePrivacySrc from "public/assets/feature-privacy.svg";
import featureOpenSourceSrc from "public/assets/feature-open-source.svg";
import { Link } from "components/documentation";
import { useTranslation } from "lib/i18n";

export const Features = () => {
  const { t } = useTranslation();

  const FEATURES = [
    {
      src: featureFreeSrc,
      title: t.features.freeTitle,
      text: t.features.freeText,
    },
    {
      src: featureUSSrc,
      title: t.features.usBestPracticesTitle,
      text: t.features.usBestPracticesText,
    },
    {
      src: featurePrivacySrc,
      title: t.features.privacyTitle,
      text: t.features.privacyText,
    },
    {
      src: featureOpenSourceSrc,
      title: t.features.openSourceTitle,
      text: (
        <>
          {t.features.openSourceText}{" "}
          <Link href="https://github.com/xitanggg/open-resume">
            {t.features.githubRepo}
          </Link>
        </>
      ),
    },
  ];

  return (
    <section className="py-16 lg:py-36">
      <div className="mx-auto lg:max-w-4xl">
        <dl className="grid grid-cols-1 justify-items-center gap-y-8 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-16">
          {FEATURES.map(({ src, title, text }) => (
            <div className="px-2" key={title}>
              <div className="relative w-96 self-center pl-16">
                <dt className="text-2xl font-bold">
                  <Image
                    src={src}
                    className="absolute left-0 top-1 h-12 w-12"
                    alt="Feature icon"
                  />
                  {title}
                </dt>
                <dd className="mt-2">{text}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
