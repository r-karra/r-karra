import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";


export default function App() {
  const [page, setPage] = useState("sammy");
  const [activePost, setActivePost] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`w-full min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-300 ${darkMode ? "bg-neutral-900 text-neutral-100" : "bg-white text-neutral-800"}`}>
      {/* Sidebar - Fixed on the left for desktop */}
      <aside className="hidden md:flex md:flex-col md:justify-between md:w-64 md:fixed md:left-0 md:top-0 md:bottom-0 border-r border-neutral-200 dark:border-neutral-800 bg-inherit p-8 z-20">
        <nav className="space-y-6 text-sm">
          {[
            { id: "sammy", label: "sammy" },
            { id: "build", label: "build" },
            { id: "book", label: "book" },
            { id: "blog", label: "blog" },
          ].map((item, i) => (
            <button
              key={item.id}
              onClick={() => {
                setPage(item.id);
                setActivePost(null);
              }}
              className={`flex flex-col items-start font-light transition text-left ${page === item.id ? "text-blue-600" : "text-neutral-700 dark:text-neutral-200 hover:text-blue-500"}`}
            >
              <span className="text-neutral-400 text-xs mb-1">{String(i + 1).padStart(2, "0")}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="text-sm text-neutral-400 space-y-2">
          {["twitter", "cosmos", "substack", "contact"].map((l) => (
            <a
              key={l}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (l === "contact") setPage("contact");
              }}
              className="hover:text-neutral-600"
            >
              {l}
            </a>
          ))}
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <header className="flex md:hidden justify-around py-4 border-b border-neutral-200 text-sm bg-inherit z-10 fixed w-full">
        {[
          { id: "sammy", label: "sammy" },
          { id: "build", label: "build" },
          { id: "book", label: "book" },
          { id: "blog", label: "blog" },
        ].map((item, i) => (
          <button
            key={item.id}
            onClick={() => {
              setPage(item.id);
              setActivePost(null);
            }}
            className={`flex flex-col items-center ${page === item.id ? "text-blue-600" : "text-neutral-700 dark:text-neutral-200 hover:text-blue-500"}`}
          >
            <span className="text-neutral-400 text-xs">{String(i + 1).padStart(2, "0")}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 mt-14 md:mt-0 px-6 md:px-20 py-12 md:py-24 text-base leading-relaxed overflow-hidden">
        <div className="max-w-3xl">
          {page === "sammy" && <SammyPage darkMode={darkMode} />}
          {page === "build" && <BuildPage />}
          {page === "book" && <BookPage />}
          {page === "blog" && <BlogPage activePost={activePost} setActivePost={setActivePost} />}
          {page === "contact" && <ContactPage setPage={setPage} />}
        </div>

        {/* Theme Toggle */}
        <div
          onClick={() => setDarkMode(!darkMode)}
          className={`fixed bottom-6 right-8 text-xs cursor-pointer transition ${darkMode ? "text-neutral-300 hover:text-neutral-100" : "text-neutral-500 hover:text-neutral-800"}`}
        >
          {darkMode ? "light" : "dark"}
        </div>
      </main>
    </div>
  );
}

function SammyPage({ darkMode }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.("2d");
    if (!canvas || !ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const buffer = document.createElement("canvas");
    buffer.width = 64;
    buffer.height = 64;
    const bctx = buffer.getContext("2d");

    let raf;
    const draw = () => {
      const { width, height } = canvas;
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      const cx = Math.floor(width * 0.72);
      const cy = Math.floor(height * 0.55);
      const r = Math.floor(Math.min(width, height) * 0.25);
      const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, r);
      if (darkMode) {
        g.addColorStop(0, "rgba(255,255,255,0.18)");
        g.addColorStop(1, "rgba(255,255,255,0)");
      } else {
        g.addColorStop(0, "rgba(0,0,0,0.18)");
        g.addColorStop(1, "rgba(0,0,0,0)");
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      const img = bctx.createImageData(buffer.width, buffer.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = 28;
      }
      bctx.putImageData(img, 0, 0);
      const pat = ctx.createPattern(buffer, "repeat");
      ctx.fillStyle = pat;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.05, 0, Math.PI * 2);
      ctx.fill();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [darkMode]);

  return (
    <section className="relative">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40 pointer-events-none" />
      <div>
        <p>
          these days i spend my time thinking about the {" "}
          <a href="#next-project" className="font-semibold underline underline-offset-2 text-inherit hover:text-neutral-500">next project</a> to build. previously, i cofounded {" "}
          <a href="https://www.parasight.ca" className="font-semibold underline underline-offset-2 text-inherit hover:text-neutral-500">ParaSight</a>, a computational microscope for diagnosing malaria at 50x cost and time savings.
        </p>
        <p className="mt-4">
          outside of my current role as a quant developer at a small fund, i enjoy reading (tech, healthcare, and psychology), eating yummy {" "}
          <a href="#burgers" className="font-semibold underline underline-offset-2 text-inherit hover:text-neutral-500">burgers</a>, and just playing.
        </p>
        <p className="mt-4">i grew up in london (ontario), studied engineering/business in canada, and am now working and living in toronto.</p>
        <p className="mt-4">currently, i am most looking forward to the day i ride motorcycles. my favourite anime is Akira.</p>
      </div>
    </section>
  );
}

function BuildPage() {
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://api.quotable.io/random");
        const data = await res.json();
        setQuote({ content: data.content, author: data.author });
      } catch {
        setQuote({ content: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" });
      }
    })();
  }, []);
  return (
    <section>
      <p>i am a builder at heart, here is some of my work and some of the things i am working on.</p>
      {quote && <p className="italic mt-3">“{quote.content}” — {quote.author}</p>}
      <div className="mt-8 border-t border-neutral-200 pt-6 space-y-6">
        <div>
          <p className="font-medium">
            <a href="https://www.parasight.ca" className="no-underline text-inherit hover:text-neutral-500 inline-flex items-center gap-1">ParaSight <span className="text-neutral-500 text-sm" aria-hidden>↗</span></a>
          </p>
          <p className="text-neutral-500 text-sm">computational malaria diagnostic tool</p>
        </div>
        <div>
          <p className="font-medium">
            <a href="#something-new" className="no-underline text-inherit hover:text-neutral-500 inline-flex items-center gap-1">Something New <span className="text-neutral-500 text-sm" aria-hidden>↗</span></a>
          </p>
          <p className="text-neutral-500 text-sm">building...</p>
        </div>
      </div>
    </section>
  );
}

