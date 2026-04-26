"use client";
import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, type RootState, type AppDispatch } from "lib/redux/store";
import type { Snapshot, SectionDiff, ArrayItemDiff, TextDiff } from "lib/history";
import {
  useInitializeHistory,
  selectSnapshots,
  selectSelectedSnapshotIds,
  selectDiff,
  selectHistoryConfig,
  selectHistoryLoading,
  fetchSnapshots,
  fetchConfig,
  computeDiff,
  selectSnapshotForDiff,
  clearDiff,
  setTag,
  removeSnapshot,
  updateConfig,
} from "lib/history";
import { useRestoreSnapshot } from "lib/history/hooks";
import { cx } from "lib/cx";

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
};

const DiffLine = ({ diff }: { diff: TextDiff }) => {
  const bgColor = {
    added: "bg-green-50 text-green-800",
    removed: "bg-red-50 text-red-800",
    unchanged: "bg-gray-50 text-gray-700",
    modified: "bg-yellow-50 text-yellow-800",
    reordered: "bg-blue-50 text-blue-800",
  }[diff.type];

  const prefix = {
    added: "+",
    removed: "-",
    unchanged: " ",
    modified: "~",
    reordered: "↕",
  }[diff.type];

  return (
    <div className={cx("font-mono text-xs py-0.5 px-2 border-l-2", bgColor, {
      "border-green-500": diff.type === "added",
      "border-red-500": diff.type === "removed",
      "border-gray-300": diff.type === "unchanged",
      "border-yellow-500": diff.type === "modified",
      "border-blue-500": diff.type === "reordered",
    })}>
      <span className="mr-2 select-none opacity-50">{prefix}</span>
      <span>{diff.value || " "}</span>
    </div>
  );
};

