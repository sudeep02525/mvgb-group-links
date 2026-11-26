const WORD_SPLIT = /[^\p{L}\p{M}\p{N}]+/u;

function normalize(text) {
  return text.normalize("NFC").toLocaleLowerCase("en");
}

/** Plain ASCII of 1–2 letters ("up", "tn", "kl") is a state code: match whole words only. */
function isShortCode(token) {
  return token.length <= 2 && /^[a-z0-9]+$/.test(token);
}

/** Builds a search index: one entry per group with a lowercase haystack and a word set. */
export function buildIndex(groups) {
  return groups.map((group) => {
    const haystack = normalize(
      [group.name, group.native ?? "", group.code, group.groupName, group.keywords].join(" "),
    );
    return { group, haystack, words: new Set(haystack.split(WORD_SPLIT).filter(Boolean)) };
  });
}

function matches(entry, tokens) {
  return tokens.every((token) =>
    isShortCode(token) ? entry.words.has(token) : entry.haystack.includes(token),
  );
}

export function search(index, query) {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return index.map((entry) => entry.group);
  return index.filter((entry) => matches(entry, tokens)).map((entry) => entry.group);
}

export function countByCategory(groups) {
  const counts = { channel: 0, community: 0, state: 0, ut: 0 };
  for (const group of groups) counts[group.category] += 1;
  return counts;
}