function BookPage() {
  const books = [
    { title: "Why Greatness Cannot Be Planned: The Myth of the Objective", link: "#greatness" },
    { title: "Getting More: How You Can Negotiate to Succeed in Work and Life", link: "#getting-more" },
    { title: "Crime and Punishment", link: "#crime-punishment" },
    { title: "When Breath Becomes Air", link: "#breath-air" },
    { title: "Boom: Bubbles and the End of Stagnation", link: "#boom-bubbles" },
    { title: "No Longer Human", link: "#no-longer-human" },
    { title: "Flow: The Psychology of Optimal Experience", link: "#flow" },
    { title: "The Basic Laws of Human Stupidity", link: "#stupidity" },
  ];
  return (
    <section>
      <p>things i have read that i thought were worth saving.</p>
      <p className="mt-4 italic">currently reading: {" "}<a href="#multimodal-medical-reasoning" className="underline underline-offset-4 text-inherit hover:text-neutral-500">a paper on multimodal medical reasoning</a></p>
      <div className="mt-6 border-t border-neutral-200 pt-6 space-y-3">
        {books.map((book, i) => (
          <p key={i} className="before:content-['*'] before:mr-2 before:text-black">
            <a href={book.link} className="no-underline text-inherit hover:text-neutral-500">{book.title}</a>
          </p>
        ))}
      </div>
    </section>
  );
}