const SectionDiffView = ({ section }: { section: SectionDiff }) => {
  const [expanded, setExpanded] = useState(true);

  const sectionNames: Record<string, string> = {
    profile: "Profile",
    workExperiences: "Work Experience",
    educations: "Education",
    projects: "Projects",
    skills: "Skills",
    custom: "Custom",
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-gray-800">
          {sectionNames[section.section] || section.section}
        </span>
        <span className="text-gray-500">
          {expanded ? "▲" : "▼"}
        </span>
      </button>
      {expanded && (
        <div className="p-4">
          {section.type === "text" && (
            <div className="space-y-0.5">
              {(section.diffs as TextDiff[]).map((diff, idx) => (
                <DiffLine key={idx} diff={diff} />
              ))}
            </div>
          )}
          {section.type === "array" && (
            <div className="space-y-4">
              {(section.diffs as ArrayItemDiff<any>[]).map((item, idx) => (
                <ArrayItemDiffView key={idx} item={item} index={idx} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ArrayItemDiffView = ({
  item,
  index,
}: {
  item: ArrayItemDiff<any>;
  index: number;
}) => {
  const [expanded, setExpanded] = useState(true);

  const typeLabel = {
    added: "Added",
    removed: "Removed",
    modified: "Modified",
    unchanged: "Unchanged",
    reordered: "Reordered",
  }[item.type];

  const typeColor = {
    added: "text-green-700 bg-green-50",
    removed: "text-red-700 bg-red-50",
    modified: "text-yellow-700 bg-yellow-50",
    unchanged: "text-gray-700 bg-gray-50",
    reordered: "text-blue-700 bg-blue-50",
  }[item.type];

  const displayLabel = item.newValue?.company || item.newValue?.school || 
    item.newValue?.project || item.newValue?.skill || 
    item.oldValue?.company || item.oldValue?.school || 
    item.oldValue?.project || item.oldValue?.skill || 
    `Item ${index + 1}`;

  return (
    <div className={cx("border rounded-lg overflow-hidden", {
      "border-green-200": item.type === "added",
      "border-red-200": item.type === "removed",
      "border-yellow-200": item.type === "modified",
      "border-gray-200": item.type === "unchanged",
      "border-blue-200": item.type === "reordered",
    })}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={cx("w-full flex items-center justify-between px-3 py-2", typeColor)}
      >
        <div className="flex items-center gap-2">
          <span className={cx("text-xs font-medium px-2 py-0.5 rounded", {
            "bg-green-200": item.type === "added",
            "bg-red-200": item.type === "removed",
            "bg-yellow-200": item.type === "modified",
            "bg-gray-200": item.type === "unchanged",
            "bg-blue-200": item.type === "reordered",
          })}>
            {typeLabel}
          </span>
          <span className="font-medium">{displayLabel}</span>
          {item.type === "reordered" && (
            <span className="text-xs opacity-75">
              (pos {item.oldIndex} → {item.newIndex})
            </span>
          )}
        </div>
        <span className="text-sm opacity-75">{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && item.fieldDiffs && (
        <div className="p-3 space-y-3">
          {Object.entries(item.fieldDiffs).map(([field, diffs]) => (
            <div key={field}>
              <div className="text-xs font-medium text-gray-500 mb-1 uppercase">
                {field}
              </div>
              <div className="space-y-0.5">
                {diffs.map((diff, idx) => (
                  <DiffLine key={idx} diff={diff} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DiffViewer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedIds = useSelector(selectSelectedSnapshotIds);
  const diff = useSelector(selectDiff);
  const loading = useSelector(selectHistoryLoading);
  const snapshots = useSelector(selectSnapshots);

  const [oldId, newId] = selectedIds;
  const oldSnapshot = snapshots.find((s) => s.id === oldId);
  const newSnapshot = snapshots.find((s) => s.id === newId);

  const handleComputeDiff = () => {
    if (oldId && newId) {
      dispatch(computeDiff({ oldId, newId }));
    }
  };

  const handleClear = () => {
    dispatch(clearDiff());
    dispatch(selectSnapshotForDiff({ position: 0, id: null }));
    dispatch(selectSnapshotForDiff({ position: 1, id: null }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Version Comparison</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Old Version
          </label>
          <select
            value={oldId || ""}
            onChange={(e) =>
              dispatch(
                selectSnapshotForDiff({ position: 0, id: e.target.value || null })
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="">Select version...</option>
            {snapshots.map((s) => (
              <option key={s.id} value={s.id}>
                {formatDate(s.timestamp)}
                {s.tag ? ` (${s.tag})` : ""}
                {s.isAutoGenerated ? " [Auto]" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            New Version
          </label>
          <select
            value={newId || ""}
            onChange={(e) =>
              dispatch(
                selectSnapshotForDiff({ position: 1, id: e.target.value || null })
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="">Select version...</option>
            {snapshots.map((s) => (
              <option key={s.id} value={s.id}>
                {formatDate(s.timestamp)}
                {s.tag ? ` (${s.tag})` : ""}
                {s.isAutoGenerated ? " [Auto]" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleComputeDiff}
          disabled={!oldId || !newId || loading}
          className="px-4 py-2 bg-sky-500 text-white rounded-md text-sm font-medium hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Computing..." : "Compare"}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Clear
        </button>
      </div>

      {oldSnapshot && newSnapshot && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm">
          <div className="flex justify-between text-gray-600">
            <span>
              <strong>Old:</strong> {formatDate(oldSnapshot.timestamp)}
              {oldSnapshot.tag && ` (${oldSnapshot.tag})`}
            </span>
            <span>
              <strong>New:</strong> {formatDate(newSnapshot.timestamp)}
              {newSnapshot.tag && ` (${newSnapshot.tag})`}
            </span>
          </div>
        </div>
      )}

      {diff && (
        <div>
          {diff.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No changes detected between these versions.
            </div>
          ) : (
            <div>
              <div className="mb-4 text-sm text-gray-600">
                <strong>{diff.length}</strong> section(s) have changes
              </div>
              {diff.map((section, idx) => (
                <SectionDiffView key={idx} section={section} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TimelineItem = ({
  snapshot,
  isSelected,
  onSelect,
  onRestore,
  onTag,
  onDelete,
}: {
  snapshot: Snapshot;
  isSelected: boolean;
  onSelect: () => void;
  onRestore: () => void;
  onTag: (tag: string | null) => void;
  onDelete: () => void;
}) => {
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [tagInput, setTagInput] = useState(snapshot.tag || "");
  const [showActions, setShowActions] = useState(false);

  const handleSaveTag = () => {
    onTag(tagInput.trim() || null);
    setIsEditingTag(false);
  };

  return (
    <div
      className={cx(
        "relative pl-8 pb-6 border-l-2 cursor-pointer transition-colors",
        isSelected
          ? "border-sky-400 bg-sky-50"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      )}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={cx(
          "absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-1/2 border-2",
          isSelected
            ? "bg-sky-400 border-sky-500"
            : snapshot.isAutoGenerated
            ? "bg-gray-300 border-gray-400"
            : "bg-white border-gray-400"
        )}
      />

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-800">
              {formatDate(snapshot.timestamp)}
            </span>
            <span className="text-xs text-gray-500">
              {formatRelativeTime(snapshot.timestamp)}
            </span>
            {snapshot.isAutoGenerated && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                Auto
              </span>
            )}
            {!snapshot.isAutoGenerated && snapshot.tag !== "before-restore" && (
              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                Manual
              </span>
            )}
            {snapshot.tag === "before-restore" && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                Before Restore
              </span>
            )}
          </div>

          {isEditingTag ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-400"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveTag();
                }}
                className="px-2 py-1 text-xs bg-sky-500 text-white rounded hover:bg-sky-600"
              >
                Save
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTag(false);
                  setTagInput(snapshot.tag || "");
                }}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          ) : snapshot.tag ? (
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
              {snapshot.tag}
            </span>
          ) : null}
        </div>

        {showActions && (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            {!isEditingTag && (
              <button
                onClick={() => setIsEditingTag(true)}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
              >
                Tag
              </button>
            )}
            <button
              onClick={onRestore}
              className="px-2 py-1 text-xs bg-sky-500 text-white rounded hover:bg-sky-600"
            >
              Restore
            </button>
            <button
              onClick={onDelete}
              className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Timeline = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const snapshots = useSelector(selectSnapshots);
  const restore = useRestoreSnapshot();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleRestore = async (snapshot: Snapshot) => {
    if (window.confirm("Are you sure you want to restore this version? A snapshot of your current state will be saved first.")) {
      const success = await restore(snapshot.id, snapshot.resumeId);
      if (success) {
        alert("Version restored successfully!");
        router.push("/resume-builder");
      } else {
        alert("Failed to restore version.");
      }
    }
  };

  const handleTag = (snapshot: Snapshot, tag: string | null) => {
    dispatch(setTag({ id: snapshot.id, tag }));
  };

  const handleDelete = (snapshot: Snapshot) => {
    if (window.confirm("Are you sure you want to delete this snapshot?")) {
      dispatch(removeSnapshot(snapshot.id));
      if (selectedId === snapshot.id) {
        setSelectedId(null);
      }
    }
  };

  if (snapshots.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No snapshots yet. Start editing your resume to create automatic snapshots.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Version History ({snapshots.length} snapshots)
      </h3>
      <div className="ml-2">
        {snapshots.map((snapshot) => (
          <TimelineItem
            key={snapshot.id}
            snapshot={snapshot}
            isSelected={selectedId === snapshot.id}
            onSelect={() => setSelectedId(selectedId === snapshot.id ? null : snapshot.id)}
            onRestore={() => handleRestore(snapshot)}
            onTag={(tag) => handleTag(snapshot, tag)}
            onDelete={() => handleDelete(snapshot)}
          />
        ))}
      </div>
    </div>
  );
};

const HistorySettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const config = useSelector(selectHistoryConfig);
  const [maxSnapshots, setMaxSnapshots] = useState(config.maxSnapshots);
  const [debounceMs, setDebounceMs] = useState(config.debounceMs);

  useEffect(() => {
    setMaxSnapshots(config.maxSnapshots);
    setDebounceMs(config.debounceMs);
  }, [config.maxSnapshots, config.debounceMs]);

  const handleSave = () => {
    dispatch(
      updateConfig({
        resumeId: config.resumeId,
        maxSnapshots,
        debounceMs,
      })
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">History Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Max Snapshots to Keep
          </label>
          <input
            type="number"
            value={maxSnapshots}
            onChange={(e) => setMaxSnapshots(parseInt(e.target.value) || 10)}
            min={1}
            max={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            Oldest snapshots will be deleted when this limit is reached (LRU policy).
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Auto-snapshot Delay (ms)
          </label>
          <input
            type="number"
            value={debounceMs}
            onChange={(e) => setDebounceMs(parseInt(e.target.value) || 500)}
            min={100}
            max={10000}
            step={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            How long to wait after you stop typing before creating a snapshot.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-sky-500 text-white rounded-md text-sm font-medium hover:bg-sky-600 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

const HistoryPageContent = () => {
  const params = useParams();
  const resumeId = (params?.resumeId as string) || "default";
  const [activeTab, setActiveTab] = useState<"timeline" | "compare" | "settings">("timeline");

  useInitializeHistory(resumeId);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Version History</h1>
            <p className="text-gray-500 text-sm mt-1">
              Resume ID: {resumeId}
            </p>
          </div>
          <Link
            href="/resume-builder"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            ← Back to Editor
          </Link>
        </div>

        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {[
            { id: "timeline", label: "Timeline" },
            { id: "compare", label: "Compare" },
            { id: "settings", label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cx(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "timeline" && <Timeline />}
        {activeTab === "compare" && <DiffViewer />}
        {activeTab === "settings" && <HistorySettings />}
      </div>
    </main>
  );
};

export default function HistoryPage() {
  return (
    <Provider store={store}>
      <HistoryPageContent />
    </Provider>
  );
}
