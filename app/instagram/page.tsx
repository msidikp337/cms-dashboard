"use client";
import { useState } from "react";

type PostStatus = "Scheduled" | "Draft" | "Published" | "Backlog";
type PostType = "Reel" | "Photo" | "Carousel" | "Story";

interface Post {
  id: number;
  caption: string;
  type: PostType;
  status: PostStatus;
  date: string;
}

const COLUMNS: PostStatus[] = ["Scheduled", "Draft", "Published", "Backlog"];

const COL_COLORS: Record<PostStatus, string> = {
  Scheduled: "#60a5fa",
  Draft: "#f59e0b",
  Published: "#10b981",
  Backlog: "#8b8ba7",
};

const TYPE_COLORS: Record<PostType, { bg: string; color: string }> = {
  Reel:     { bg: "#1e1040", color: "#a78bfa" },
  Photo:    { bg: "#0c1e34", color: "#60a5fa" },
  Carousel: { bg: "#1a1200", color: "#d4ac0d" },
  Story:    { bg: "#1a0a1a", color: "#e879f9" },
};

const INITIAL_POSTS: Post[] = [
  { id:1, caption:"Morning routine series — gentle movement and setting intentions.", type:"Reel", status:"Scheduled", date:"Mar 19, 8:00 AM" },
  { id:2, caption:"Studio tour behind the scenes — swipe to see the full space.", type:"Carousel", status:"Scheduled", date:"Mar 21, 12:00 PM" },
  { id:3, caption:"Product launch teaser — something big is coming this weekend.", type:"Story", status:"Scheduled", date:"Mar 22, 6:00 PM" },
  { id:4, caption:"Q1 recap — biggest wins and what we're building next quarter.", type:"Carousel", status:"Draft", date:"Mar 25" },
  { id:5, caption:"Founder interview — unfiltered thoughts on building in public.", type:"Reel", status:"Draft", date:"" },
  { id:6, caption:"5 tips for product photography — natural light and composition.", type:"Photo", status:"Published", date:"Mar 14" },
  { id:7, caption:"Brand story reel — from day one to now.", type:"Reel", status:"Published", date:"Mar 10" },
  { id:8, caption:"Meet the team — the people behind the brand.", type:"Carousel", status:"Published", date:"Mar 5" },
  { id:9, caption:"Spring mood board — late spring content batch concept.", type:"Photo", status:"Backlog", date:"" },
  { id:10, caption:"Collab teaser with a local artist — concept stage.", type:"Reel", status:"Backlog", date:"" },
];

