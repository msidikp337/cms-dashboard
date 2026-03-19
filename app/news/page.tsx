"use client";
import { useState } from "react";

type Topic = "all" | "tools" | "research" | "business" | "ai" | "regulation";

interface NewsItem {
  id: number;
  source: string;
  topic: string;
  headline: string;
  summary: string;
  date: string;
  ts: number;
}

const TOPIC_STYLES: Record<string, { bg: string; color: string }> = {
  tools:      { bg: "#1e1040", color: "#a78bfa" },
  research:   { bg: "#012a1a", color: "#10b981" },
  business:   { bg: "#1a1200", color: "#d4ac0d" },
  ai:         { bg: "#0c1e34", color: "#60a5fa" },
  regulation: { bg: "#2a0a0a", color: "#ef4444" },
};

const SOURCE_COLORS: Record<string, string> = {
  TechCrunch: "#ef4444", Wired: "#3b82f6", "Social Media Today": "#10b981",
  "The Verge": "#a78bfa", Reuters: "#f59e0b", Digiday: "#e879f9",
  Mashable: "#0ea5e9", "Harvard Business Review": "#10b981",
  Axios: "#60a5fa", "MIT Tech Review": "#a78bfa",
  Bloomberg: "#f59e0b", "Nieman Lab": "#10b981",
};

const ITEMS: NewsItem[] = [
  { id:1,  source:"TechCrunch",              topic:"tools",      headline:"Instagram rolls out AI-powered caption suggestions for creator accounts worldwide",         summary:"Meta has begun a staged rollout of AI caption generation tools directly within the Instagram app, letting creators draft captions from a photo description.",                                         date:"2h ago",  ts:22 },
  { id:2,  source:"Social Media Today",      topic:"research",   headline:"New study reveals optimal posting times for B2C brands in Q2 2026",                        summary:"Researchers analyzed 2.4 million posts across six platforms and found engagement peaks have shifted by up to two hours compared to 2024 benchmarks.",                                          date:"5h ago",  ts:19 },
  { id:3,  source:"The Verge",               topic:"business",   headline:"Meta expands monetization tools to Reels creators in Southeast Asia",                      summary:"Following strong uptake in the US and EU, Meta is bringing its Reels bonus program and in-stream ads to creators in Indonesia, Thailand, and Vietnam.",                                        date:"8h ago",  ts:16 },
  { id:4,  source:"Wired",                   topic:"ai",         headline:"How AI avatars are reshaping creator-brand sponsorship deals in 2026",                     summary:"Brands are increasingly signing licensing deals with AI-generated creator likenesses, raising complex questions around authenticity and disclosure.",                                            date:"10h ago", ts:14 },
  { id:5,  source:"Reuters",                 topic:"regulation", headline:"EU regulators propose mandatory disclosure rules for AI-generated social content",         summary:"The European Commission published draft guidelines requiring platforms to label AI-generated posts with a standardised watermark by Q4 2026.",                                                   date:"12h ago", ts:12 },
  { id:6,  source:"Digiday",                 topic:"business",   headline:"Creator economy funding hits record $4.2B in early 2026 as brand deals surge",            summary:"A new industry report tracks unprecedented investment in creator tools, agencies, and platforms, driven largely by DTC brands shifting ad budgets.",                                           date:"1d ago",  ts:10 },
  { id:7,  source:"Mashable",                topic:"tools",      headline:"CapCut launches pro-tier timeline editor with multi-track audio and B-roll AI",            summary:"ByteDance's video editing app is targeting semi-professional creators with a subscription tier that includes timeline editing previously only found in desktop apps.",                          date:"1d ago",  ts:9  },
  { id:8,  source:"Harvard Business Review", topic:"research",   headline:"Algorithm shifts on Instagram push authenticity over polished production value",          summary:"An 18-month study of 400 creator accounts found that raw, less-edited content consistently outperformed high-production posts on reach and saves.",                                         date:"2d ago",  ts:7  },
  { id:9,  source:"Axios",                   topic:"business",   headline:"YouTube Shorts overtakes TikTok in daily video uploads among US creators",               summary:"Internal YouTube data shows Shorts upload volume now exceeds TikTok by 14% among creators with fewer than 100K subscribers.",                                                                  date:"2d ago",  ts:6  },
  { id:10, source:"MIT Tech Review",         topic:"ai",         headline:"Synthetic influencers are attracting real advertising dollars — and real scrutiny",       summary:"Fully AI-generated influencer accounts are signing brand deals worth hundreds of thousands of dollars, prompting calls for platform transparency policies.",                                  date:"3d ago",  ts:4  },
  { id:11, source:"Bloomberg",               topic:"regulation", headline:"FTC proposes updated guidelines on affiliate disclosure for social media creators",       summary:"The updated rules would require clearer labelling of paid partnerships and affiliate links, with potential fines of up to $50K per violation.",                                                  date:"3d ago",  ts:3  },
  { id:12, source:"Nieman Lab",              topic:"research",   headline:"Podcast listenership hits all-time high as video podcast format gains traction",         summary:"A new Reuters Institute report finds that 38% of weekly podcast listeners now prefer video format, with YouTube cited as the primary discovery platform.",                                     date:"4d ago",  ts:2  },
];

