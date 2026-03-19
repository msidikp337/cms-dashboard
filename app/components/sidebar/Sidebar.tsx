"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/instagram", label: "Instagram Manager", icon: "📸" },
  { href: "/analytics",  label: "Analytics",         icon: "📊" },
  { href: "/calendar",   label: "Content Calendar",  icon: "📅" },
  { href: "/competitor", label: "Competitor Tracker", icon: "👥" },
  { href: "/news",       label: "News Consolidator", icon: "📰" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside style={{
      width: "220px", minWidth: "220px", background: "#0f0f1a",
      borderRight: "0.5px solid #1e1e2e", display: "flex",
      flexDirection: "column", padding: "20px 0", height: "100vh"
    }}>
      <div style={{ padding: "0 20px 20px", borderBottom: "0.5px solid #1e1e2e", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: 500, color: "#7c6af7", letterSpacing: "0.08em", textTransform: "uppercase" }}>CMS Suite</p>
        <p style={{ fontSize: "10px", color: "#3a3a5a", marginTop: "2px" }}>Content Management</p>
      </div>
      <p style={{ fontSize: "9px", fontWeight: 500, color: "#3a3a5a", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 20px 8px" }}>Workspace</p>
      <nav style={{ display: "flex", flexDirection: "column" }}>
        {navItems.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 20px", fontSize: "13px",
              borderLeft: active ? "2px solid #7c6af7" : "2px solid transparent",
              background: active ? "#13131f" : "transparent",
              color: active ? "#a78bfa" : "#5a5a7a",
              textDecoration: "none", transition: "all 0.15s"
            }}>
              <span style={{ fontSize: "14px" }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
      <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "0.5px solid #1e1e2e", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#2d1b69", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 500, color: "#a78bfa" }}>JD</div>
        <div>
          <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>Jane Doe</p>
          <p style={{ fontSize: "9px", color: "#4a4a6a", margin: 0 }}>Workspace Admin</p>
        </div>
      </div>
    </aside>
  );
}