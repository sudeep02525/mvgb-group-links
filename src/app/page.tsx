import GroupDirectory from "@/components/GroupDirectory";
import ThemeToggle from "@/components/ThemeToggle";
import { GROUPS } from "@/data/groups";

function Chakra() {
  return (
    <svg className="chakra" viewBox="0 0 200 200" aria-hidden="true" fill="none" stroke="currentColor">
      <circle cx="100" cy="100" r="94" strokeWidth="5" />
      <circle cx="100" cy="100" r="86" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="12" strokeWidth="4" />
      {Array.from({ length: 24 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 15} 100 100)`}>
          <line x1="100" y1="112" x2="100" y2="14" strokeWidth="2" />
          <circle cx="100" cy="11" r="3" fill="currentColor" stroke="none" />
        </g>
      ))}
    </svg>
  );
}

export default function Home() {
  const names = GROUPS.filter((g) => g.category !== "community").map((g) => g.name);
  const states = GROUPS.filter((g) => g.category === "state").length;
  const uts = GROUPS.filter((g) => g.category === "ut").length;

  return (
    <>
      <div className="tricolor" aria-hidden="true" />

      <header className="masthead">
        <Chakra />
        <div className="container">
          <div className="masthead-top">
            <p className="org">Arattai group directory</p>
            <ThemeToggle />
          </div>
          <h1 className="title">
            <span className="title-hi" lang="hi">मिशन विश्वगुरु भारत</span>
            <span className="title-en">
              <span className="title-plate">M.V.G.B.</span> Group links
            </span>
          </h1>
          <p className="lede">
            अपना राज्य चुनिए और अपने प्रदेश के समूह से जुड़िए।
            <br />
            Pick your state or union territory, then join its group on Arattai.
          </p>
          <div className="hero-stats">
            <span className="hero-stat"><b>{GROUPS.length}</b> groups</span>
            <span className="hero-stat"><b>{states}</b> states</span>
            <span className="hero-stat"><b>{uts}</b> union territories</span>
          </div>
        </div>
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...names, ...names].map((n, i) => (
              <span key={i}>{n}</span>
            ))}
          </div>
        </div>
      </header>

      <noscript>
        <p className="noscript">Search and filters need JavaScript. The group links below still work.</p>
      </noscript>

      <GroupDirectory groups={GROUPS} />

      <footer className="footer">
        <div className="container">
          <p className="jai" lang="hi">जय हिन्द 🇮🇳</p>
          <p>Anyone with a link can join, so share these only with people you trust.</p>
          <p className="footer-count">{GROUPS.length} groups in the M.V.G.B. directory.</p>
        </div>
      </footer>
    </>
  );
}
