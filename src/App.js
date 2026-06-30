/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  navy:"#0A1628", navyMid:"#112240", navyLight:"#1C3461",
  blue:"#1E5FD4", blueLight:"#3B82F6", cyan:"#06B6D4",
  gold:"#F59E0B", green:"#10B981", red:"#EF4444", orange:"#F97316",
  purple:"#8B5CF6", pink:"#EC4899",
  white:"#F8FAFF", gray200:"#C8D4EC", gray400:"#7B93C4", gray600:"#3D5A8A",
};

const SELLER_TYPES = {
  top_atacado:   { label:"Top Atacado",       icon:"🏭", color:C.orange },
  doceiro:       { label:"Executivo Doceiro", icon:"🍬", color:C.pink   },
  representante: { label:"Representante",     icon:"🤝", color:C.purple },
  distribuidora: { label:"Distribuidora",     icon:"📦", color:C.gold   },
  key_account:   { label:"Key Account",       icon:"🔑", color:C.cyan   },
  hibrido:       { label:"Híbrido",           icon:"⚡", color:C.green  },
};
const ROLE_LABELS = { vendedor:"Vendedor", supervisor:"Supervisor", gerente:"Gerente", head:"Head Comercial", diretor:"Diretor Comercial" };
const ROLE_COLORS = { vendedor:C.cyan, supervisor:C.green, gerente:C.blue, head:C.gold, diretor:C.orange };
const ROLE_ORDER  = ["diretor","head","gerente","supervisor","vendedor"];

const SEED_USERS = [
  { id:1,  name:"Lucas Ferreira",  email:"lucas@demo.com",    password:"123456", role:"vendedor", sellerType:"top_atacado",  avatar:"LF", supervisorId:8, target:800000,  achieved:612000  },
  { id:2,  name:"Ana Paula Costa", email:"ana@demo.com",      password:"123456", role:"vendedor", sellerType:"doceiro",       avatar:"AP", supervisorId:8, target:95000,   achieved:81200   },
  { id:3,  name:"Rafael Moura",    email:"rafael@demo.com",   password:"123456", role:"vendedor", sellerType:"representante", avatar:"RM", supervisorId:8, target:220000,  achieved:178400  },
  { id:4,  name:"Camila Torres",   email:"camila@demo.com",   password:"123456", role:"vendedor", sellerType:"distribuidora", avatar:"CT", supervisorId:9, target:1200000, achieved:1054000 },
  { id:5,  name:"Bruno Lima",      email:"bruno@demo.com",    password:"123456", role:"vendedor", sellerType:"key_account",   avatar:"BL", supervisorId:9, target:650000,  achieved:598000  },
  { id:6,  name:"Patrícia Mendes", email:"patricia@demo.com", password:"123456", role:"vendedor", sellerType:"hibrido",       avatar:"PM", supervisorId:9, target:180000,  achieved:142600  },
  { id:8,  name:"Fernanda Souza",  email:"fernanda@demo.com", password:"123456", role:"supervisor", avatar:"FS", managerId:10, target:1700000, achieved:1369400 },
  { id:9,  name:"Diego Alves",     email:"diego@demo.com",    password:"123456", role:"supervisor", avatar:"DA", managerId:10, target:2030000, achieved:1794600 },
  { id:10, name:"Rodrigo Matos",   email:"rodrigo@demo.com",  password:"123456", role:"gerente",    avatar:"RO", headId:11,    target:3730000, achieved:3164000 },
  { id:11, name:"Carlos Henrique", email:"carlos@demo.com",   password:"123456", role:"head",       avatar:"CH", directorId:12,target:3730000, achieved:3164000 },
  { id:12, name:"Marcela Diniz",   email:"marcela@demo.com",  password:"123456", role:"diretor",    avatar:"MD", target:5000000,achieved:4312000 },
];

const DOCEIRO_LOJAS_SEED = [
  { id:"L1", name:"Mercado Bom Dia",      address:"R. das Flores, 142 — Vila Madalena", lat:-23.5541, lng:-46.6917, seq:1, status:"visitada",   checklist:{estoque:true, gondola:true, pedido:true, foto:true, promocao:true, gerente:true},  pedidoValor:1240, obs:"Ruptura de Bis 40g", fotos:[] },
  { id:"L2", name:"Mini Box Center",       address:"Av. Brasil, 891 — Pinheiros",        lat:-23.5613, lng:-46.6827, seq:2, status:"visitada",   checklist:{estoque:true, gondola:true, pedido:true, foto:false,gerente:false,promocao:false}, pedidoValor:890,  obs:"", fotos:[] },
  { id:"L3", name:"Empório da Vila",       address:"R. Ipê, 55 — Itaim Bibi",           lat:-23.5847, lng:-46.6763, seq:3, status:"em_visita",  checklist:{estoque:true, gondola:false,pedido:false,foto:false,gerente:false,promocao:false}, pedidoValor:0, obs:"", fotos:[] },
  { id:"L4", name:"Mercadinho Boa Vista",  address:"Av. Paz, 310 — Moema",              lat:-23.6019, lng:-46.6647, seq:4, status:"pendente",   checklist:{estoque:false,gondola:false,pedido:false,foto:false,gerente:false,promocao:false}, pedidoValor:0, obs:"", fotos:[] },
  { id:"L5", name:"Super Família",         address:"R. das Acácias, 77 — Saúde",        lat:-23.6231, lng:-46.6381, seq:5, status:"pendente",   checklist:{estoque:false,gondola:false,pedido:false,foto:false,gerente:false,promocao:false}, pedidoValor:0, obs:"", fotos:[] },
  { id:"L6", name:"Mercearia Souza",       address:"Trav. Nova, 23 — Ipiranga",         lat:-23.5901, lng:-46.6097, seq:6, status:"pendente",   checklist:{estoque:false,gondola:false,pedido:false,foto:false,gerente:false,promocao:false}, pedidoValor:0, obs:"", fotos:[] },
  { id:"L7", name:"Quitanda Gomes",        address:"R. Santo André, 8 — Tatuapé",       lat:-23.5413, lng:-46.5767, seq:7, status:"pendente",   checklist:{estoque:false,gondola:false,pedido:false,foto:false,gerente:false,promocao:false}, pedidoValor:0, obs:"", fotos:[] },
];

const TOP_CLIENTS = [
  { id:101, name:"Grupo Martins",       buyer:"Carlos Andrade", lat:-23.5505, lng:-46.6333, sellIn:{target:120000,achieved:98400},  sellOut:{achieved:87200, share:18.4,ruptura:3.2}, verba:8000,  acoes:["Tablóide Jun","Ponta de gôndola"], nextMeeting:"2025-07-03", status:"negociacao", jbp:72 },
  { id:102, name:"Arcom Distribuidora", buyer:"Marina Lopes",   lat:-23.5280, lng:-46.6450, sellIn:{target:95000, achieved:95100},  sellOut:{achieved:91400, share:22.1,ruptura:0.8}, verba:6500,  acoes:["Display checkout"],              nextMeeting:"2025-07-01", status:"ativo",      jbp:95 },
  { id:103, name:"Rede Top Atacado",    buyer:"Paulo Siqueira", lat:-23.6010, lng:-46.5980, sellIn:{target:110000,achieved:72300},  sellOut:{achieved:61000, share:11.2,ruptura:7.4}, verba:7200,  acoes:[],                               nextMeeting:"2025-06-30", status:"risco",      jbp:38 },
  { id:104, name:"Assaí Atacadista SP", buyer:"Renata Vieira",  lat:-23.5489, lng:-46.6388, sellIn:{target:180000,achieved:165000}, sellOut:{achieved:148000,share:26.3,ruptura:1.1}, verba:15000, acoes:["Ilha dedicada","Mídia in-store"], nextMeeting:"2025-07-08", status:"ativo",      jbp:91 },
  { id:105, name:"Makro Santos",        buyer:"Felipe Correia", lat:-23.9608, lng:-46.3336, sellIn:{target:85000, achieved:68200},  sellOut:{achieved:58900, share:14.7,ruptura:4.5}, verba:5500,  acoes:["Tablóide"],                     nextMeeting:"2025-07-02", status:"atencao",    jbp:55 },
];