function BlogPage({ activePost, setActivePost }) {
  const posts = [
    { title: "fabricated serendipity revisited", date: "Oct 19, 2025", content: "Coming soon..." },
    { title: "fabricated serendipity", date: "Aug 24, 2025", content: "i used to just accept the fact that some people were 'luckier' than me...\n\nthis is a sample body for preview." },
    {
      title: "Deploying rkarra.jsx to Firebase",
      date: "Nov 8, 2025",
      content: `
  # 🚀 Full Firebase Deployment Guide for rkarra.jsx
  
  Perfect. You’ve got a clean React component file (rkarra.jsx) — now let’s make it run and deploy properly to Firebase from scratch.
  
  Follow these exact steps — we’ll build a working React + Vite + Tailwind setup and deploy it cleanly.
  
  ## 🧱 Step 1 — Create a fresh Vite React project
  In a clean folder (no spaces in the path):
  
  \`\`\`bash
  npm create vite@latest r-karra
  cd r-karra
  \`\`\`
  
  Select:
  - Framework: React  
  - Variant: JavaScript  
  
  ## 🎨 Step 2 — Add Tailwind CSS
  \`\`\`bash
  npm install -D tailwindcss@3.4.13 postcss autoprefixer
  npx tailwindcss init -p
  \`\`\`
  
  ## 📄 Step 3 — Set up styles
  \`\`\`css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  \`\`\`
  
  ## ⚙️ Step 4 — Replace the default app
  Replace \`src/App.jsx\` with your uploaded \`rkarra.jsx\` file.
  
  ## 🧩 Step 5 — Fix the entry point
  \`\`\`jsx
  import React from "react";
  import ReactDOM from "react-dom/client";
  import App from "./App.jsx";
  import "./index.css";
  
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  \`\`\`
  
  ## 🪄 Step 6 — Vite config
  \`\`\`js
  import { defineConfig } from "vite";
  import react from "@vitejs/plugin-react";
  export default defineConfig({
    plugins: [react()],
    base: "./",
  });
  \`\`\`
  
  ## ☁️ Step 8 — Firebase Hosting
  \`\`\`bash
  npm install -g firebase-tools
  firebase login
  firebase init hosting
  firebase deploy
  \`\`\`
  
  ✅ Done! Your app is live at https://r-karra.web.app.
      `,
    },
    {
      title: "fabricated serendipity revisited",
      date: "Oct 19, 2025",
      content: "",
    },
    {
      title: "fabricated serendipity",
      date: "Aug 24, 2025",
      content:
        `i used to just accept the fact that some people were "luckier" than me...\n\nthis is a sample body for preview.`,
    },
  ];
  if (activePost) {
    return (
      <section>
        <h2 className="text-xl font-semibold hover:text-neutral-500 transition-colors duration-200">{activePost.title}</h2>
        <p className="text-neutral-500 text-sm mt-1">{activePost.date}</p>
        <div className="prose prose-neutral dark:prose-invert max-w-none border-t border-neutral-200 mt-4 pt-4 leading-relaxed">
  <ReactMarkdown>{activePost.content}</ReactMarkdown>
</div>
        <button onClick={() => setActivePost(null)} className="mt-8 text-neutral-600 hover:text-neutral-500">← Back to blog</button>
      </section>
    );
  }
  return (
    <section>
      <p>my inner thoughts written down.</p>
      <div className="mt-6 border-t border-neutral-200 pt-6 space-y-4">
        {posts.map((post) => (
          <div key={post.title} onClick={() => setActivePost(post)} className="flex justify-between cursor-pointer duration-300 hover:text-neutral-500">
            <span>{post.title}</span>
            <span className="text-neutral-500 text-sm">{post.date}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactPage({ setPage }) {
  return (
    <section className="w-full flex flex-col items-center justify-center min-h-screen text-center">
      <p className="text-base text-neutral-600 dark:text-neutral-300">sfarnum1132 [at] gmail [dot] com</p>
      <button onClick={() => setPage("sammy")} className="text-neutral-600 hover:text-neutral-500 text-sm mt-4">home</button>
    </section>
  );
}
