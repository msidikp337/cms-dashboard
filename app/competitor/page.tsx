"use client";
import { useState } from "react";

interface Competitor {
  id: number;
  name: string;
  handle: string;
  platforms: string[];
  followers: number;
  growth: number;
  eng: number;
  freq: number;
  recent: string;
  recentDate: string;
}

const PLAT_COLORS: Record<string,string> = { Instagram:"#e879f9", YouTube:"#ef4444", TikTok:"#3b82f6", X:"#6b7280", LinkedIn:"#0ea5e9" };
const PLAT_BG: Record<string,string> = { Instagram:"#2a0a2e", YouTube:"#2a0a0a", TikTok:"#0a1440", X:"#141418", LinkedIn:"#041a28" };
const AV_BG = ["#1e1040","#0c2044","#012a1a","#2a0a2e","#1a1200","#2a0a0a"];
const AV_CL = ["#a78bfa","#60a5fa","#10b981","#e879f9","#d4ac0d","#ef4444"];

const SEED: Competitor[] = [
  {id:1,name:"Brand Beta",handle:"@brandbeta",platforms:["Instagram","TikTok","YouTube"],followers:48200,growth:5.2,eng:6.1,freq:5,recent:"Spring collection drop — new styles just landed",recentDate:"2h ago"},
  {id:2,name:"Alpha Group",handle:"@alphagroupco",platforms:["Instagram","X"],followers:31400,growth:3.8,eng:4.8,freq:3,recent:"Our take on the latest platform algorithm changes",recentDate:"5h ago"},
  {id:3,name:"GreenCo Studio",handle:"@greenco",platforms:["Instagram","YouTube","LinkedIn"],followers:22100,growth:-0.9,eng:3.2,freq:2,recent:"Behind the scenes of our sustainable production",recentDate:"1d ago"},
  {id:4,name:"Nova Creative",handle:"@novacreative",platforms:["TikTok","Instagram"],followers:61800,growth:8.4,eng:7.9,freq:7,recent:"POV: When your brand collab goes viral overnight",recentDate:"3h ago"},
  {id:5,name:"Peak Studios",handle:"@peakstudios",platforms:["YouTube","X"],followers:19500,growth:1.1,eng:2.7,freq:1,recent:"Q1 2026 content strategy breakdown",recentDate:"3d ago"},
];

type SortKey = "name"|"followers"|"growth"|"eng"|"freq";

