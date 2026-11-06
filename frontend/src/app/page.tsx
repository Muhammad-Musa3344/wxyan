
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type Person = {
  _id: string;
  name: string;
  email: string;
};

type Site = {
  _id: string;
  address: string;
  title: string;
  html?: string;
  authorId?: string;
};

type HistoryEntry = {
  address: string;
  title: string;
  html: string;
  status: number;
  state?: { scrollY?: number };
};

type HistoryData = {
  entries: HistoryEntry[];
  currentIndex: number;
  current: HistoryEntry | null;
  canGoBack: boolean;
  canGoForward: boolean;
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data as T;
}

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const [personId, setPersonId] = useState("");
  const [history, setHistory] = useState<HistoryData | null>(null);
  const [address, setAddress] = useState("http://wonderweb.local/");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Site[]>([]);
  const [showPublish, setShowPublish] = useState(false);
  const [publishTitle, setPublishTitle] = useState("");
  const [publishAddress, setPublishAddress] = useState("");
  const [publishHtml, setPublishHtml] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const frameRef = useRef<HTMLIFrameElement>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingScrollSaveRef = useRef<Promise<void> | null>(null);

  const current = history?.current ?? null;


useEffect(() => {
  request<Person[]>(`${API}/people`)
    .then((result) => {
      setPeople(result);

      if (result.length > 0) {
        setPersonId(result[0]._id);
      }
    })
    .catch((error) => {
      setMessage(
        error instanceof Error ? error.message : "Could not load people.",
      );
    });
}, []);


  // Save the current iframe scroll position to the active history entry.
  const saveCurrentState = async () => {
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }

    if (!personId || !current || !frameRef.current?.contentWindow) {
      return;
    }

    // Wait for any previously scheduled save to finish.
    if (pendingScrollSaveRef.current) {
      await pendingScrollSaveRef.current;
    }

    const scrollY = Math.round(
      frameRef.current.contentWindow.scrollY,
    );

    try {
      await request<HistoryData>(`${API}/visits/${personId}/state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: { scrollY },
        }),
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save scroll position.",
      );
    }
  };

  // Debounce scroll events so we do not send an API request for every pixel.
  const scheduleScrollSave = () => {
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    const activePersonId = personId;

    scrollTimerRef.current = setTimeout(() => {
      const scrollY = Math.round(
        frameRef.current?.contentWindow?.scrollY ?? 0,
      );

      const savePromise = request<HistoryData>(
        `${API}/visits/${activePersonId}/state`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            state: { scrollY },
          }),
        },
      )
        .then(() => undefined)
        .catch((error) => {
          setMessage(
            error instanceof Error
              ? error.message
              : "Could not save scroll position.",
          );
        });

      pendingScrollSaveRef.current = savePromise;

      void savePromise.then(() => {
        if (pendingScrollSaveRef.current === savePromise) {
          pendingScrollSaveRef.current = null;
        }
      });
    }, 300);
  };

  const navigateTo = async (target: string) => {
    if (!personId || !target.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      // Save the page being left before changing the history index.
      await saveCurrentState();

      const result = await request<HistoryData>(
        `${API}/visits/${personId}/navigate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: target.trim(),
            state: { scrollY: 0 },
          }),
        },
      );

      setHistory(result);
      setAddress(target.trim());
      setSearchResults([]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Navigation failed.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = async () => {
    if (!personId) return;

    try {
      await saveCurrentState();

      const result = await request<HistoryData>(
        `${API}/visits/${personId}/back`,
        { method: "POST" },
      );

      setHistory(result);
      if (result.current) setAddress(result.current.address);
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Cannot go back.");
    }
  };

  const goForward = async () => {
    if (!personId) return;

    try {
      await saveCurrentState();

      const result = await request<HistoryData>(
        `${API}/visits/${personId}/forward`,
        { method: "POST" },
      );

      setHistory(result);
      if (result.current) setAddress(result.current.address);
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Cannot go forward.");
    }
  };

  const searchWeb = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchQuery.trim()) return;

    try {
      const results = await request<Site[]>(
        `${API}/search?q=${encodeURIComponent(searchQuery)}`,
      );

      setSearchResults(results);
      setMessage(`${results.length} result(s) found.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Search failed.");
    }
  };

  const publishWebsite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!personId) {
      setMessage("Select a person before publishing.");
      return;
    }

    try {
      const result = await request<Site>(`${API}/sites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: publishTitle,
          address: publishAddress,
          html: publishHtml,
          authorId: personId,
        }),
      });

      setShowPublish(false);
      setPublishTitle("");
      setPublishAddress("");
      setPublishHtml("");
      setMessage(`Published: ${result.title}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Publishing failed.");
    }
  };

  // Restore saved scroll and intercept links inside the simulated website.
  const handleFrameLoad = () => {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    const frameWindow = frame?.contentWindow;

    if (!frame || !doc || !frameWindow) return;

    const savedScroll = current?.state?.scrollY ?? 0;

    frameWindow.requestAnimationFrame(() => {
      frameWindow.scrollTo(0, savedScroll);
    });

    // Save scroll position after the user stops scrolling.
    doc.addEventListener("scroll", scheduleScrollSave);

    // Links use our simulated browser navigation instead of real navigation.
    doc.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a");

      if (!link) return;

      event.preventDefault();

      const href = link.getAttribute("href");
      if (!href) return;

      try {
        const nextAddress = new URL(href, current?.address).href;
        navigateTo(nextAddress);
      } catch {
        setMessage("This link has an invalid address.");
      }
    });
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">W</div>
          <div>
            <h1>Wyxan</h1>
            <p>Explore your simulated web</p>
          </div>
        </div>

        <div className="person-control">
          <label htmlFor="person">Browsing as</label>
          <select
            id="person"
            value={personId}
            onChange={async (event) => {
              await saveCurrentState();
              setPersonId(event.target.value);
              setSearchResults([]);
              setMessage("");
            }}
          >
            {people.map((person) => (
              <option key={person._id} value={person._id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="browser">
        <div className="toolbar">
          <button
            className="icon-button"
            onClick={goBack}
            disabled={!history?.canGoBack}
            title="Go back"
          >
            ←
          </button>

          <button
            className="icon-button"
            onClick={goForward}
            disabled={!history?.canGoForward}
            title="Go forward"
          >
            →
          </button>

          <form
            className="address-form"
            onSubmit={(event) => {
              event.preventDefault();
              navigateTo(address);
            }}
          >
            <span>🌐</span>
            <input
              aria-label="Website address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Enter a simulated website address"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Go"}
            </button>
          </form>

          <button
            className="publish-button"
            onClick={() => setShowPublish(!showPublish)}
          >
            + Publish
          </button>
        </div>

        <div className="browser-content">
          <aside className="sidebar">
            <section className="sidebar-section">
              <h2>Search websites</h2>
              <form onSubmit={searchWeb} className="search-form">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search content..."
                />
                <button type="submit">Search</button>
              </form>

              {searchResults.map((site) => (
                <button
                  className="result-item"
                  key={site._id}
                  onClick={() => navigateTo(site.address)}
                >
                  <strong>{site.title}</strong>
                  <span>{site.address}</span>
                </button>
              ))}
            </section>

            <section className="sidebar-section">
              <h2>Browsing history</h2>

              {!history?.entries.length && (
                <p className="muted">No browsing history yet.</p>
              )}

              {history?.entries.map((entry, index) => (
                <button
                  key={`${entry.address}-${index}`}
                  className={`history-item ${
                    index === history.currentIndex ? "active" : ""
                  }`}
                  onClick={() => navigateTo(entry.address)}
                >
                  <strong>{entry.title}</strong>
                  <span>{entry.address}</span>
                </button>
              ))}
            </section>
          </aside>

          <section className="page-area">
            {message && (
              <div className="notice" role="status">
                {message}
                <button onClick={() => setMessage("")}>×</button>
              </div>
            )}

            {current ? (
              <>
                <div className="page-heading">
                  <span className="status-dot" />
                  <span>{current.address}</span>
                  <span className="status-code">{current.status}</span>
                </div>

                <iframe
                  ref={frameRef}
                  title={current.title}
                  className="website-frame"
                  srcDoc={current.html}
                  sandbox="allow-same-origin"
                  onLoad={handleFrameLoad}
                />
              </>
            ) : (
              <div className="welcome">
                <div className="welcome-icon">🌐</div>
                <h2>Welcome to Wyxan Browser</h2>
                <p>
                  Choose a person and enter a simulated website address to
                  start exploring.
                </p>
                <button onClick={() => navigateTo("http://wonderweb.local/")}>
                  Explore WonderWeb
                </button>
              </div>
            )}
          </section>
        </div>
      </section>

      {showPublish && (
        <div className="modal-backdrop">
          <form className="publish-modal" onSubmit={publishWebsite}>
            <div className="modal-heading">
              <h2>Publish a website</h2>
              <button type="button" onClick={() => setShowPublish(false)}>
                ×
              </button>
            </div>

            <label>Website title</label>
            <input
              required
              value={publishTitle}
              onChange={(event) => setPublishTitle(event.target.value)}
              placeholder="My new website"
            />

            <label>Website address</label>
            <input
              required
              type="url"
              value={publishAddress}
              onChange={(event) => setPublishAddress(event.target.value)}
              placeholder="http://mywebsite.local/"
            />

            <label>HTML content</label>
            <textarea
              required
              rows={9}
              value={publishHtml}
              onChange={(event) => setPublishHtml(event.target.value)}
              placeholder="<h1>Hello world</h1><p>My first website.</p>"
            />

            <button className="submit-publish" type="submit">
              Publish website
            </button>
          </form>
        </div>
      )}

      <footer className="footer">
        Wyxan Browser · Simulated web environment
      </footer>
    </main>
  );
}
