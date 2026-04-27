"use client";
import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "lib/redux/hooks";
import {
  selectResumes,
  selectCurrentResumeId,
  selectCurrentResume,
  switchResume,
  createResume,
  duplicateResume,
  deleteResume,
  renameResume,
} from "lib/redux/resumeStoreSlice";
import { setResume } from "lib/redux/resumeSlice";
import { setSettings } from "lib/redux/settingsSlice";
import {
  ChevronDownIcon,
  PlusIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

export const ResumeSwitcher = () => {
  const dispatch = useAppDispatch();
  const resumes = useAppSelector(selectResumes);
  const currentResumeId = useAppSelector(selectCurrentResumeId);
  const currentResume = useAppSelector(selectCurrentResume);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setEditingResumeId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (editingResumeId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingResumeId]);

  const handleSwitchResume = (resumeId: string) => {
    const resume = resumes.find((r) => r.id === resumeId);
    if (resume) {
      dispatch(switchResume({ resumeId }));
      dispatch(setResume(resume.resume));
      dispatch(setSettings(resume.settings));
    }
    setIsDropdownOpen(false);
  };

  const handleCreateResume = () => {
    dispatch(createResume({ name: "新简历" }));
    setIsDropdownOpen(false);
  };

  const handleDuplicateResume = (resumeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(duplicateResume({ resumeId }));
  };

  const handleDeleteResume = (resumeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (resumes.length > 1) {
      const remainingResumes = resumes.filter((r) => r.id !== resumeId);
      const nextResume = remainingResumes[0];
      dispatch(deleteResume({ resumeId }));
      if (nextResume) {
        dispatch(setResume(nextResume.resume));
        dispatch(setSettings(nextResume.settings));
      }
    }
  };

  const handleStartRename = (resumeId: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingResumeId(resumeId);
    setEditingName(name);
  };

  const handleSaveRename = () => {
    if (editingResumeId && editingName.trim()) {
      dispatch(renameResume({ resumeId: editingResumeId, newName: editingName.trim() }));
    }
    setEditingResumeId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingResumeId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveRename();
    } else if (e.key === "Escape") {
      setEditingResumeId(null);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100"
      >
        <span className="truncate max-w-[200px]">
          {currentResume?.name || "选择简历"}
        </span>
        <ChevronDownIcon
          className={cx("h-4 w-4 transition-transform", isDropdownOpen && "rotate-180")}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 w-72 rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="max-h-64 overflow-y-auto">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                onClick={() => !editingResumeId && handleSwitchResume(resume.id)}
                className={cx(
                  "flex items-center justify-between px-3 py-2 text-sm cursor-pointer",
                  resume.id === currentResumeId
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {editingResumeId === resume.id ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 rounded border border-gray-300 px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <button
                      type="button"
                      onClick={handleSaveRename}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <CheckIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelRename}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <XMarkIcon className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="truncate flex-1">{resume.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStartRename(resume.id, resume.name, e)}
                        className="p-1 rounded hover:bg-gray-200"
                        title="重命名"
                      >
                        <PencilIcon className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDuplicateResume(resume.id, e)}
                        className="p-1 rounded hover:bg-gray-200"
                        title="复制"
                      >
                        <DocumentDuplicateIcon className="h-4 w-4 text-gray-500" />
                      </button>
                      {resumes.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteResume(resume.id, e)}
                          className="p-1 rounded hover:bg-gray-200"
                          title="删除"
                        >
                          <TrashIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100">
            <button
              type="button"
              onClick={handleCreateResume}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <PlusIcon className="h-4 w-4" />
              <span>新建简历</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};