export default function CompetitorPage() {
  const [comps, setComps] = useState<Competitor[]>(SEED);
  const [filterP, setFilterP] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:"", handle:"", platforms:[] as string[] });
  const [nid, setNid] = useState(10);

  const filtered = filterP === "all" ? comps : comps.filter(c => c.platforms.includes(filterP));
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey as keyof Competitor];
    const bv = b[sortKey as keyof Competitor];
    if (typeof av === "string") return sortDir * (av as string).localeCompare(bv as string);
    return sortDir * ((av as number) - (bv as number));
  });

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d * -1);
    else { setSortKey(k); setSortDir(-1); }
  };

  const togglePlat = (p: string) =>
    setForm(f => ({ ...f, platforms: f.platforms.includes(p) ? f.platforms.filter(x => x !== p) : [...f.platforms, p] }));

  const save = () => {
    if (!form.name.trim()) return;
    const plats = form.platforms.length ? form.platforms : ["Instagram"];
    setComps(cs => [...cs, {
      id: nid, name: form.name.trim(),
      handle: form.handle || "@" + form.name.toLowerCase().replace(/\s/g, ""),
      platforms: plats,
      followers: Math.round(Math.random() * 50000 + 5000),
      growth: parseFloat((Math.random() * 10 - 2).toFixed(1)),
      eng: parseFloat((Math.random() * 6 + 1).toFixed(1)),
      freq: Math.floor(Math.random() * 7) + 1,
      recent: "No recent posts tracked yet",
      recentDate: "—"
    }]);
    setNid(n => n + 1);
    setShowModal(false);
    setForm({ name: "", handle: "", platforms: [] });
  };

  const thBtn = (label: string, key: SortKey) => (
    <button onClick={() => toggleSort(key)} style={{
      background: "none", border: "none", cursor: "pointer", fontSize: "9px",
      textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "3px",
      color: sortKey === key ? "#7c6af7" : "#4a4a6a"
    }}>
      {label} {sortKey === key ? (sortDir === 1 ? "↑" : "↓") : ""}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c14", color: "#e2e8f0" }}>
      {/* Header */}
      <div style={{ background: "#10101c", borderBottom: "0.5px solid #1e1e30", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 500, margin: 0 }}>Competitor Tracker</p>
          <p style={{ fontSize: "11px", color: "#4a4a6a", margin: 0 }}>Monitor rivals across social platforms</p>
        </div>
        <button onClick={() => setShowModal(true)}
          style={{ background: "#4c35b5", border: "none", color: "#e2d9fd", fontSize: "12px", fontWeight: 500, padding: "7px 14px", borderRadius: "8px", cursor: "pointer" }}>
          + Add competitor
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: "#0e0e1c", borderBottom: "0.5px solid #1a1a2a", padding: "9px 18px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "9px", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: "4px" }}>Platform</span>
        {["all", "Instagram", "YouTube", "TikTok", "X"].map(p => (
          <button key={p} onClick={() => setFilterP(p)} style={{
            fontSize: "10px", padding: "4px 10px", borderRadius: "20px", cursor: "pointer",
            border: `0.5px solid ${filterP === p ? "#4c35b5" : "#2a2a3a"}`,
            background: filterP === p ? "#1e1440" : "#13131f",
            color: filterP === p ? "#c4b5fd" : "#6b7280"
          }}>{p === "all" ? "All" : p}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: "700px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0e0e1c", borderBottom: "0.5px solid #1a1a2a" }}>
              <th style={{ textAlign: "left", padding: "10px 20px" }}>{thBtn("Competitor", "name")}</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}><span style={{ fontSize: "9px", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "0.08em" }}>Platforms</span></th>
              <th style={{ textAlign: "right", padding: "10px 12px" }}>{thBtn("Followers", "followers")}</th>
              <th style={{ textAlign: "right", padding: "10px 12px" }}>{thBtn("Growth", "growth")}</th>
              <th style={{ textAlign: "right", padding: "10px 12px" }}>{thBtn("Eng. rate", "eng")}</th>
              <th style={{ textAlign: "right", padding: "10px 12px" }}>{thBtn("Freq/wk", "freq")}</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}><span style={{ fontSize: "9px", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "0.08em" }}>Recent post</span></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c, idx) => (
              <tr key={c.id} style={{ borderBottom: "0.5px solid #1a1a2a" }}>
                <td style={{ padding: "12px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 500, flexShrink: 0, background: AV_BG[idx % AV_BG.length], color: AV_CL[idx % AV_CL.length] }}>
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: 500, color: "#c4b5fd", margin: 0 }}>{c.name}</p>
                      <p style={{ fontSize: "10px", color: "#4a4a6a", margin: 0 }}>{c.handle}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {c.platforms.map(p => (
                      <span key={p} style={{ fontSize: "8px", fontWeight: 500, padding: "2px 5px", borderRadius: "4px", background: PLAT_BG[p], color: PLAT_COLORS[p] }}>{p}</span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: "12px", textAlign: "right" }}>
                  <p style={{ fontSize: "12px", margin: 0 }}>{c.followers.toLocaleString()}</p>
                  <p style={{ fontSize: "9px", color: "#4a4a6a", margin: 0 }}>followers</p>
                </td>
                <td style={{ padding: "12px", textAlign: "right" }}>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: c.growth >= 0 ? "#10b981" : "#ef4444" }}>
                    {c.growth >= 0 ? "↑" : "↓"}{Math.abs(c.growth)}%
                  </span>
                </td>
                <td style={{ padding: "12px", textAlign: "right" }}>
                  <p style={{ fontSize: "12px", margin: 0 }}>{c.eng.toFixed(1)}%</p>
                </td>
                <td style={{ padding: "12px", textAlign: "right" }}>
                  <p style={{ fontSize: "12px", margin: 0 }}>{c.freq}/wk</p>
                  <div style={{ height: "3px", background: "#1a1a2a", borderRadius: "2px", marginTop: "4px", width: "48px", marginLeft: "auto" }}>
                    <div style={{ height: "100%", background: "#4c35b5", borderRadius: "2px", width: `${Math.round(c.freq / 10 * 100)}%` }} />
                  </div>
                </td>
                <td style={{ padding: "12px" }}>
                  <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0, maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.recent}</p>
                  <p style={{ fontSize: "9px", color: "#4a4a6a", margin: 0 }}>{c.recentDate}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
          onClick={() => setShowModal(false)}>
          <div style={{ background: "#10101c", border: "0.5px solid #2a2a40", borderRadius: "12px", width: "100%", maxWidth: "420px", padding: "20px" }}
            onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: "14px", fontWeight: 500, margin: "0 0 16px" }}>Add competitor</p>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "9px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>Name</label>
              <input style={{ width: "100%", background: "#16162a", border: "0.5px solid #2a2a40", color: "#e2e8f0", borderRadius: "8px", fontSize: "12px", padding: "7px 10px" }}
                placeholder="Brand name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "9px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>Handle</label>
              <input style={{ width: "100%", background: "#16162a", border: "0.5px solid #2a2a40", color: "#e2e8f0", borderRadius: "8px", fontSize: "12px", padding: "7px 10px" }}
                placeholder="@handle" value={form.handle} onChange={e => setForm(f => ({ ...f, handle: e.target.value }))} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "9px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>Platforms</label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["Instagram", "YouTube", "TikTok", "X", "LinkedIn"].map(p => (
                  <label key={p} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input type="checkbox" checked={form.platforms.includes(p)} onChange={() => togglePlat(p)} style={{ accentColor: "#4c35b5" }} />
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>{p}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "0.5px solid #2a2a40", color: "#6b7280", fontSize: "12px", padding: "7px 14px", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              <button onClick={save} style={{ background: "#4c35b5", border: "none", color: "#e2d9fd", fontSize: "12px", fontWeight: 500, padding: "7px 16px", borderRadius: "8px", cursor: "pointer" }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}