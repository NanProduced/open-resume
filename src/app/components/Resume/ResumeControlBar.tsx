"use client";
import { useEffect } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowsPointingOutIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { useAppSelector, useAppDispatch } from "lib/redux/hooks";
import {
  selectLayoutOverrides,
  resetLayoutOverrides,
  selectFineTuneMode,
  toggleFineTuneMode,
} from "lib/redux/settingsSlice";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const dispatch = useAppDispatch();
  const fineTuneMode = useAppSelector(selectFineTuneMode);
  const layoutOverrides = useAppSelector(selectLayoutOverrides);

  const [instance, update] = usePDF({ document });

  const hasOverrides = Object.keys(layoutOverrides).length > 0;

  useEffect(() => {
    update();
  }, [update, document]);

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-center px-[var(--resume-padding)] text-gray-600 lg:justify-between">
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
        />
        <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden items-center gap-1 lg:flex">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none">Autoscale</span>
        </label>
      </div>
      <div className="flex items-center gap-2">
        {hasOverrides && (
          <button
            type="button"
            onClick={() => dispatch(resetLayoutOverrides())}
            className="flex items-center gap-1 rounded-md border border-orange-300 bg-orange-50 px-3 py-0.5 text-xs font-medium text-orange-700 hover:bg-orange-100"
            title="Reset all layout overrides"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Reset Layout</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => dispatch(toggleFineTuneMode())}
          className={`flex items-center gap-1 rounded-md border px-3 py-0.5 text-xs font-medium transition-colors ${
            fineTuneMode
              ? "border-sky-500 bg-sky-500 text-white hover:bg-sky-600"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
          }`}
          title="Toggle layout fine-tune mode"
        >
          <ArrowsPointingOutIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{fineTuneMode ? "Editing" : "Fine-Tune"}</span>
        </button>
        <a
          className="ml-1 flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100 lg:ml-0"
          href={instance.url!}
          download={fileName}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap hidden sm:inline">Download Resume</span>
          <span className="whitespace-nowrap sm:hidden">Download</span>
        </a>
      </div>
    </div>
  );
};

export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