export default function NewsPage() {
  const [filterT, setFilterT] = useState<Topic>("all");
  const [sortMode, setSortMode] = useState<"newest" | "source">("newest");
  const [refreshed, setRefreshed] = useState(false);

  const filtered = filterT === "all" ? ITEMS : ITEMS.filter(i => i.topic === filterT);
  const sorted = [...filtered].sort((a, b) =>
    sortMode === "newest" ? b.ts - a.ts : a.source.localeCompare(b.source)
  );

  const handleRefresh = () => {
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 2000);
  };

  const filterBtn = (label: string, value: Topic) => (
    <button key={value} onClick={() => setFilterT(value)} style={{
      fontSize: "10px", fontWeight: 500, padding: "4px 10px", borderRadius: "20px", cursor: "pointer",
      border: `0.5px solid ${filterT === value ? "#4c35b5" : "#2a2a3a"}`,
      background: filterT === value ? "#1e1440" : "#13131f",
      color: filterT === value ? "#c4b5fd" : "#6b7280"
    }}>{label}</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c14", color: "#e2e8f0" }}>
      {/* Header */}
      <div style={{ background: "#10101c", borderBottom: "0.5px solid #1e1e30", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 500, margin: 0 }}>News Consolidator</p>
          <p style={{ fontSize: "11px", color: "#4a4a6a", margin: 0 }}>Aggregated from RSS feeds — social media & creator economy</p>
        </div>
        <button onClick={handleRefresh} style={{ background: "#16162a", border: "0.5px solid #2a2a40", color: refreshed ? "#10b981" : "#7c6af7", fontSize: "12px", padding: "6px 12px", borderRadius: "8px", cursor: "pointer" }}>
          {refreshed ? "Refreshed ✓" : "↻ Refresh"}
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: "#0e0e1c", borderBottom: "0.5px solid #1a1a2a", padding: "9px 18px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "9px", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: "4px" }}>Topic</span>
        {filterBtn("All topics", "all")}
        {filterBtn("Tools", "tools")}
        {filterBtn("Research", "research")}
        {filterBtn("Business", "business")}
        {filterBtn("AI", "ai")}
        {filterBtn("Regulation", "regulation")}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "9px", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "0.08em" }}>Sort</span>
          {(["newest", "source"] as const).map(s => (
            <button key={s} onClick={() => setSortMode(s)} style={{
              fontSize: "10px", padding: "3px 9px", borderRadius: "20px", cursor: "pointer",
              border: `0.5px solid ${sortMode === s ? "#4c35b5" : "#2a2a3a"}`,
              background: sortMode === s ? "#1e1440" : "transparent",
              color: sortMode === s ? "#c4b5fd" : "#6b7280"
            }}>{s === "newest" ? "Newest" : "Source"}</button>
          ))}
        </div>
      </div>

      {/* News feed */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px", padding: "16px" }}>
        {sorted.map(item => {
          const ts = TOPIC_STYLES[item.topic] || TOPIC_STYLES.tools;
          const sc = SOURCE_COLORS[item.source] || "#7c6af7";
          return (
            <div key={item.id} style={{ background: "#10101c", border: "0.5px solid #1e1e30", borderRadius: "12px", padding: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "9px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: sc }}>{item.source}</span>
                <span style={{ fontSize: "8px", fontWeight: 500, padding: "2px 6px", borderRadius: "5px", background: ts.bg, color: ts.color }}>{item.topic}</span>
              </div>
              <p style={{ fontSize: "12px", fontWeight: 500, color: "#c4b5fd", lineHeight: 1.4, marginBottom: "6px" }}>{item.headline}</p>
              <p style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.5, marginBottom: "10px" }}>{item.summary}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "9px", color: "#4a4a6a" }}>{item.date}</span>
                <button style={{ fontSize: "9px", color: "#7c6af7", background: "transparent", border: "none", cursor: "pointer" }}>Read more →</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}