import GroupDirectory from "@/components/GroupDirectory";
import ThemeToggle from "@/components/ThemeToggle";
import { GROUPS } from "@/data/groups";

export default function Home() {
  return (
    <>
      <div className="tricolor" aria-hidden="true" />

      <header className="masthead">
        <div className="container">
          <div className="masthead-top">
            <p className="org" lang="hi">
              मिशन विश्वगुरु भारत
            </p>
            <ThemeToggle />
          </div>
          <h1 className="title">
            <span className="title-plate">M.V.G.B.</span> Group links
          </h1>
          <p className="lede">
            Pick your state or union territory, then join its group on Arattai.
          </p>
          <div className="hero-stats">
            <span className="hero-stat"><b>{GROUPS.length}</b> groups</span>
            <span className="hero-stat"><b>{GROUPS.filter((g) => g.category === "state").length}</b> states</span>
            <span className="hero-stat"><b>{GROUPS.filter((g) => g.category === "ut").length}</b> union territories</span>
          </div>
        </div>
      </header>

      <noscript>
        <p className="noscript">Search and filters need JavaScript. The group links below still work.</p>
      </noscript>

      <GroupDirectory groups={GROUPS} />

      <footer className="footer">
        <div className="container">
          <p>
            Anyone with a link can join, so share these only with people you trust.
          </p>
          <p className="footer-count">{GROUPS.length} groups in the M.V.G.B. directory.</p>
        </div>
      </footer>
    </>
  );
}