export default function InstagramPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ caption:"", type:"Reel" as PostType, status:"Backlog" as PostStatus, date:"" });
  const [nextId, setNextId] = useState(11);

  const colPosts = (status: PostStatus) => posts.filter(p => p.status === status);
  const move = (id: number, status: PostStatus) => setPosts(ps => ps.map(p => p.id === id ? { ...p, status } : p));
  const remove = (id: number) => setPosts(ps => ps.filter(p => p.id !== id));
  const save = () => {
    if (!form.caption.trim()) return;
    setPosts(ps => [...ps, { id: nextId, ...form }]);
    setNextId(n => n + 1);
    setShowModal(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c14", color: "#e2e8f0" }}>
      {/* Header */}
      <div style={{ background: "#10101c", borderBottom: "0.5px solid #1e1e30", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 500, margin: 0 }}>Instagram Manager</p>
          <p style={{ fontSize: "11px", color: "#4a4a6a", margin: 0 }}>Content pipeline — @yourbrand</p>
        </div>
        <button onClick={() => { setForm({ caption:"", type:"Reel", status:"Backlog", date:"" }); setShowModal(true); }}
          style={{ background: "#4c35b5", border: "none", color: "#e2d9fd", fontSize: "12px", fontWeight: 500, padding: "7px 14px", borderRadius: "8px", cursor: "pointer" }}>
          + New post idea
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "0.5px solid #1a1a2a" }}>
        {COLUMNS.map(s => (
          <div key={s} style={{ background: "#0c0c14", padding: "14px 18px", borderRight: "0.5px solid #1a1a2a" }}>
            <p style={{ fontSize: "10px", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>{s}</p>
            <p style={{ fontSize: "22px", fontWeight: 500, margin: 0, color: COL_COLORS[s] }}>{colPosts(s).length}</p>
          </div>
        ))}
      </div>

      {/* Board */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", padding: "16px" }}>
        {COLUMNS.map(col => (
          <div key={col}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: COL_COLORS[col] }}>{col}</span>
              <span style={{ fontSize: "11px", fontWeight: 500, padding: "2px 7px", borderRadius: "10px", background: "#1a1a28", color: COL_COLORS[col] }}>{colPosts(col).length}</span>
            </div>
            {colPosts(col).map(p => (
              <div key={p.id} style={{ background: "#10101c", border: "0.5px solid #1e1e30", borderRadius: "12px", padding: "12px", marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 500, padding: "3px 7px", borderRadius: "7px", background: TYPE_COLORS[p.type].bg, color: TYPE_COLORS[p.type].color }}>{p.type}</span>
                  <button onClick={() => remove(p.id)} style={{ background: "none", border: "none", color: "#4a4a6a", cursor: "pointer", fontSize: "16px" }}>×</button>
                </div>
                <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "10px", lineHeight: 1.45 }}>{p.caption}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "10px", color: "#4a4a6a" }}>{p.date || "No date"}</span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {p.status !== "Published" && <button onClick={() => move(p.id, "Published")} style={{ fontSize: "10px", background: "#16162a", border: "0.5px solid #2a2a40", color: "#6b7280", padding: "3px 8px", borderRadius: "5px", cursor: "pointer" }}>Publish</button>}
                    {p.status === "Backlog" && <button onClick={() => move(p.id, "Draft")} style={{ fontSize: "10px", background: "#16162a", border: "0.5px solid #2a2a40", color: "#6b7280", padding: "3px 8px", borderRadius: "5px", cursor: "pointer" }}>Draft</button>}
                    {p.status === "Draft" && <button onClick={() => move(p.id, "Scheduled")} style={{ fontSize: "10px", background: "#16162a", border: "0.5px solid #2a2a40", color: "#6b7280", padding: "3px 8px", borderRadius: "5px", cursor: "pointer" }}>Schedule</button>}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => { setForm({ caption:"", type:"Reel", status:col, date:"" }); setShowModal(true); }}
              style={{ width: "100%", border: "0.5px dashed #2a2a40", borderRadius: "12px", padding: "10px", background: "transparent", color: "#4a4a6a", fontSize: "12px", cursor: "pointer" }}>
              + Add
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
          onClick={() => setShowModal(false)}>
          <div style={{ background: "#10101c", border: "0.5px solid #2a2a40", borderRadius: "12px", width: "100%", maxWidth: "440px", padding: "20px" }}
            onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: "15px", fontWeight: 500, marginBottom: "16px" }}>New post idea</p>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "10px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>Caption</label>
              <textarea style={{ width: "100%", background: "#16162a", border: "0.5px solid #2a2a40", color: "#e2e8f0", borderRadius: "8px", fontSize: "13px", padding: "8px 10px", resize: "none", height: "80px", fontFamily: "inherit" }}
                value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Write your caption…" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "10px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>Type</label>
                <select style={{ width: "100%", background: "#16162a", border: "0.5px solid #2a2a40", color: "#e2e8f0", borderRadius: "8px", fontSize: "13px", padding: "8px 10px" }}
                  value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as PostType }))}>
                  {["Reel","Photo","Carousel","Story"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "10px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>Status</label>
                <select style={{ width: "100%", background: "#16162a", border: "0.5px solid #2a2a40", color: "#e2e8f0", borderRadius: "8px", fontSize: "13px", padding: "8px 10px" }}
                  value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as PostStatus }))}>
                  {COLUMNS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "10px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>Scheduled date</label>
              <input style={{ width: "100%", background: "#16162a", border: "0.5px solid #2a2a40", color: "#e2e8f0", borderRadius: "8px", fontSize: "13px", padding: "8px 10px" }}
                placeholder="e.g. Mar 28, 9:00 AM" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "0.5px solid #2a2a40", color: "#6b7280", fontSize: "12px", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              <button onClick={save} style={{ background: "#4c35b5", border: "none", color: "#e2d9fd", fontSize: "12px", fontWeight: 500, padding: "8px 18px", borderRadius: "8px", cursor: "pointer" }}>Save post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}