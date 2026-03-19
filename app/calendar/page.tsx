"use client";
import { useState } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const PLAT_COLORS: Record<string,string> = { Instagram:"#e879f9", YouTube:"#ef4444", TikTok:"#3b82f6", X:"#6b7280", LinkedIn:"#0ea5e9" };
const PLAT_BG: Record<string,string> = { Instagram:"#2a0a2e", YouTube:"#2a0a0a", TikTok:"#0a1440", X:"#141418", LinkedIn:"#041a28" };
const STATUS_COLORS: Record<string,string> = { Published:"#10b981", Scheduled:"#f59e0b", Draft:"#4a4a6a" };

interface CalPost { id:number; date:string; platform:string; type:string; caption:string; status:string; time:string; }

const SEED_POSTS: CalPost[] = [
  {id:1,date:"2026-03-01",platform:"Instagram",type:"Reel",caption:"Morning routine series part 3",status:"Published",time:"8:00 AM"},
  {id:2,date:"2026-03-05",platform:"X",type:"Thread",caption:"Hot take on social algorithms",status:"Published",time:"9:00 AM"},
  {id:3,date:"2026-03-07",platform:"Instagram",type:"Carousel",caption:"5 studio setup essentials",status:"Published",time:"12:00 PM"},
  {id:4,date:"2026-03-10",platform:"YouTube",type:"Video",caption:"Brand deal negotiation tips",status:"Published",time:"2:00 PM"},
  {id:5,date:"2026-03-14",platform:"Instagram",type:"Reel",caption:"Day in the life — shoot day",status:"Published",time:"6:00 PM"},
  {id:6,date:"2026-03-19",platform:"Instagram",type:"Carousel",caption:"Morning routine series part 4",status:"Scheduled",time:"8:00 AM"},
  {id:7,date:"2026-03-19",platform:"TikTok",type:"Short",caption:"Trending audio challenge",status:"Scheduled",time:"6:00 PM"},
  {id:8,date:"2026-03-21",platform:"YouTube",type:"Video",caption:"Studio tour 2026",status:"Scheduled",time:"12:00 PM"},
  {id:9,date:"2026-03-22",platform:"Instagram",type:"Story",caption:"Product launch teaser",status:"Scheduled",time:"6:00 PM"},
  {id:10,date:"2026-03-22",platform:"X",type:"Thread",caption:"Creator tools stack 2026",status:"Draft",time:""},
  {id:11,date:"2026-03-25",platform:"Instagram",type:"Reel",caption:"Founder interview — unfiltered",status:"Scheduled",time:"5:00 PM"},
  {id:12,date:"2026-03-28",platform:"LinkedIn",type:"Post",caption:"Collab announcement teaser",status:"Draft",time:""},
];

