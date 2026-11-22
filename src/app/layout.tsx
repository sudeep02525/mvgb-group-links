import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/hind/400.css";
import "@fontsource/hind/500.css";
import "@fontsource/hind/600.css";
import "@fontsource/hind/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "M.V.G.B. Group Links",
  description:
    "Find and join the Mission Vishwaguru Bharat group for your state or union territory on Arattai.",
  // Anyone with a link can join these groups, so keep the page out of search engines.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0e1a3a",
  colorScheme: "light dark",
};

// Runs before first paint so the saved theme never flashes the wrong colours.
const themeScript = `(function(){try{var t=localStorage.getItem("mvgb-theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
