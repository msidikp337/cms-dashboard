"use client";
import { useState, useEffect, useRef } from "react";

type Range = 7 | 14 | 30 | 90;

function seed(s: number) { const x = Math.sin(s) * 10000; return x - Math.floor(x); }
function rng(s: number, a: number, b: number) { return Math.round(a + (b - a) * seed(s)); }

function genDays(n: number): string[] {
  const days: string[] = [];
  const base = new Date(2026, 2, 19);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    days.push(`${d.getMonth() + 1}/${d.getDate()}`);
  }
  return days;
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>(7);
  const impRef  = useRef<HTMLCanvasElement>(null);
  const engRef  = useRef<HTMLCanvasElement>(null);
  const folRef  = useRef<HTMLCanvasElement>(null);
  const platRef = useRef<HTMLCanvasElement>(null);
  const typeRef = useRef<HTMLCanvasElement>(null);
  const chartInstances = useRef<Record<string, any>>({});

  const getStats = (n: number) => {
    const imp = Array.from({ length: n }, (_, i) => rng(i * 7 + 1, 24000, 60000));
    const totImp = imp.reduce((a, b) => a + b, 0);
    const eng = Array.from({ length: n }, (_, i) => rng(i * 7 + 2, 35, 59) / 10);
    const avgEng = (eng.reduce((a, b) => a + b, 0) / n).toFixed(1);
    let fbase = 24800;
    const fol = Array.from({ length: n }, (_, i) => { fbase += rng(i * 3 + 5, 10, 80); return fbase; });
    const fGrowth = fol[fol.length - 1] - fol[0];
    const posts = rng(n * 2, Math.round(n * 0.4), Math.round(n * 0.8));
    return { totImp, avgEng, fGrowth, fol0: fol[0], posts, imp, eng, fol };
  };

  const stats = getStats(range);

  useEffect(() => {
    const loadCharts = async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);
      const n = range;
      const labels = genDays(n);
      const gridColor = "#1a1a2a";
      const tickColor = "#4a4a6a";

      const baseOpts = (type: string) => ({
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: "#16162a", borderColor: "#2a2a40", borderWidth: 1, titleColor: "#a78bfa", bodyColor: "#9ca3af", padding: 8 }
        },
        scales: type === "doughnut" ? {} : {
          x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 9 } }, border: { color: gridColor } },
          y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 9 } }, border: { color: gridColor } }
        }
      });

      const mkChart = (ref: React.RefObject<HTMLCanvasElement>, key: string, type: string, data: any, extraOpts: any = {}) => {
        const inst = chartInstances.current[key] as any;
        if (inst?.destroy) inst.destroy();
        if (!ref.current) return;
        chartInstances.current[key] = new Chart(ref.current, {
          type: type as any,
          data,
          options: { ...baseOpts(type), ...extraOpts }
        });
      };

      mkChart(impRef, "imp", "line", {
        labels,
        datasets: [
          { label: "Impressions", data: stats.imp, borderColor: "#7c6af7", backgroundColor: "#2d1b6918", fill: true, tension: 0.4, borderWidth: 2, pointRadius: 2 },
          { label: "Reach", data: stats.imp.map(v => Math.round(v * 0.65)), borderColor: "#3b82f6", backgroundColor: "transparent", tension: 0.4, borderWidth: 1.5, borderDash: [4, 4], pointRadius: 1 },
        ]
      });

      mkChart(engRef, "eng", "line", {
        labels,
        datasets: [{ label: "Eng%", data: stats.eng, borderColor: "#10b981", backgroundColor: "#10b98114", fill: true, tension: 0.4, borderWidth: 2, pointRadius: 2 }]
      });

      mkChart(folRef, "fol", "line", {
        labels,
        datasets: [{ label: "Followers", data: stats.fol, borderColor: "#f59e0b", backgroundColor: "#f59e0b10", fill: true, tension: 0.35, borderWidth: 2, pointRadius: 2 }]
      });

      mkChart(platRef, "plat", "bar", {
        labels: ["Instagram", "TikTok", "X", "LinkedIn"],
        datasets: [{
          label: "Impressions",
          data: [rng(n+10,30000,70000), rng(n+11,20000,60000), rng(n+12,8000,25000), rng(n+13,5000,18000)],
          backgroundColor: ["#4c35b5", "#3b82f6", "#10b981", "#f59e0b"],
          borderRadius: 4
        }]
      }, { barPercentage: 0.6 });

      mkChart(typeRef, "type", "doughnut", {
        labels: ["Reels", "Photos", "Carousels", "Stories"],
        datasets: [{
          data: [rng(n+20,30,50), rng(n+21,15,25), rng(n+22,15,25), rng(n+23,10,20)],
          backgroundColor: ["#7c6af7", "#3b82f6", "#f59e0b", "#e879f9"],
          borderWidth: 0
        }]
      }, {
        plugins: {
          legend: { display: true, position: "right", labels: { color: "#9ca3af", font: { size: 10 }, boxWidth: 10, padding: 8 } }
        }
      });
    };

    loadCharts();
  }, [range]);

  const topPosts = [
    { rank:1, cap:"Morning routine series — part 4", type:"Reel", imp: rng(range+30,8000,18000), eng:"7.4%" },
    { rank:2, cap:"Studio tour — swipe to see the space", type:"Carousel", imp: rng(range+32,6000,14000), eng:"6.1%" },
    { rank:3, cap:"5 tips for product photography", type:"Photo", imp: rng(range+34,5000,12000), eng:"5.8%" },
    { rank:4, cap:"Q1 recap — wins and lessons", type:"Carousel", imp: rng(range+36,4000,10000), eng:"4.9%" },
  ];

  const card = (children: React.ReactNode) => (
    <div style={{ background: "#10101c", border: "0.5px solid #1e1e30", borderRadius: "12px", padding: "16px" }}>
      {children}
    </div>
  );

  const chartTitle = (t: string) => (
    <p style={{ fontSize: "10px", fontWeight: 500, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", margin: "0 0 12px" }}>{t}</p>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c14", color: "#e2e8f0" }}>
      {/* Header */}
      <div style={{ background: "#10101c", borderBottom: "0.5px solid #1e1e30", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 500, margin: 0 }}>Analytics</p>
          <p style={{ fontSize: "11px", color: "#4a4a6a", margin: 0 }}>Content performance overview — demo data</p>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {([7, 14, 30, 90] as Range[]).map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              fontSize: "12px", padding: "5px 12px", borderRadius: "8px", cursor: "pointer", border: "0.5px solid",
              background: range === r ? "#2d1b69" : "#16162a",
              borderColor: range === r ? "#4c35b5" : "#2a2a40",
              color: range === r ? "#e2d9fd" : "#9ca3af"
            }}>{r}d</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "0.5px solid #1a1a2a" }}>
        {[
          { label: "Total impressions", value: stats.totImp >= 1000 ? `${(Math.round(stats.totImp / 100) / 10)}K` : stats.totImp, delta: `↑ ${rng(range+1,5,22)}% vs prev` },
          { label: "Engagement rate",   value: `${stats.avgEng}%`, delta: `↑ ${rng(range+2,2,8)}% vs prev` },
          { label: "Follower growth",   value: `+${stats.fGrowth.toLocaleString()}`, delta: `from ${stats.fol0.toLocaleString()}` },
          { label: "Total posts",       value: stats.posts, delta: "across all platforms" },
        ].map(s => (
          <div key={s.label} style={{ background: "#0c0c14", padding: "14px 18px", borderRight: "0.5px solid #1a1a2a" }}>
            <p style={{ fontSize: "10px", color: "#4a4a6a", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>{s.label}</p>
            <p style={{ fontSize: "22px", fontWeight: 500, margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: "11px", color: "#10b981", margin: "3px 0 0" }}>{s.delta}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", padding: "16px" }}>
        <div style={{ gridColumn: "1 / -1" }}>
          {card(<>{chartTitle("Impressions over time")}<canvas ref={impRef} height={80}/></>)}
        </div>
        {card(<>{chartTitle("Engagement rate (%)")}<canvas ref={engRef} height={120}/></>)}
        {card(<>{chartTitle("Follower growth")}<canvas ref={folRef} height={120}/></>)}
        {card(<>{chartTitle("Impressions by platform")}<canvas ref={platRef} height={120}/></>)}
        {card(<>{chartTitle("Posts by content type")}<canvas ref={typeRef} height={120}/></>)}
      </div>

      {/* Top posts */}
      <div style={{ padding: "0 16px 24px" }}>
        <p style={{ fontSize: "10px", fontWeight: 500, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>Top performing posts</p>
        {topPosts.map(p => (
          <div key={p.rank} style={{ display: "grid", gridTemplateColumns: "24px 1fr 90px 90px", gap: "10px", alignItems: "center", background: "#10101c", border: "0.5px solid #1e1e30", borderRadius: "8px", padding: "10px 14px", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", color: "#4a4a6a", fontWeight: 500, textAlign: "center" }}>#{p.rank}</span>
            <div>
              <p style={{ fontSize: "12px", color: "#c4b5fd", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.cap}</p>
              <span style={{ fontSize: "9px", fontWeight: 500, padding: "1px 5px", borderRadius: "4px", background: "#1e1040", color: "#a78bfa" }}>{p.type}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "13px", fontWeight: 500, margin: 0 }}>{p.imp.toLocaleString()}</p>
              <p style={{ fontSize: "9px", color: "#4a4a6a", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Impressions</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "13px", fontWeight: 500, margin: 0 }}>{p.eng}</p>
              <p style={{ fontSize: "9px", color: "#4a4a6a", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Eng. rate</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}