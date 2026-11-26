"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type Category,
  type Group,
} from "@/data/groups";
import { copyText } from "@/lib/clipboard";
import { buildIndex, countByCategory, search } from "@/lib/search";
import GroupRow from "./GroupRow";
import { CloseIcon, InfoIcon, SearchIcon } from "./Icons";
import QrDialog from "./QrDialog";

type Filter = "all" | Category;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "channel", label: "Channel" },
  { value: "community", label: "Community" },
  { value: "state", label: "States" },
  { value: "gurukul", label: "गुरुकुल" },
  { value: "ut", label: "Union territories" },
];

export default function GroupDirectory({ groups }: { groups: Group[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [qrGroup, setQrGroup] = useState<Group | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const copiedTimer = useRef<number | undefined>(undefined);
  const toastTimer = useRef<number | undefined>(undefined);

  const index = useMemo(() => buildIndex(groups), [groups]);
  const matched = useMemo(() => search(index, query), [index, query]);
  const counts = useMemo(() => countByCategory(matched), [matched]);
  const visible = useMemo(
    () => (filter === "all" ? matched : matched.filter((g) => g.category === filter)),
    [matched, filter],
  );
  const sections = CATEGORY_ORDER.map((category) => ({
    category,
    items: visible.filter((g) => g.category === category),
  })).filter((section) => section.items.length > 0);

  const showToast = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 2200);
  }, []);

  const handleCopy = useCallback(
    async (group: Group) => {
      const ok = await copyText(group.link);
      window.clearTimeout(copiedTimer.current);
      if (ok) {
        setCopiedId(group.id);
        copiedTimer.current = window.setTimeout(() => setCopiedId(null), 1800);
        showToast(`Link copied for ${group.name}`);
      } else {
        showToast("Couldn’t copy. Open the QR code or press and hold the link instead.");
      }
    },
    [showToast],
  );

  // "/" jumps to search, like most directory sites
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const typing =
        target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "");
      if (typing) return;
      event.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const groupTotal = groups.filter((g) => g.category !== "channel").length;
  const isFiltering = query.trim() !== "" || filter !== "all";
  const summary = isFiltering
    ? `Showing ${visible.filter((g) => g.category !== "channel").length} of ${groupTotal} groups`
    : `${groupTotal} groups`;

  return (
    <>
      <div className="controls">
        <div className="container">
          <div className="search">
            <SearchIcon className="search-icon" width={20} height={20} />
            <input
              ref={inputRef}
              id="group-search"
              type="search"
              inputMode="search"
              enterKeyHint="search"
              className="search-input"
              placeholder="Search state or code"
              aria-label="Search groups"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape" && query) {
                  event.preventDefault();
                  setQuery("");
                }
              }}
            />
            {query ? (
              <button
                type="button"
                className="search-clear"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                <CloseIcon width={18} height={18} />
              </button>
            ) : (
              <kbd className="search-kbd" aria-hidden="true">
                /
              </kbd>
            )}
          </div>
        </div>
      </div>

      <div className="container filters-wrap">
        <div className="filters" role="group" aria-label="Filter by type">
          {FILTERS.map(({ value, label }) => {
            const count = value === "all" ? matched.length : counts[value];
            return (
              <button
                key={value}
                type="button"
                className="chip"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
                <span className="chip-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="container main" id="groups">
        <div className="meta-row">
          <p className="note">
            <InfoIcon width={16} height={16} />
            <span>
              Join opens the Arattai app, so install it and sign in first. If nothing happens, open
              the QR code and scan it from Arattai.
            </span>
          </p>
          <p className="summary" aria-live="polite">
            {summary}
          </p>
        </div>

        {sections.map(({ category, items }) => (
          <section key={category} className="section" aria-labelledby={`h-${category}`}>
            <h2 id={`h-${category}`} className="section-title">
              {CATEGORY_LABELS[category]}
              <span className="section-count">{items.length}</span>
            </h2>
            <ul className="list">
              {items.map((group) => (
                <GroupRow
                  key={group.id}
                  group={group}
                  copied={copiedId === group.id}
                  onCopy={handleCopy}
                  onShowQr={setQrGroup}
                />
              ))}
            </ul>
          </section>
        ))}

        {visible.length === 0 && (
          <div className="empty">
            <p className="empty-title">
              {query.trim() ? `No group matches “${query.trim()}”` : "No groups in this view"}
            </p>
            <p className="empty-text">
              Try a state name, or a short code like UP, MH or TN. You can also search in the local
              script, like तमिलनाडु.
            </p>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setQuery("");
                setFilter("all");
                inputRef.current?.focus();
              }}
            >
              Show all groups
            </button>
          </div>
        )}
      </main>

      <QrDialog
        group={qrGroup}
        copied={qrGroup !== null && copiedId === qrGroup.id}
        onCopy={handleCopy}
        onClose={() => setQrGroup(null)}
      />

      <div className="toast" role="status" aria-live="polite" data-show={toast !== ""}>
        {toast}
      </div>
    </>
  );
}