function dKey(y:number,m:number,d:number){ return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

export default function CalendarPage() {
  const today = new Date(2026,2,19);
  const [vY,setVY] = useState(2026);
  const [vM,setVM] = useState(2);
  const [posts,setPosts] = useState<CalPost[]>(SEED_POSTS);
  const [filterP,setFilterP] = useState("all");
  const [dayModal,setDayModal] = useState<{key:string,dn:number}|null>(null);
  const [addModal,setAddModal] = useState<{pdate:string}|null>(null);
  const [form,setForm] = useState({caption:"",platform:"Instagram",status:"Scheduled",date:"",time:""});
  const [nid,setNid] = useState(20);

  const filtered = filterP==="all" ? posts : posts.filter(p=>p.platform===filterP);
  const map = filtered.reduce((acc,p)=>{ if(!acc[p.date]) acc[p.date]=[]; acc[p.date].push(p); return acc; },{} as Record<string,CalPost[]>);

  const shiftM = (d:number) => {
    let m=vM+d,y=vY;
    if(m>11){m=0;y++;}
    if(m<0){m=11;y--;}
    setVM(m);setVY(y);
  };

  const fd = new Date(vY,vM,1).getDay();
  const dim = new Date(vY,vM+1,0).getDate();
  const pd = new Date(vY,vM,0).getDate();
  const total = Math.ceil((fd+dim)/7)*7;
  const cells = Array.from({length:total},(_,i)=>{
    let dn:number,y2=vY,m2=vM,isOther=false;
    if(i<fd){dn=pd-fd+i+1;m2=vM-1;if(m2<0){m2=11;y2--;}isOther=true;}
    else if(i>=fd+dim){dn=i-fd-dim+1;m2=vM+1;if(m2>11){m2=0;y2++;}isOther=true;}
    else dn=i-fd+1;
    const isToday=y2===today.getFullYear()&&m2===today.getMonth()&&dn===today.getDate();
    const key=dKey(y2,m2,dn);
    return {dn,isOther,isToday,key,dp:map[key]||[]};
  });

  const savePost = () => {
    if(!form.caption.trim())return;
    setPosts(ps=>[...ps,{id:nid,date:form.date||dKey(vY,vM,today.getDate()),platform:form.platform,type:"Post",caption:form.caption,status:form.status,time:form.time}]);
    setNid(n=>n+1);setAddModal(null);
    if(form.date){const p=form.date.split("-");setVY(parseInt(p[0]));setVM(parseInt(p[1])-1);}
  };

  const dayPosts = dayModal ? (map[dayModal.key]||[]) : [];
  const dayParts = dayModal?.key.split("-") || [];
  const dayLabel = dayModal ? `${MONTHS[parseInt(dayParts[1])-1]} ${dayModal.dn}, ${dayParts[0]}` : "";

  const btn = (label:string, active:boolean, onClick:()=>void) => (
    <button onClick={onClick} style={{
      fontSize:"10px", fontWeight:500, padding:"4px 10px", borderRadius:"20px", cursor:"pointer",
      border:`0.5px solid ${active?"#4c35b5":"#2a2a3a"}`,
      background:active?"#1e1440":"#13131f",
      color:active?"#c4b5fd":"#6b7280"
    }}>{label}</button>
  );

  return (
    <div style={{minHeight:"100vh",background:"#0c0c14",color:"#e2e8f0"}}>
      {/* Header */}
      <div style={{background:"#10101c",borderBottom:"0.5px solid #1e1e30",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <button onClick={()=>shiftM(-1)} style={{width:"28px",height:"28px",background:"#16162a",border:"0.5px solid #2a2a40",color:"#9ca3af",borderRadius:"8px",cursor:"pointer",fontSize:"14px"}}>‹</button>
          <span style={{fontSize:"14px",fontWeight:500,minWidth:"150px",textAlign:"center"}}>{MONTHS[vM]} {vY}</span>
          <button onClick={()=>shiftM(1)} style={{width:"28px",height:"28px",background:"#16162a",border:"0.5px solid #2a2a40",color:"#9ca3af",borderRadius:"8px",cursor:"pointer",fontSize:"14px"}}>›</button>
          <button onClick={()=>{setVY(today.getFullYear());setVM(today.getMonth());}} style={{fontSize:"10px",color:"#7c6af7",border:"0.5px solid #2a2a40",padding:"4px 10px",borderRadius:"8px",background:"transparent",cursor:"pointer"}}>Today</button>
        </div>
        <button onClick={()=>{setForm({caption:"",platform:"Instagram",status:"Scheduled",date:dKey(vY,vM,today.getDate()),time:""});setAddModal({pdate:""});}}
          style={{background:"#4c35b5",border:"none",color:"#e2d9fd",fontSize:"12px",fontWeight:500,padding:"7px 14px",borderRadius:"8px",cursor:"pointer"}}>
          + Add post
        </button>
      </div>

      {/* Filters */}
      <div style={{background:"#0e0e1c",borderBottom:"0.5px solid #1a1a2a",padding:"8px 16px",display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap"}}>
        <span style={{fontSize:"9px",color:"#4a4a6a",textTransform:"uppercase",letterSpacing:"0.08em",marginRight:"4px"}}>Platform</span>
        {["all","Instagram","YouTube","TikTok","X","LinkedIn"].map(p=>btn(p==="all"?"All":p,filterP===p,()=>setFilterP(p)))}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"10px"}}>
          {[["#10b981","Published"],["#f59e0b","Scheduled"],["#4a4a6a","Draft"]].map(([c,l])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:"4px"}}>
              <span style={{width:"6px",height:"6px",borderRadius:"50%",background:c,display:"inline-block"}}/>
              <span style={{fontSize:"9px",color:"#4a4a6a"}}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day headers */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:"#0e0e1c",borderBottom:"0.5px solid #1a1a2a"}}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
          <div key={d} style={{textAlign:"center",fontSize:"9px",fontWeight:500,color:"#4a4a6a",textTransform:"uppercase",letterSpacing:"0.08em",padding:"8px 0"}}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
        {cells.map((cell,i)=>(
          <div key={i} onClick={()=>setDayModal({key:cell.key,dn:cell.dn})}
            style={{borderRight:i%7===6?"none":"0.5px solid #1a1a2a",borderBottom:"0.5px solid #1a1a2a",padding:"6px",minHeight:"80px",background:cell.isOther?"#09090f":"#0c0c14",cursor:"pointer"}}>
            <div style={{width:"18px",height:"18px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:500,marginBottom:"4px",
              background:cell.isToday?"#4c35b5":"transparent",color:cell.isToday?"#e2d9fd":"#6b7280",borderRadius:"50%"}}>
              {cell.dn}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"2px"}}>
              {cell.dp.slice(0,3).map(p=>(
                <div key={p.id} style={{fontSize:"8px",fontWeight:500,padding:"2px 4px",borderRadius:"3px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                  background:PLAT_BG[p.platform]||"#1e1e2e",color:PLAT_COLORS[p.platform]||"#7c6af7",borderLeft:`2px solid ${PLAT_COLORS[p.platform]||"#7c6af7"}`}}>
                  <span style={{display:"inline-block",width:"4px",height:"4px",borderRadius:"50%",background:STATUS_COLORS[p.status]||"#4a4a6a",marginRight:"3px",verticalAlign:"middle"}}/>
                  {p.platform}
                </div>
              ))}
              {cell.dp.length>3&&<div style={{fontSize:"8px",color:"#6b7280",background:"#1e1e2e",borderRadius:"3px",padding:"2px 4px",textAlign:"center"}}>+{cell.dp.length-3}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Day detail modal */}
      {dayModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}} onClick={()=>setDayModal(null)}>
          <div style={{background:"#10101c",border:"0.5px solid #2a2a40",borderRadius:"12px",width:"100%",maxWidth:"360px",padding:"18px"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"14px"}}>
              <p style={{fontSize:"14px",fontWeight:500,margin:0}}>{dayLabel}</p>
              <button onClick={()=>setDayModal(null)} style={{background:"none",border:"none",color:"#4a4a6a",fontSize:"18px",cursor:"pointer"}}>×</button>
            </div>
            {dayPosts.length===0&&<p style={{textAlign:"center",fontSize:"12px",color:"#4a4a6a",padding:"16px 0"}}>No posts on this day</p>}
            {dayPosts.map(p=>(
              <div key={p.id} style={{display:"flex",alignItems:"flex-start",gap:"8px",padding:"8px 0",borderBottom:"0.5px solid #1a1a2a"}}>
                <div style={{width:"2px",borderRadius:"2px",alignSelf:"stretch",background:PLAT_COLORS[p.platform]||"#7c6af7",flexShrink:0}}/>
                <div>
                  <p style={{fontSize:"9px",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.07em",margin:"0 0 2px",color:PLAT_COLORS[p.platform]||"#7c6af7"}}>{p.platform} · {p.type}</p>
                  <p style={{fontSize:"11px",color:"#9ca3af",margin:0}}>{p.caption}</p>
                  <p style={{fontSize:"9px",color:"#4a4a6a",margin:"2px 0 0"}}>
                    <span style={{color:STATUS_COLORS[p.status]||"#4a4a6a"}}>{p.status}</span>{p.time&&` · ${p.time}`}
                  </p>
                </div>
              </div>
            ))}
            <button onClick={()=>{setDayModal(null);setForm({caption:"",platform:"Instagram",status:"Scheduled",date:dayModal.key,time:""});setAddModal({pdate:dayModal.key});}}
              style={{width:"100%",marginTop:"12px",background:"#1e1440",border:"0.5px dashed #4c35b5",color:"#a78bfa",fontSize:"12px",padding:"8px",borderRadius:"8px",cursor:"pointer"}}>
              + Add post on this day
            </button>
          </div>
        </div>
      )}

      {/* Add post modal */}
      {addModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}} onClick={()=>setAddModal(null)}>
          <div style={{background:"#10101c",border:"0.5px solid #2a2a40",borderRadius:"12px",width:"100%",maxWidth:"380px",padding:"18px"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"14px"}}>
              <p style={{fontSize:"14px",fontWeight:500,margin:0}}>Add post</p>
              <button onClick={()=>setAddModal(null)} style={{background:"none",border:"none",color:"#4a4a6a",fontSize:"18px",cursor:"pointer"}}>×</button>
            </div>
            {[
              {label:"Caption",el:<textarea style={{width:"100%",background:"#16162a",border:"0.5px solid #2a2a40",color:"#e2e8f0",borderRadius:"8px",fontSize:"12px",padding:"7px 9px",resize:"none",height:"60px",fontFamily:"inherit"}} value={form.caption} onChange={e=>setForm(f=>({...f,caption:e.target.value}))} placeholder="Caption…"/>},
            ].map(({label,el})=>(
              <div key={label} style={{marginBottom:"10px"}}>
                <label style={{display:"block",fontSize:"9px",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"4px"}}>{label}</label>
                {el}
              </div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"10px"}}>
              <div>
                <label style={{display:"block",fontSize:"9px",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"4px"}}>Platform</label>
                <select style={{width:"100%",background:"#16162a",border:"0.5px solid #2a2a40",color:"#e2e8f0",borderRadius:"8px",fontSize:"12px",padding:"6px 8px"}}
                  value={form.platform} onChange={e=>setForm(f=>({...f,platform:e.target.value}))}>
                  {["Instagram","YouTube","TikTok","X","LinkedIn"].map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{display:"block",fontSize:"9px",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"4px"}}>Status</label>
                <select style={{width:"100%",background:"#16162a",border:"0.5px solid #2a2a40",color:"#e2e8f0",borderRadius:"8px",fontSize:"12px",padding:"6px 8px"}}
                  value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                  {["Scheduled","Draft","Published"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"16px"}}>
              <div>
                <label style={{display:"block",fontSize:"9px",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"4px"}}>Date</label>
                <input type="date" style={{width:"100%",background:"#16162a",border:"0.5px solid #2a2a40",color:"#e2e8f0",borderRadius:"8px",fontSize:"12px",padding:"6px 8px"}}
                  value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:"9px",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"4px"}}>Time</label>
                <input type="time" style={{width:"100%",background:"#16162a",border:"0.5px solid #2a2a40",color:"#e2e8f0",borderRadius:"8px",fontSize:"12px",padding:"6px 8px"}}
                  value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:"8px"}}>
              <button onClick={()=>setAddModal(null)} style={{background:"transparent",border:"0.5px solid #2a2a40",color:"#6b7280",fontSize:"12px",padding:"7px 14px",borderRadius:"8px",cursor:"pointer"}}>Cancel</button>
              <button onClick={savePost} style={{background:"#4c35b5",border:"none",color:"#e2d9fd",fontSize:"12px",fontWeight:500,padding:"7px 16px",borderRadius:"8px",cursor:"pointer"}}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}