const FIELD_TEAM = [
  { userId:2, name:"Ana Paula Costa",  sellerType:"doceiro",       lat:-23.5541, lng:-46.6917, status:"em_visita", local:"Mercado Bom Dia",        lastUpdate:"10:47" },
  { userId:3, name:"Rafael Moura",     sellerType:"representante", lat:-23.5900, lng:-46.6500, status:"em_rota",   local:"Zona Sul — SP",           lastUpdate:"10:32" },
  { userId:4, name:"Camila Torres",    sellerType:"distribuidora", lat:-23.5200, lng:-46.4800, status:"em_visita", local:"Distribuidora Paulista",  lastUpdate:"09:58" },
  { userId:5, name:"Bruno Lima",       sellerType:"key_account",   lat:-23.5613, lng:-46.6560, status:"reuniao",   local:"Grupo Pão de Açúcar HQ", lastUpdate:"09:15" },
  { userId:6, name:"Patrícia Mendes",  sellerType:"hibrido",       lat:-23.5847, lng:-46.6763, status:"em_visita", local:"Empório das Doces",       lastUpdate:"11:02" },
  { userId:1, name:"Lucas Ferreira",   sellerType:"top_atacado",   lat:-23.5489, lng:-46.6388, status:"reuniao",   local:"Assaí Atacadista HQ",    lastUpdate:"08:30" },
];

// ── Storage ──────────────────────────────────────────────────────
const DB_KEY = "cpro_v4";
const SYNC_KEY = "cpro_sync";

function loadDB() {
  try { const r = localStorage.getItem(DB_KEY); if (r) return JSON.parse(r); } catch {}
  const db = { users: SEED_USERS, lojas: DOCEIRO_LOJAS_SEED, nextId: 200 };
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
}
function saveDB(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function addToQueue(action) {
  try {
    const q = JSON.parse(localStorage.getItem(SYNC_KEY) || "[]");
    q.push({ ...action, id: Math.random().toString(36).slice(2), ts: Date.now() });
    localStorage.setItem(SYNC_KEY, JSON.stringify(q));
  } catch {}
}
function getQueueLen() { try { return JSON.parse(localStorage.getItem(SYNC_KEY)||"[]").length; } catch { return 0; } }
function clearQueue() { localStorage.setItem(SYNC_KEY, "[]"); }

// ── Helpers ──────────────────────────────────────────────────────
const fmt  = v => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(v);
const pct  = (a,t) => t>0 ? Math.min(999,Math.round((a/t)*100)) : 0;
const inits = name => name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();

function getSubs(users, userId) {
  const u = users.find(x=>x.id===userId);
  if (!u || u.role==="vendedor") return [];
  if (u.role==="supervisor") return users.filter(x=>x.supervisorId===userId);
  if (u.role==="gerente") {
    const sv=users.filter(x=>x.managerId===userId);
    return [...sv,...sv.flatMap(s=>users.filter(x=>x.supervisorId===s.id))];
  }
  if (u.role==="head") {
    const mg=users.filter(x=>x.headId===userId);
    const sv=mg.flatMap(m=>users.filter(x=>x.managerId===m.id));
    return [...mg,...sv,...sv.flatMap(s=>users.filter(x=>x.supervisorId===s.id))];
  }
  return users.filter(x=>x.id!==userId);
}

function haversine(la1,lo1,la2,lo2) {
  const R=6371e3,f1=la1*Math.PI/180,f2=la2*Math.PI/180,df=(la2-la1)*Math.PI/180,dl=(lo2-lo1)*Math.PI/180;
  const a=Math.sin(df/2)**2+Math.cos(f1)*Math.cos(f2)*Math.sin(dl/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

// ── Geolocation hook ─────────────────────────────────────────────
function useGeo() {
  const [pos,setPos]       = useState(null);
  const [geoErr,setGeoErr] = useState(null);
  const [geoLoading,setGL] = useState(false);
  const ask = useCallback(() => {
    if (!navigator.geolocation) { setGeoErr("GPS não disponível neste dispositivo"); return; }
    setGL(true); setGeoErr(null);
    navigator.geolocation.getCurrentPosition(
      p => { setPos({ lat:p.coords.latitude, lng:p.coords.longitude, acc:Math.round(p.coords.accuracy) }); setGL(false); },
      () => { setGeoErr("Permissão de localização negada"); setGL(false); },
      { enableHighAccuracy:true, timeout:12000 }
    );
  }, []);
  return { pos, geoErr, geoLoading, ask };
}

// ── Camera hook ───────────────────────────────────────────────────
function useCamera(initial=[]) {
  const [photos,setPhotos] = useState(initial);
  function shoot(cb) {
    const inp = document.createElement("input");
    inp.type="file"; inp.accept="image/*"; inp.capture="environment";
    inp.onchange = e => {
      const f = e.target.files[0]; if(!f) return;
      const r = new FileReader();
      r.onload = ev => {
        const p = { id:Date.now(), url:ev.target.result, ts:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}) };
        setPhotos(prev=>[...prev,p]);
        if(cb) cb(p);
      };
      r.readAsDataURL(f);
    };
    inp.click();
  }
  function remove(id) { setPhotos(prev=>prev.filter(p=>p.id!==id)); }
  return { photos, setPhotos, shoot, remove };
}

// ── Leaflet Map ───────────────────────────────────────────────────
function LeafletMap({ pins=[], userPos=null, mode="route", height=260, drawLine=false }) {
  const ref  = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    if (!document.getElementById("lf-css")) {
      const l=document.createElement("link"); l.id="lf-css"; l.rel="stylesheet";
      l.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(l);
    }
    function init() {
      if (!window.L || !ref.current || inst.current) return;
      const L = window.L;
      const allPts = [...pins.map(p=>[p.lat,p.lng]), ...(userPos?[[userPos.lat,userPos.lng]]:[])];
      const center = allPts.length ? allPts[0] : [-23.5505,-46.6333];
      inst.current = L.map(ref.current,{zoomControl:true,attributionControl:false}).setView(center,13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19}).addTo(inst.current);

      if (mode==="route") {
        const statusC = { visitada:"#10B981", em_visita:"#F59E0B", pendente:"#3D5A8A", ativo:"#10B981", negociacao:"#F59E0B", risco:"#EF4444", atencao:"#F97316" };
        pins.forEach((p,i) => {
          const c = statusC[p.status] || "#7B93C4";
          const icon = L.divIcon({ html:`<div style="width:32px;height:32px;border-radius:50%;background:${c};border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;box-shadow:0 2px 8px rgba(0,0,0,0.5)">${p.seq||i+1}</div>`, className:"", iconSize:[32,32], iconAnchor:[16,16] });
          L.marker([p.lat,p.lng],{icon}).addTo(inst.current).bindPopup(`<b>${p.name}</b><br>${p.address||p.buyer||""}`);
        });
        if (drawLine && pins.length>1) {
          L.polyline(pins.map(p=>[p.lat,p.lng]),{color:"#3B82F6",weight:2.5,dashArray:"6 4",opacity:0.7}).addTo(inst.current);
        }
      }
      if (mode==="field") {
        const stC = { top_atacado:C.orange, doceiro:C.pink, representante:C.purple, distribuidora:C.gold, key_account:C.cyan, hibrido:C.green };
        pins.forEach(p => {
          const c = stC[p.sellerType]||C.blue;
          const em = SELLER_TYPES[p.sellerType]?.icon||"👤";
          const icon = L.divIcon({ html:`<div style="width:38px;height:38px;border-radius:50%;background:${c};border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 10px rgba(0,0,0,0.4)">${em}</div>`, className:"", iconSize:[38,38], iconAnchor:[19,19] });
          L.marker([p.lat,p.lng],{icon}).addTo(inst.current).bindPopup(`<b>${p.name}</b><br>${p.local}<br><small>Últ: ${p.lastUpdate}</small>`);
        });
      }
      if (userPos) {
        const ui = L.divIcon({ html:`<div style="width:18px;height:18px;border-radius:50%;background:#3B82F6;border:3px solid white;box-shadow:0 0 0 5px rgba(59,130,246,0.25)"></div>`, className:"", iconSize:[18,18], iconAnchor:[9,9] });
        L.marker([userPos.lat,userPos.lng],{icon:ui}).addTo(inst.current).bindPopup("Você está aqui");
      }
      if (allPts.length>1) { inst.current.fitBounds(L.latLngBounds(allPts),{padding:[24,24]}); }
    }

    if (window.L) { init(); }
    else {
      const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"; s.onload=init; document.head.appendChild(s);
    }
    return () => { if(inst.current){inst.current.remove();inst.current=null;} };
  }, []);

  return <div style={{borderRadius:14,overflow:"hidden",border:`1px solid ${C.navyLight}`,marginBottom:12}}><div ref={ref} style={{height,width:"100%",background:C.navyLight}}/></div>;
}

// ── Geo Checkin ───────────────────────────────────────────────────
function GeoCheckin({ loja, onDone }) {
  const { pos, geoErr, geoLoading, ask } = useGeo();
  const [done,setDone] = useState(false);
  const [dist,setDist] = useState(null);

  useEffect(() => {
    if (!pos || done) return;
    const d = Math.round(haversine(pos.lat,pos.lng,loja.lat,loja.lng));
    setDist(d);
    if (d <= 500) { setDone(true); onDone && onDone(); }
  }, [pos]);

  if (done) return (
    <div style={{background:`${C.green}22`,border:`1px solid ${C.green}44`,borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
      <span style={{fontSize:20}}>✅</span>
      <div><div style={{color:C.green,fontWeight:700,fontSize:13}}>Check-in confirmado</div><div style={{color:C.gray400,fontSize:11}}>Você está no local</div></div>
    </div>
  );

  return (
    <div style={{background:`${C.gold}11`,border:`1px solid ${C.gold}44`,borderRadius:10,padding:"10px 14px",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
        <div>
          <div style={{color:C.gold,fontWeight:700,fontSize:13}}>📍 Check-in necessário</div>
          {dist!==null && dist>500 && <div style={{color:C.orange,fontSize:11,marginTop:2}}>Você está a {dist}m (limite: 500m)</div>}
          {geoErr && <div style={{color:C.red,fontSize:11,marginTop:2}}>{geoErr}</div>}
        </div>
        <button onClick={ask} disabled={geoLoading} style={{background:C.gold,border:"none",borderRadius:8,padding:"8px 14px",color:C.navy,fontWeight:700,fontSize:12,cursor:geoLoading?"wait":"pointer",flexShrink:0}}>
          {geoLoading?"📡 Buscando...":"📍 Check-in"}
        </button>
      </div>
    </div>
  );
}

// ── Photo Gallery ─────────────────────────────────────────────────
function PhotoGallery({ photos, onAdd, onRemove }) {
  return (
    <div>
      <div style={{color:C.gray400,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Fotos do PDV</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {photos.map(p=>(
          <div key={p.id} style={{position:"relative",width:80,height:80}}>
            <img src={p.url} alt="pdv" style={{width:80,height:80,objectFit:"cover",borderRadius:10,border:`2px solid ${C.navyLight}`}}/>
            <button onClick={()=>onRemove(p.id)} style={{position:"absolute",top:2,right:2,background:"rgba(0,0,0,0.75)",border:"none",borderRadius:20,width:20,height:20,color:"white",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            <div style={{position:"absolute",bottom:2,left:2,background:"rgba(0,0,0,0.7)",borderRadius:4,padding:"1px 4px",fontSize:9,color:"white"}}>{p.ts}</div>
          </div>
        ))}
        <button onClick={onAdd} style={{width:80,height:80,border:`2px dashed ${C.gray600}`,borderRadius:10,background:`${C.navyLight}44`,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
          <span style={{fontSize:24}}>📷</span>
          <span style={{color:C.gray400,fontSize:10}}>Adicionar</span>
        </button>
      </div>
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────
const Av  = ({i,color,size=40})=><div style={{width:size,height:size,borderRadius:size/2,background:`linear-gradient(135deg,${color}33,${color}66)`,border:`2px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.3,fontWeight:700,color,flexShrink:0}}>{i}</div>;
const Bar = ({v,m,h=6,color})=>{const p=Math.min(100,m>0?Math.round(v/m*100):0);const bg=color||(p>=100?C.green:p>=70?C.blue:p>=40?C.gold:C.red);return<div style={{background:C.navyLight,borderRadius:99,height:h,overflow:"hidden",width:"100%"}}><div style={{height:"100%",borderRadius:99,width:`${p}%`,background:bg,transition:"width 0.5s"}}/></div>;};
const Box = ({children,s={}})=><div style={{background:C.navyMid,borderRadius:16,padding:16,marginBottom:12,border:`1px solid ${C.navyLight}`,...s}}>{children}</div>;
const Bdg = ({label,color})=><span style={{background:`${color}22`,color,border:`1px solid ${color}44`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{label}</span>;
const Lbl = ({children})=><div style={{color:C.gray400,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>{children}</div>;
const Row = ({label,value,color=C.white})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.navyLight}`}}><div style={{color:C.gray400,fontSize:13}}>{label}</div><div style={{color,fontWeight:700,fontSize:14}}>{value}</div></div>;
const Inp = ({label,value,onChange,type="text",placeholder,error})=><div style={{marginBottom:14}}>{label&&<div style={{color:C.gray400,fontSize:12,fontWeight:600,marginBottom:6}}>{label}</div>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"12px 14px",borderRadius:12,background:C.navyMid,border:`1.5px solid ${error?C.red:C.navyLight}`,color:C.white,fontSize:14,outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=error?C.red:C.navyLight}/>{error&&<div style={{color:C.red,fontSize:12,marginTop:4}}>{error}</div>}</div>;
const Btn = ({children,onClick,variant="primary",disabled=false,full=false})=><button onClick={onClick} disabled={disabled} style={{width:full?"100%":"auto",padding:"13px 20px",borderRadius:13,border:variant==="ghost"?`1px solid ${C.navyLight}`:"none",cursor:disabled?"not-allowed":"pointer",background:disabled?C.navyLight:variant==="primary"?`linear-gradient(135deg,${C.blue},${C.blueLight})`:C.navyLight,color:disabled?C.gray400:C.white,fontWeight:700,fontSize:14,opacity:disabled?0.6:1}}>{children}</button>;

// ── Auth ──────────────────────────────────────────────────────────
function AuthScreen({db,onLogin,onDbChange}) {
  const [mode,setMode]=useState("login");
  return(
    <div style={{minHeight:"100vh",background:C.navy,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 20px 40px",fontFamily:"'Inter',-apple-system,sans-serif"}}>
      <div style={{padding:"44px 0 28px",textAlign:"center"}}>
        <div style={{width:66,height:66,borderRadius:21,background:`linear-gradient(135deg,${C.blue},${C.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 14px",boxShadow:`0 8px 32px ${C.blue}44`}}>📊</div>
        <div style={{fontSize:25,fontWeight:900,color:C.white}}>ComercialPro</div>
        <div style={{fontSize:12,color:C.gray400,marginTop:4}}>Gestão de equipe comercial</div>
      </div>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{display:"flex",background:C.navyMid,borderRadius:12,padding:4,marginBottom:22,border:`1px solid ${C.navyLight}`}}>
          {[["login","Entrar"],["register","Cadastrar"]].map(([m,l])=>(
            <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"9px",borderRadius:9,border:"none",cursor:"pointer",fontWeight:700,fontSize:14,background:mode===m?C.blue:"transparent",color:mode===m?C.white:C.gray400}}>{l}</button>
          ))}
        </div>
        {mode==="login"    && <LoginForm db={db} onLogin={onLogin}/>}
        {mode==="register" && <RegisterForm db={db} onLogin={onLogin} onDbChange={onDbChange}/>}
        <div style={{marginTop:18,borderRadius:12,background:`${C.blue}11`,border:`1px solid ${C.blue}33`,padding:"12px 14px"}}>
          <div style={{color:C.blueLight,fontSize:12,fontWeight:700,marginBottom:8}}>🎯 Contas de demonstração — senha: 123456</div>
          {[["lucas@demo.com","🏭 Top Atacado",C.orange],["ana@demo.com","🍬 Doceiro",C.pink],["rafael@demo.com","🤝 Representante",C.purple],["camila@demo.com","📦 Distribuidora",C.gold],["bruno@demo.com","🔑 Key Account",C.cyan],["patricia@demo.com","⚡ Híbrido",C.green],["marcela@demo.com","Diretora",C.orange]].map(([em,cargo,cor])=>(
            <div key={em} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <span style={{color:C.gray200,fontSize:12}}>{em}</span><Bdg label={cargo} color={cor}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoginForm({db,onLogin}) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState(""); const [busy,setBusy]=useState(false); const [show,setShow]=useState(false);
  function go() {
    setErr(""); if(!email.trim()) return setErr("Informe o e-mail."); if(!pass) return setErr("Informe a senha.");
    setBusy(true);
    setTimeout(()=>{
      const u=db.users.find(u=>u.email.toLowerCase()===email.toLowerCase().trim());
      if(!u){setBusy(false);return setErr("E-mail não encontrado.");}
      if(u.password!==pass){setBusy(false);return setErr("Senha incorreta.");}
      onLogin(u);
    },500);
  }
  return <>
    <Inp label="E-mail" type="email" value={email} onChange={setEmail} placeholder="seu@email.com"/>
    <div style={{marginBottom:14}}>
      <div style={{color:C.gray400,fontSize:12,fontWeight:600,marginBottom:6}}>Senha</div>
      <div style={{position:"relative"}}>
        <input type={show?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••" style={{width:"100%",padding:"12px 44px 12px 14px",borderRadius:12,background:C.navyMid,border:`1.5px solid ${C.navyLight}`,color:C.white,fontSize:14,outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.navyLight}/>
        <button onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.gray400,fontSize:14}}>{show?"🙈":"👁️"}</button>
      </div>
    </div>
    {err&&<div style={{color:C.red,fontSize:13,marginBottom:12,textAlign:"center"}}>{err}</div>}
    <Btn full onClick={go} disabled={busy}>{busy?"Entrando...":"Entrar →"}</Btn>
  </>;
}

function RegisterForm({db,onLogin,onDbChange}) {
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:"",email:"",password:"",confirm:"",role:"vendedor",sellerType:"doceiro",phone:"",target:""});
  const [errs,setErrs]=useState({}); const [busy,setBusy]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  function v1(){const e={};if(form.name.trim().split(" ").length<2)e.name="Nome e sobrenome.";if(!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))e.email="E-mail inválido.";if(db.users.find(u=>u.email.toLowerCase()===form.email.toLowerCase()))e.email="E-mail já cadastrado.";setErrs(e);return!Object.keys(e).length;}
  function v2(){const e={};if(form.password.length<6)e.password="Mínimo 6 caracteres.";if(form.password!==form.confirm)e.confirm="Senhas não conferem.";setErrs(e);return!Object.keys(e).length;}
  function v3(){const e={};if(!form.target||isNaN(+form.target)||+form.target<=0)e.target="Meta inválida.";setErrs(e);return!Object.keys(e).length;}
  function next(){
    if(step===1&&v1())setStep(2);
    if(step===2&&v2())setStep(3);
    if(step===3&&v3()){setBusy(true);setTimeout(()=>{
      const nu={id:db.nextId,name:form.name.trim(),email:form.email.trim().toLowerCase(),password:form.password,role:form.role,sellerType:form.role==="vendedor"?form.sellerType:undefined,avatar:inits(form.name),phone:form.phone,target:+form.target,achieved:0};
      const ndb={...db,users:[...db.users,nu],nextId:db.nextId+1};saveDB(ndb);onDbChange(ndb);onLogin(nu);
    },500);}
  }
  const svs=db.users.filter(u=>u.role==="supervisor");
  return <>
    <div style={{display:"flex",alignItems:"center",marginBottom:18}}>
      {[1,2,3].map((s,i)=>(
        <div key={s} style={{display:"flex",alignItems:"center",flex:i<2?1:"auto"}}>
          <div style={{width:24,height:24,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,background:step>=s?C.blue:C.navyLight,color:step>=s?C.white:C.gray400,flexShrink:0}}>{step>s?"✓":s}</div>
          <div style={{fontSize:11,color:step===s?C.white:C.gray400,marginLeft:5,whiteSpace:"nowrap"}}>{["Dados","Acesso","Cargo"][i]}</div>
          {i<2&&<div style={{flex:1,height:1,background:step>s?C.blue:C.navyLight,margin:"0 8px"}}/>}
        </div>
      ))}
    </div>
    {step===1&&<><Inp label="Nome completo" value={form.name} onChange={v=>set("name",v)} placeholder="João da Silva" error={errs.name}/><Inp label="E-mail" type="email" value={form.email} onChange={v=>set("email",v)} placeholder="joao@empresa.com" error={errs.email}/><Inp label="Telefone" value={form.phone} onChange={v=>set("phone",v)} placeholder="(11) 9 9999-9999"/></>}
    {step===2&&<><Inp label="Senha" type="password" value={form.password} onChange={v=>set("password",v)} placeholder="Mínimo 6 caracteres" error={errs.password}/><Inp label="Confirmar senha" type="password" value={form.confirm} onChange={v=>set("confirm",v)} placeholder="Repita a senha" error={errs.confirm}/></>}
    {step===3&&<>
      <div style={{marginBottom:14}}><div style={{color:C.gray400,fontSize:12,fontWeight:600,marginBottom:8}}>Cargo</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{ROLE_ORDER.map(r=><button key={r} onClick={()=>set("role",r)} style={{padding:"9px 6px",borderRadius:10,border:`1.5px solid ${form.role===r?ROLE_COLORS[r]:C.navyLight}`,background:form.role===r?`${ROLE_COLORS[r]}22`:C.navyMid,color:form.role===r?ROLE_COLORS[r]:C.gray400,cursor:"pointer",fontSize:11,fontWeight:600}}>{ROLE_LABELS[r]}</button>)}</div>
      </div>
      {form.role==="vendedor"&&<div style={{marginBottom:14}}><div style={{color:C.gray400,fontSize:12,fontWeight:600,marginBottom:8}}>Tipo de atuação</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{Object.entries(SELLER_TYPES).map(([k,v])=><button key={k} onClick={()=>set("sellerType",k)} style={{padding:"9px 6px",borderRadius:10,border:`1.5px solid ${form.sellerType===k?v.color:C.navyLight}`,background:form.sellerType===k?`${v.color}22`:C.navyMid,color:form.sellerType===k?v.color:C.gray400,cursor:"pointer",fontSize:11,fontWeight:600,textAlign:"center"}}>{v.icon} {v.label}</button>)}</div>
      </div>}
      {form.role==="vendedor"&&svs.length>0&&<div style={{marginBottom:14}}><div style={{color:C.gray400,fontSize:12,fontWeight:600,marginBottom:6}}>Supervisor</div><select value={form.supervisorId||""} onChange={e=>set("supervisorId",e.target.value)} style={{width:"100%",padding:"12px 14px",borderRadius:12,background:C.navyMid,border:`1.5px solid ${C.navyLight}`,color:C.white,fontSize:14,outline:"none",boxSizing:"border-box"}}><option value="">— Selecione</option>{svs.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>}
      <Inp label="Meta mensal (R$)" type="number" value={form.target} onChange={v=>set("target",v)} placeholder="Ex: 95000" error={errs.target}/>
    </>}
    <div style={{display:"flex",gap:8,marginTop:4}}>{step>1&&<Btn variant="ghost" onClick={()=>setStep(s=>s-1)}>← Voltar</Btn>}<div style={{flex:1}}><Btn full onClick={next} disabled={busy}>{busy?"Criando...":step<3?"Continuar →":"Criar conta →"}</Btn></div></div>
  </>;
}

// ── Doceiro Panel ─────────────────────────────────────────────────
function DocieroPanel({user,db,onDbChange,offline}) {
  const [lojas,setLojas] = useState(db.lojas||DOCEIRO_LOJAS_SEED);
  const [sel,setSel]     = useState(null);
  const [view,setView]   = useState("lista");
  const { pos, geoErr, geoLoading, ask } = useGeo();

  function save(id,data) {
    const nl = lojas.map(l=>l.id===id?{...l,...data}:l);
    setLojas(nl);
    const ndb={...db,lojas:nl}; saveDB(ndb); onDbChange(ndb);
    if(offline) addToQueue({type:"visita",id,data});
    setSel(null);
  }

  if(sel){
    const loja=lojas.find(l=>l.id===sel);
    return <DocieroVisita loja={loja} userPos={pos} offline={offline} onBack={()=>setSel(null)} onSave={save}/>;
  }

  const visitadas=lojas.filter(l=>l.status==="visitada").length;
  const pedidos=lojas.reduce((a,l)=>a+l.pedidoValor,0);
  const done_today=lojas.filter(l=>l.status!=="pendente").length;

  return(
    <div style={{padding:"0 16px 16px"}}>
      <Box>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div><div style={{color:C.gray400,fontSize:12}}>Performance mensal</div><div style={{fontSize:24,fontWeight:900,color:C.white}}>{pct(81200,95000)}<span style={{fontSize:13,color:C.gray400}}>%</span></div></div>
          <Bdg label="🍬 Doceiro" color={C.pink}/>
        </div>
        <Bar v={81200} m={95000} color={C.pink}/>
        <div style={{display:"flex",gap:16,fontSize:12,marginTop:8}}>
          <span><span style={{color:C.gray400}}>Hoje: </span><span style={{color:C.pink,fontWeight:700}}>{visitadas}/{lojas.length} lojas</span></span>
          <span><span style={{color:C.gray400}}>Pedidos: </span><span style={{color:C.green,fontWeight:700}}>{fmt(pedidos)}</span></span>
        </div>
      </Box>

      <div style={{display:"flex",background:C.navyMid,borderRadius:10,padding:3,marginBottom:12,border:`1px solid ${C.navyLight}`}}>
        {[["lista","📋 Lista"],["mapa","🗺️ Mapa"]].map(([v,l])=>(
          <button key={v} onClick={()=>{setView(v);if(v==="mapa")ask();}} style={{flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",background:view===v?C.blue:"transparent",color:view===v?C.white:C.gray400,fontWeight:700,fontSize:13}}>{l}</button>
        ))}
      </div>

      {view==="mapa"&&<LeafletMap pins={lojas} userPos={pos} mode="route" drawLine={true} height={300}/>}

      <button onClick={ask} disabled={geoLoading} style={{width:"100%",padding:"10px",borderRadius:10,border:`1px solid ${C.navyLight}`,background:C.navyMid,color:pos?C.green:C.gray400,cursor:"pointer",fontSize:12,fontWeight:600,marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        {geoLoading?"📡 Buscando localização...":pos?`📍 Localizado (±${pos.acc}m)`:"📡 Ativar GPS"}
      </button>
      {geoErr&&<div style={{color:C.red,fontSize:12,marginBottom:10,textAlign:"center"}}>{geoErr}</div>}

      <Lbl>Roteiro de hoje — {new Date().toLocaleDateString("pt-BR")}</Lbl>
      {lojas.map(loja=>{
        const dk=Object.values(loja.checklist).filter(Boolean).length;
        const tot=Object.values(loja.checklist).length;
        const sc={visitada:C.green,em_visita:C.gold,pendente:C.gray600}[loja.status];
        const sl={visitada:"✓ Visitada",em_visita:"▶ Em visita",pendente:"⏳ Pendente"}[loja.status];
        return(
          <div key={loja.id} onClick={()=>setSel(loja.id)} style={{display:"flex",alignItems:"center",gap:12,background:C.navyMid,borderRadius:14,padding:13,marginBottom:9,border:`1.5px solid ${loja.status==="em_visita"?C.gold:C.navyLight}`,cursor:"pointer"}}>
            <div style={{width:32,height:32,borderRadius:16,background:`${sc}22`,border:`2px solid ${sc}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:sc,flexShrink:0}}>{loja.seq}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{color:C.white,fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,paddingRight:8}}>{loja.name}</div>
                <Bdg label={sl} color={sc}/>
              </div>
              <div style={{color:C.gray400,fontSize:11,marginTop:2}}>{loja.address}</div>
              {loja.status!=="pendente"&&<div style={{marginTop:6}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.gray400,marginBottom:3}}>
                  <span>Checklist {dk}/{tot}</span>
                  {loja.pedidoValor>0&&<span style={{color:C.green}}>{fmt(loja.pedidoValor)}</span>}
                  {loja.fotos&&loja.fotos.length>0&&<span style={{color:C.pink}}>📷 {loja.fotos.length}</span>}
                </div>
                <Bar v={dk} m={tot} color={C.pink} h={4}/>
              </div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DocieroVisita({loja,onBack,onSave,userPos,offline}) {
  const STEPS=[
    {key:"estoque", icon:"📦", label:"Verificar estoque / ruptura"},
    {key:"gondola", icon:"🛒", label:"Execução de gôndola"},
    {key:"pedido",  icon:"📝", label:"Registro de pedido"},
    {key:"foto",    icon:"📷", label:"Fotos de ponto de venda"},
    {key:"promocao",icon:"🎯", label:"Ações promocionais ativas"},
    {key:"gerente", icon:"🤝", label:"Conversa com gerente da loja"},
  ];
  const [checks,setChecks]=useState({...loja.checklist});
  const [pedido,setPedido]=useState(String(loja.pedidoValor||""));
  const [obs,setObs]=useState(loja.obs||"");
  const [checkinOk,setCheckinOk]=useState(loja.status==="visitada");
  const { photos, setPhotos, shoot, remove } = useCamera(loja.fotos||[]);
  const dk=Object.values(checks).filter(Boolean).length;
  const allDone=dk===STEPS.length;

  function toggle(k) {
    if(k==="foto") { shoot(p=>setChecks(c=>({...c,foto:true}))); return; }
    setChecks(c=>({...c,[k]:!c[k]}));
  }
  function nav() { window.open(`https://www.google.com/maps/dir/?api=1&destination=${loja.lat},${loja.lng}&travelmode=driving`,"_blank"); }
  function salvar() { onSave(loja.id,{checklist:checks,pedidoValor:+pedido||0,obs,fotos:photos,status:allDone?"visitada":dk>0?"em_visita":"pendente"}); }

  return(
    <div style={{padding:"0 16px 16px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:C.blueLight,cursor:"pointer",fontSize:14,fontWeight:600,marginBottom:12,padding:0}}>← Roteiro</button>
      <div style={{marginBottom:12}}>
        <div style={{color:C.white,fontSize:18,fontWeight:800}}>{loja.name}</div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
          <div style={{color:C.gray400,fontSize:12,flex:1}}>{loja.address}</div>
          <button onClick={nav} style={{background:C.blue,border:"none",borderRadius:6,padding:"4px 10px",color:C.white,cursor:"pointer",fontSize:11,fontWeight:700,flexShrink:0}}>🗺️ Navegar</button>
        </div>
      </div>

      <LeafletMap pins={[{...loja,seq:loja.seq,status:loja.status,address:loja.address}]} userPos={userPos} mode="route" height={150}/>

      {!checkinOk&&<GeoCheckin loja={loja} onDone={()=>setCheckinOk(true)}/>}
      {checkinOk&&<div style={{background:`${C.green}22`,border:`1px solid ${C.green}44`,borderRadius:10,padding:"8px 14px",display:"flex",alignItems:"center",gap:8,marginBottom:12}}><span>✅</span><span style={{color:C.green,fontSize:13,fontWeight:700}}>Check-in confirmado</span></div>}
      {offline&&<div style={{background:`${C.orange}22`,border:`1px solid ${C.orange}44`,borderRadius:10,padding:"8px 14px",marginBottom:12,color:C.orange,fontSize:12}}>📵 Offline — dados salvos localmente</div>}

      <Box>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <Lbl>Checklist da visita</Lbl>
          <span style={{color:allDone?C.green:C.gold,fontSize:13,fontWeight:700}}>{dk}/{STEPS.length}</span>
        </div>
        <Bar v={dk} m={STEPS.length} color={C.pink} h={8}/>
        <div style={{marginTop:14}}>
          {STEPS.map(item=>(
            <div key={item.key} onClick={()=>toggle(item.key)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.navyLight}`,cursor:"pointer"}}>
              <div style={{width:26,height:26,borderRadius:8,background:checks[item.key]?C.green:C.navyLight,border:`2px solid ${checks[item.key]?C.green:C.gray600}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
                {checks[item.key]&&<span style={{color:C.white,fontSize:13,fontWeight:800}}>✓</span>}
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:checks[item.key]?C.white:C.gray400}}>{item.icon} {item.label}</div>
                {item.key==="foto"&&<div style={{fontSize:11,color:C.gray600,marginTop:1}}>Toque para abrir câmera</div>}
              </div>
            </div>
          ))}
        </div>
      </Box>

      <Box><PhotoGallery photos={photos} onAdd={()=>shoot()} onRemove={remove}/></Box>

      <Box><Lbl>Pedido</Lbl><Inp label="Valor (R$)" type="number" value={pedido} onChange={setPedido} placeholder="0"/></Box>

      <Box><Lbl>Observações</Lbl><textarea value={obs} onChange={e=>setObs(e.target.value)} placeholder="Ruptura, oportunidade, problema..." style={{width:"100%",background:C.navyLight,border:"none",borderRadius:10,padding:"10px 12px",color:C.white,fontSize:13,minHeight:70,resize:"vertical",outline:"none",boxSizing:"border-box"}}/></Box>

      <Btn full onClick={salvar}>{allDone?"✓ Concluir visita":"💾 Salvar progresso"}</Btn>
    </div>
  );
}

// ── Top Atacado Client Detail ─────────────────────────────────────
function TopAtacadoDetail({client, pos, ask, photos, onAddPhoto, onRemovePhoto, onBack}) {
  const { shoot } = useCamera();
  function handleAddPhoto() { shoot(p => onAddPhoto(client.id, p)); }
  return(
    <div style={{padding:"0 16px 16px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:C.blueLight,cursor:"pointer",fontSize:14,fontWeight:600,marginBottom:12,padding:0}}>← Base de contas</button>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div><div style={{color:C.white,fontSize:18,fontWeight:800}}>{client.name}</div><div style={{color:C.gray400,fontSize:13}}>{client.buyer}</div></div>
        <Bdg label={{ativo:"✓ Ativo",negociacao:"⚡ Negociando",risco:"⚠ Risco",atencao:"👀 Atenção"}[client.status]} color={{ativo:C.green,negociacao:C.gold,risco:C.red,atencao:C.orange}[client.status]}/>
      </div>
      <LeafletMap pins={[{...client,seq:1,address:client.buyer,status:client.status}]} userPos={pos} mode="route" height={160}/>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <button onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${client.lat},${client.lng}`,"_blank")} style={{flex:1,padding:"9px",borderRadius:10,border:`1px solid ${C.navyLight}`,background:C.navyMid,color:C.blueLight,cursor:"pointer",fontSize:12,fontWeight:600}}>🗺️ Navegar</button>
        <button onClick={ask} style={{flex:1,padding:"9px",borderRadius:10,border:`1px solid ${C.navyLight}`,background:C.navyMid,color:pos?C.green:C.gray400,cursor:"pointer",fontSize:12,fontWeight:600}}>{pos?"📍 Localizado":"📡 Localização"}</button>
      </div>
      <Box>
        <Lbl>Métricas de negociação</Lbl>
        <Row label="Sell-in"       value={fmt(client.sellIn.achieved)} color={C.blue}/>
        <Row label="Meta sell-in"  value={fmt(client.sellIn.target)}/>
        <Row label="Sell-out"      value={fmt(client.sellOut.achieved)} color={C.cyan}/>
        <Row label="Share gôndola" value={`${client.sellOut.share}%`}  color={C.gold}/>
        <Row label="Ruptura"       value={`${client.sellOut.ruptura}%`} color={client.sellOut.ruptura>4?C.red:C.green}/>
        <Row label="Verba"         value={fmt(client.verba)}            color={C.gold}/>
        <Row label="JBP"           value={`${client.jbp}%`}            color={client.jbp>=70?C.green:C.orange}/>
        <Row label="Próx. reunião" value={client.nextMeeting}           color={C.blueLight}/>
      </Box>
      <Box><PhotoGallery photos={photos} onAdd={handleAddPhoto} onRemove={id=>onRemovePhoto(client.id,id)}/></Box>
    </div>
  );
}

// ── Top Atacado Panel ─────────────────────────────────────────────
function TopAtacadoPanel({user}) {
  const [sel,setSel]=useState(null);
  const [mapView,setMapView]=useState(false);
  const { pos, ask } = useGeo();
  const [clientPhotos,setClientPhotos]=useState({});

  const totalSI=TOP_CLIENTS.reduce((a,c)=>a+c.sellIn.achieved,0);
  const totalT=TOP_CLIENTS.reduce((a,c)=>a+c.sellIn.target,0);
  const selC=sel?TOP_CLIENTS.find(c=>c.id===sel):null;

  function addPhoto(clientId, photo) { setClientPhotos(prev=>({...prev,[clientId]:[...(prev[clientId]||[]),photo]})); }
  function removePhoto(clientId, id) { setClientPhotos(prev=>({...prev,[clientId]:(prev[clientId]||[]).filter(p=>p.id!==id)})); }

  if(selC) return <TopAtacadoDetail client={selC} pos={pos} ask={ask} photos={clientPhotos[selC.id]||[]} onAddPhoto={addPhoto} onRemovePhoto={removePhoto} onBack={()=>setSel(null)}/>;

  return(
    <div style={{padding:"0 16px 16px"}}>
      <Box>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div><div style={{color:C.gray400,fontSize:12}}>Performance — Junho</div><div style={{fontSize:24,fontWeight:900,color:C.white}}>{pct(totalSI,totalT)}<span style={{fontSize:13,color:C.gray400}}>%</span></div></div>
          <Bdg label="🏭 Top Atacado" color={C.orange}/>
        </div>
        <Bar v={totalSI} m={totalT}/>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.gray400,marginTop:8}}><span>{fmt(totalSI)}</span><span>Meta: {fmt(totalT)}</span></div>
      </Box>
      <div style={{display:"flex",background:C.navyMid,borderRadius:10,padding:3,marginBottom:12,border:`1px solid ${C.navyLight}`}}>
        {[["lista","📋 Lista"],["mapa","🗺️ Mapa contas"]].map(([v,l])=>(
          <button key={v} onClick={()=>{setMapView(v==="mapa");if(v==="mapa")ask();}} style={{flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",background:(!mapView&&v==="lista")||(mapView&&v==="mapa")?C.blue:"transparent",color:(!mapView&&v==="lista")||(mapView&&v==="mapa")?C.white:C.gray400,fontWeight:700,fontSize:13}}>{l}</button>
        ))}
      </div>
      {mapView&&<LeafletMap pins={TOP_CLIENTS.map((c,i)=>({...c,seq:i+1,address:c.buyer}))} userPos={pos} mode="route" height={280}/>}
      {!mapView&&TOP_CLIENTS.map(cl=>{
        const p=pct(cl.sellIn.achieved,cl.sellIn.target);
        const sc={ativo:C.green,negociacao:C.gold,risco:C.red,atencao:C.orange}[cl.status];
        return(
          <Box key={cl.id} s={{cursor:"pointer"}} >
            <div onClick={()=>setSel(cl.id)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div><div style={{color:C.white,fontWeight:700,fontSize:15}}>{cl.name}</div><div style={{color:C.gray400,fontSize:12}}>{cl.buyer}</div></div>
                <div style={{color:p>=100?C.green:p>=70?C.blueLight:C.gold,fontWeight:800,fontSize:18}}>{p}%</div>
              </div>
              <Bar v={cl.sellIn.achieved} m={cl.sellIn.target}/>
              <div style={{display:"flex",gap:14,fontSize:12,marginTop:8}}>
                <span><span style={{color:C.gray400}}>SO: </span><span style={{color:C.cyan}}>{fmt(cl.sellOut.achieved)}</span></span>
                <span><span style={{color:C.gray400}}>Share: </span><span style={{color:C.gold}}>{cl.sellOut.share}%</span></span>
                <span><span style={{color:C.gray400}}>Ruptura: </span><span style={{color:cl.sellOut.ruptura>4?C.red:C.green}}>{cl.sellOut.ruptura}%</span></span>
              </div>
              <div style={{marginTop:8}}><Bdg label={{ativo:"✓ Ativo",negociacao:"⚡ Negociando",risco:"⚠ Risco",atencao:"👀 Atenção"}[cl.status]} color={sc}/></div>
            </div>
          </Box>
        );
      })}
    </div>
  );
}

// ── Field Map (Gestor) ────────────────────────────────────────────
function FieldMapScreen({user,db}) {
  const {pos,ask}=useGeo();
  const [filter,setFilter]=useState("todos");
  const subs=getSubs(db.users,user.id);
  const visIds=new Set([user.id,...subs.map(s=>s.id)]);
  const team=FIELD_TEAM.filter(f=>visIds.has(f.userId));
  const filtered=filter==="todos"?team:team.filter(f=>f.status===filter);
  const sC={em_visita:C.green,em_rota:C.blueLight,reuniao:C.gold};
  const sL={em_visita:"📍 Em visita",em_rota:"🚗 Em rota",reuniao:"🤝 Reunião"};

  return(
    <div style={{padding:"0 16px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{color:C.white,fontWeight:700,fontSize:16}}>Equipe em campo</div>
        <button onClick={ask} style={{background:C.navyMid,border:`1px solid ${C.navyLight}`,borderRadius:8,padding:"6px 12px",color:pos?C.green:C.gray400,cursor:"pointer",fontSize:12}}>{pos?"📍 Localizado":"📡 Minha posição"}</button>
      </div>
      <LeafletMap pins={filtered} userPos={pos} mode="field" height={290}/>
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto"}}>
        {[["todos","Todos"],["em_visita","Em visita"],["em_rota","Em rota"],["reuniao","Reunião"]].map(([f,l])=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 12px",borderRadius:20,border:"none",cursor:"pointer",background:filter===f?C.blue:C.navyMid,color:filter===f?C.white:C.gray400,fontSize:12,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>{l}</button>
        ))}
      </div>
      {filtered.map(m=>{
        const st=SELLER_TYPES[m.sellerType];
        return(
          <Box key={m.userId}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:42,height:42,borderRadius:21,background:`${st?.color||C.blue}22`,border:`2px solid ${st?.color||C.blue}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{st?.icon||"👤"}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{color:C.white,fontWeight:700,fontSize:14}}>{m.name}</div>
                  <Bdg label={sL[m.status]} color={sC[m.status]}/>
                </div>
                <div style={{color:C.gray400,fontSize:12,marginTop:2}}>{m.local}</div>
                <div style={{display:"flex",gap:8,marginTop:4,alignItems:"center"}}>
                  {st&&<Bdg label={`${st.icon} ${st.label}`} color={st.color}/>}
                  <span style={{color:C.gray400,fontSize:11}}>Últ: {m.lastUpdate}</span>
                </div>
              </div>
            </div>
          </Box>
        );
      })}
    </div>
  );
}

// ── Generic seller panel ──────────────────────────────────────────
function GenericPanel({user}) {
  const st=SELLER_TYPES[user.sellerType];
  return(
    <div style={{padding:"0 16px 16px"}}>
      <Box>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div><div style={{color:C.gray400,fontSize:12}}>Performance — Junho</div><div style={{fontSize:24,fontWeight:900,color:C.white}}>{pct(user.achieved,user.target)}<span style={{fontSize:13,color:C.gray400}}>%</span></div></div>
          <Bdg label={`${st?.icon} ${st?.label}`} color={st?.color||C.blue}/>
        </div>
        <Bar v={user.achieved} m={user.target}/>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.gray400,marginTop:8}}><span>{fmt(user.achieved)}</span><span>Meta: {fmt(user.target)}</span></div>
      </Box>
      <Box>
        <Lbl>Recursos ativos neste painel</Lbl>
        {["📍 Geolocalização e check-in por proximidade (500m)","📷 Câmera para fotos do PDV","🗺️ Mapa interativo de clientes/roteiro","📵 Modo offline com fila de sincronização","📊 Métricas personalizadas do perfil"].map((f,i)=>(
          <div key={i} style={{padding:"9px 0",borderBottom:`1px solid ${C.navyLight}`,color:C.gray200,fontSize:13}}>{f}</div>
        ))}
      </Box>
    </div>
  );
}

// ── Gestor Dashboard ──────────────────────────────────────────────
function GestorDashboard({user,db}) {
  const subs=getSubs(db.users,user.id);
  const vis=[user.id,...subs.map(s=>s.id)];
  const vends=db.users.filter(u=>u.role==="vendedor"&&vis.includes(u.id));
  const tot=vends.reduce((a,v)=>a+v.target,0)||1;
  const ach=vends.reduce((a,v)=>a+v.achieved,0);
  const myP=pct(user.achieved||ach,user.target||tot);
  let dr=[];
  if(user.role==="supervisor")dr=db.users.filter(u=>u.supervisorId===user.id);
  if(user.role==="gerente")   dr=db.users.filter(u=>u.managerId===user.id);
  if(user.role==="head")      dr=db.users.filter(u=>u.headId===user.id);
  if(user.role==="diretor")   dr=db.users.filter(u=>u.role==="head");
  return(
    <div style={{padding:"0 16px 16px"}}>
      <Box>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div><div style={{color:C.gray400,fontSize:12}}>Performance — Junho</div><div style={{fontSize:26,fontWeight:900,color:C.white}}>{myP}<span style={{fontSize:14,color:C.gray400}}>%</span></div></div>
          <div style={{background:myP>=100?`${C.green}22`:`${C.gold}22`,color:myP>=100?C.green:C.gold,border:"1px solid currentColor",borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:700}}>{myP>=100?"🏆 Meta batida":"📈 Em progresso"}</div>
        </div>
        <Bar v={user.achieved||ach} m={user.target||tot}/>
      </Box>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <Box s={{marginBottom:0}}><div style={{fontSize:18,marginBottom:4}}>👥</div><div style={{fontSize:20,fontWeight:800,color:C.green}}>{vends.length}</div><div style={{fontRize:11,color:C.gray400}}>Vendedores</div></Box>
        <Box s={{marginBottom:0}}><div style={{fontSize:18,marginBottom:4}}>🏆</div><div style={{fontSize:20,fontWeight:800,color:C.blueLight}}>{vends.filter(v=>pct(v.achieved,v.target)>=100).length}</div><div style={{fontSize:11,color:C.gray400}}>Bateram meta</div></Box>
      </div>
      {dr.length>0&&<Box>
        <Lbl>Equipe direta</Lbl>
        {dr.map(m=>{
          const p=pct(m.achieved||0,m.target||1); const st=m.sellerType?SELLER_TYPES[m.sellerType]:null;
          return(
            <div key={m.id} style={{marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <Av i={m.avatar} color={ROLE_COLORS[m.role]} size={32}/>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><div style={{color:C.white,fontSize:13,fontWeight:600}}>{m.name}</div>{st&&<Bdg label={`${st.icon} ${st.label}`} color={st.color}/>}</div>
                    <div style={{color:p>=100?C.green:p>=70?C.blueLight:C.gold,fontWeight:700}}>{p}%</div>
                  </div>
                </div>
              </div>
              <Bar v={m.achieved||0} m={m.target||1}/>
            </div>
          );
        })}
      </Box>}
    </div>
  );
}

function MetasScreen({user,db}) {
  const subs=getSubs(db.users,user.id);
  const vis=[user.id,...subs.map(s=>s.id)];
  const grouped={};
  db.users.filter(u=>vis.includes(u.id)&&u.role!=="diretor").forEach(u=>{if(!grouped[u.role])grouped[u.role]=[];grouped[u.role].push(u);});
  return(
    <div style={{padding:"0 16px 16px"}}>
      {["vendedor","supervisor","gerente","head"].filter(r=>grouped[r]).map(role=>(
        <div key={role} style={{marginBottom:20}}>
          <div style={{color:ROLE_COLORS[role],fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>{ROLE_LABELS[role]}S</div>
          {grouped[role].map(m=>{
            const p=pct(m.achieved,m.target); const st=m.sellerType?SELLER_TYPES[m.sellerType]:null;
            return(
              <Box key={m.id}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <Av i={m.avatar} color={ROLE_COLORS[m.role]} size={38}/>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><div style={{color:C.white,fontWeight:700}}>{m.name}</div>{st&&<Bdg label={`${st.icon} ${st.label}`} color={st.color}/>}</div>
                    <div style={{color:C.gray400,fontSize:12}}>{ROLE_LABELS[m.role]}</div>
                  </div>
                  <div style={{fontSize:20,fontWeight:900,color:p>=100?C.green:p>=70?C.blueLight:p>=40?C.gold:C.red}}>{p}%</div>
                </div>
                <Bar v={m.achieved} m={m.target} h={7}/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:12}}>
                  <div><div style={{color:C.gray400}}>Realizado</div><div style={{color:C.green,fontWeight:700}}>{fmt(m.achieved)}</div></div>
                  <div style={{textAlign:"center"}}><div style={{color:C.gray400}}>Meta</div><div style={{color:C.white,fontWeight:700}}>{fmt(m.target)}</div></div>
                  <div style={{textAlign:"right"}}><div style={{color:C.gray400}}>{m.target-m.achieved>0?"Faltam":"Superado"}</div><div style={{color:m.target-m.achieved>0?C.orange:C.green,fontWeight:700}}>{fmt(Math.abs(m.target-m.achieved))}</div></div>
                </div>
              </Box>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function RelatoriosScreen({user,db}) {
  const subs=getSubs(db.users,user.id);
  const vis=[user.id,...subs.map(s=>s.id)];
  const vends=db.users.filter(u=>u.role==="vendedor"&&vis.includes(u.id));
  const tot=vends.reduce((a,v)=>a+v.target,0)||1;
  const ach=vends.reduce((a,v)=>a+v.achieved,0);
  const ranking=vends.map(v=>({...v,p:pct(v.achieved,v.target)})).sort((a,b)=>b.p-a.p);
  return(
    <div style={{padding:"0 16px 16px"}}>
      <Box>
        <Lbl>Resumo consolidado</Lbl>
        <Row label="Meta total"    value={fmt(tot)}/>
        <Row label="Realizado"     value={fmt(ach)}              color={C.green}/>
        <Row label="Atingimento"   value={`${pct(ach,tot)}%`}   color={ach>=tot?C.green:C.gold}/>
        <Row label="Vendedores"    value={vends.length}/>
        <Row label="Bateram meta"  value={vends.filter(v=>pct(v.achieved,v.target)>=100).length} color={C.green}/>
      </Box>
      {ranking.length>0&&<Box>
        <Lbl>🏆 Ranking de vendedores</Lbl>
        {ranking.map((v,i)=>{
          const st=v.sellerType?SELLER_TYPES[v.sellerType]:null;
          return(
            <div key={v.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:26,height:26,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,background:i===0?`${C.gold}33`:i===1?`${C.gray400}22`:`${C.orange}22`,color:i===0?C.gold:i===1?C.gray200:C.orange}}>{i+1}</div>
              <Av i={v.avatar} color={C.cyan} size={30}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{color:C.white,fontSize:13,fontWeight:600}}>{v.name}</div>{st&&<Bdg label={`${st.icon} ${st.label}`} color={st.color}/>}</div>
                  <div style={{color:v.p>=100?C.green:v.p>=70?C.blueLight:C.gold,fontWeight:700}}>{v.p}%</div>
                </div>
                <Bar v={v.achieved} m={v.target}/>
              </div>
            </div>
          );
        })}
      </Box>}
    </div>
  );
}

// ── Offline banner ────────────────────────────────────────────────
function OfflineBanner({offline,pending}) {
  if(!offline&&pending===0) return null;
  return(
    <div style={{background:offline?`${C.orange}22`:`${C.green}22`,border:`1px solid ${offline?C.orange:C.green}`,borderRadius:10,padding:"8px 16px",margin:"0 16px 10px",display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:16}}>{offline?"📵":"✅"}</span>
      <div>
        <div style={{color:offline?C.orange:C.green,fontWeight:700,fontSize:12}}>{offline?"Modo offline":"Conexão restaurada"}</div>
        {pending>0&&<div style={{color:C.gray400,fontSize:11}}>{pending} ação(ões) aguardando sincronização</div>}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────
export default function App() {
  const [db,setDb]     = useState(null);
  const [user,setUser] = useState(null);
  const [tab,setTab]   = useState("dashboard");
  const [offline,setOffline] = useState(!navigator.onLine);
  const [pending,setPending] = useState(0);

  useEffect(()=>setDb(loadDB()),[]);
  useEffect(()=>{
    const on=()=>{ setOffline(false); setTimeout(()=>{clearQueue();setPending(0);},2000); };
    const off=()=>setOffline(true);
    window.addEventListener("online",on);
    window.addEventListener("offline",off);
    const t=setInterval(()=>setPending(getQueueLen()),3000);
    return()=>{window.removeEventListener("online",on);window.removeEventListener("offline",off);clearInterval(t);};
  },[]);

  if(!db) return <div style={{background:C.navy,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:C.gray400,fontFamily:"Inter,sans-serif"}}>Carregando...</div>;
  if(!user) return <AuthScreen db={db} onLogin={u=>{setUser(u);setTab(u.role==="vendedor"?"painel":"dashboard");}} onDbChange={setDb}/>;

  const isV=user.role==="vendedor";
  const st=user.sellerType?SELLER_TYPES[user.sellerType]:null;
  const rc=ROLE_COLORS[user.role];

  const tabs=isV
    ?[{id:"painel",label:"Painel",icon:st?.icon||"📊"},{id:"metas",label:"Metas",icon:"🎯"},{id:"relatorio",label:"Relatório",icon:"📈"}]
    :[{id:"dashboard",label:"Início",icon:"🏠"},{id:"campo",label:"Campo",icon:"🗺️"},{id:"metas",label:"Metas",icon:"🎯"},{id:"relatorio",label:"Relatórios",icon:"📊"}];

  return(
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:C.navy,fontFamily:"'Inter',-apple-system,sans-serif",display:"flex",flexDirection:"column"}}>
      <div style={{background:C.navyMid,borderBottom:`1px solid ${C.navyLight}`,padding:"14px 16px 10px",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Av i={user.avatar} color={rc} size={36}/>
            <div>
              <div style={{color:C.white,fontWeight:700,fontSize:14}}>{user.name.split(" ")[0]}</div>
              <div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap"}}>
                <Bdg label={ROLE_LABELS[user.role]} color={rc}/>
                {st&&<Bdg label={`${st.icon} ${st.label}`} color={st.color}/>}
                {offline&&<Bdg label="📵 Offline" color={C.orange}/>}
              </div>
            </div>
          </div>
          <button onClick={()=>setUser(null)} style={{background:C.navyLight,border:"none",borderRadius:8,padding:"5px 10px",color:C.gray400,cursor:"pointer",fontSize:11}}>Sair</button>
        </div>
        <div style={{display:"flex",gap:4,marginTop:10,overflowX:"auto",paddingBottom:2}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:20,border:"none",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,background:tab===t.id?C.blue:"transparent",color:tab===t.id?C.white:C.gray400,fontSize:12,fontWeight:tab===t.id?700:400}}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      <div style={{paddingTop:10}}>
        <OfflineBanner offline={offline} pending={pending}/>
      </div>

      <div style={{flex:1,overflowY:"auto"}}>
        {isV&&tab==="painel"&&user.sellerType==="top_atacado"&&<TopAtacadoPanel user={user}/>}
        {isV&&tab==="painel"&&user.sellerType==="doceiro"     &&<DocieroPanel user={user} db={db} onDbChange={setDb} offline={offline}/>}
        {isV&&tab==="painel"&&!["top_atacado","doceiro"].includes(user.sellerType)&&<GenericPanel user={user}/>}
        {tab==="metas"    &&<MetasScreen    user={user} db={db}/>}
        {tab==="relatorio"&&<RelatoriosScreen user={user} db={db}/>}
        {!isV&&tab==="dashboard"&&<GestorDashboard user={user} db={db}/>}
        {!isV&&tab==="campo"    &&<FieldMapScreen  user={user} db={db}/>}
      </div>
    </div>
  );
}
