import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

// ─── PALETTE VIOLET TECH PREMIUM ─────────────────────────────────────────────
const PRI = "#7C3AED";      // violet principal
const PRI2 = "#9F67FF";     // violet clair
const ACC = "#06B6D4";      // cyan accent
const DARK = "#F8F7FF";     // fond clair
const CARD = "#FFFFFF";     // carte blanche
const CARD2 = "#F3F0FF";    // carte lavande très légère
const BORDER = "#E8E0FF";   // bordure lavande
const MUTED = "#9585B4";    // texte secondaire
const TEXT = "#1A0F3A";     // texte principal
const GREEN = "#10B981";
const RED = "#EF4444";
const ORANGE = "#F59E0B";

// ─── DATA ────────────────────────────────────────────────────────────────────
const caHisto = [
  {m:"Jun 23",v:2800},{m:"Sep 23",v:3200},{m:"Déc 23",v:5900},
  {m:"Mar 24",v:3700},{m:"Jun 24",v:5100},{m:"Sep 24",v:4600},
  {m:"Déc 24",v:7200},{m:"Mar 25",v:4500},{m:"Jun 25",v:7400},
];
const projData = [
  {m:"Jul",s:6800,r:7800,o:9200},{m:"Aoû",s:6500,r:8200,o:10100},
  {m:"Sep",s:7200,r:8800,o:11200},{m:"Oct",s:7800,r:9500,o:12400},
  {m:"Nov",s:8100,r:10200,o:13800},{m:"Déc",s:9500,r:12000,o:16000},
];
const cmdsJour = [
  {j:"Lun",n:4},{j:"Mar",n:7},{j:"Mer",n:5},
  {j:"Jeu",n:9},{j:"Ven",n:12},{j:"Sam",n:15},{j:"Dim",n:8},
];
const cotisations = [
  {name:"URSSAF",value:580,color:PRI},
  {name:"CFE",value:200,color:PRI2},
  {name:"Impôts",value:320,color:ACC},
  {name:"Autres",value:150,color:"#C4B5FD"},
];
const charges = [
  {cat:"Matières",val:980},{cat:"Emballages",val:340},
  {cat:"Loyer",val:450},{cat:"Transport",val:180},{cat:"Matériel",val:150},
];
const commandes = [
  {id:"CMD-042",client:"Marie Dupont",gateau:"Wedding Cake 5 étages",date:"02/06",statut:"En production",montant:650,zone:"Nord"},
  {id:"CMD-043",client:"Sophie Martin",gateau:"Anniversaire Peppa Pig",date:"03/06",statut:"Confirmée",montant:180,zone:"Sud"},
  {id:"CMD-044",client:"Jean Koszuk",gateau:"Naked Cake Champêtre",date:"05/06",statut:"Payée",montant:320,zone:"Est"},
  {id:"CMD-045",client:"Yasmine N.",gateau:"Cupcakes x24 Licorne",date:"07/06",statut:"En attente",montant:140,zone:"Ouest"},
  {id:"CMD-046",client:"Aurelie A.",gateau:"Gâteau Bébé Shower",date:"08/06",statut:"Confirmée",montant:280,zone:"Centre"},
];
const employes = [
  {nom:"Thomas R.",poste:"Pâtissier chef",arrivee:"07:32",depart:null,taches:3,done:2,statut:"En cours"},
  {nom:"Léa M.",poste:"Décoratrice",arrivee:"08:15",depart:null,taches:4,done:4,statut:"Terminé"},
  {nom:"Kevin D.",poste:"Livreur",arrivee:"09:00",depart:"14:30",taches:5,done:5,statut:"Parti"},
];
const livraisons = [
  {id:"LIV-018",client:"Marie Dupont",adresse:"12 rue des Fleurs, Nord",heure:"10:00",statut:"Planifiée",montant:650},
  {id:"LIV-019",client:"Jean Koszuk",adresse:"58 av. des Acacias, Est",heure:"14:30",statut:"En route",montant:320},
  {id:"LIV-020",client:"Aurelie A.",adresse:"3 impasse du Moulin, Centre",heure:"16:00",statut:"Planifiée",montant:280},
];
const notifs = [
  {icon:"💳",msg:"Paiement reçu — Marie Dupont 325€",time:"12 min",ok:true},
  {icon:"📦",msg:"Nouvelle commande — Camille B. Wedding Cake",time:"28 min",ok:true},
  {icon:"⚠️",msg:"Relance envoyée — Yasmine N. acompte en attente",time:"1h",ok:false},
  {icon:"✅",msg:"Livraison confirmée — Jean Koszuk",time:"2h",ok:true},
];
const echeances = [
  {date:"15 Jul",label:"URSSAF T2",montant:580,urgent:true},
  {date:"01 Sep",label:"Déclaration CA",montant:0,urgent:false},
  {date:"15 Oct",label:"URSSAF T3",montant:580,urgent:false},
  {date:"15 Déc",label:"CFE 2026",montant:200,urgent:false},
];
const compteResultat = [
  {label:"Chiffre d'affaires",val:7400,color:GREEN,sign:"+"},
  {label:"Achats matières",val:-980,color:RED,sign:"-"},
  {label:"Emballages",val:-340,color:RED,sign:"-"},
  {label:"Loyer labo",val:-450,color:RED,sign:"-"},
  {label:"Transport",val:-180,color:RED,sign:"-"},
  {label:"Matériel",val:-150,color:RED,sign:"-"},
  {label:"URSSAF",val:-580,color:ORANGE,sign:"-"},
  {label:"CFE + Impôts",val:-520,color:ORANGE,sign:"-"},
];
const beneficeNet = 7400 + compteResultat.slice(1).reduce((s,r)=>s+r.val,0);
const cotisTotal = cotisations.reduce((s,d)=>s+d.value,0);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const card = (extra={}) => ({
  background:CARD,
  border:`1.5px solid ${BORDER}`,
  borderRadius:16,
  padding:18,
  boxShadow:"0 2px 12px rgba(124,58,237,0.06)",
  ...extra,
});

const badge = (color, size=11) => ({
  background:color+"18",
  color,
  borderRadius:99,
  padding:`2px 10px`,
  fontSize:size,
  fontWeight:700,
  fontFamily:"sans-serif",
  display:"inline-block",
  border:`1px solid ${color}30`,
});

const statutColor = {
  "En production":ORANGE,"Confirmée":GREEN,"Payée":PRI,
  "En attente":MUTED,"En cours":ACC,"Terminé":GREEN,"Parti":MUTED,
  "Planifiée":PRI,"En route":ACC,
};

const tip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return (
    <div style={{background:CARD,border:`1.5px solid ${BORDER}`,borderRadius:10,padding:"8px 14px",fontFamily:"sans-serif",fontSize:12,color:TEXT,boxShadow:"0 4px 20px rgba(124,58,237,0.15)"}}>
      <div style={{color:MUTED,marginBottom:4}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color||PRI,fontWeight:700}}>{p.name}: {p.value?.toLocaleString("fr")} €</div>
      ))}
    </div>
  );
};

// ─── SUB COMPONENTS ──────────────────────────────────────────────────────────
const KpiCard = ({icon,label,val,sub,trend,color=PRI}) => (
  <div style={{...card(),display:"flex",flexDirection:"column",gap:10}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{width:38,height:38,borderRadius:10,background:color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{icon}</div>
      {trend!=null && (
        <span style={{...badge(trend>=0?GREEN:RED,10)}}>
          {trend>=0?"▲":"▼"} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div style={{fontFamily:"'Georgia',serif",fontSize:26,fontWeight:900,color,letterSpacing:-1}}>{val}</div>
    <div>
      <div style={{fontFamily:"sans-serif",fontSize:12,color:TEXT,fontWeight:600}}>{label}</div>
      {sub&&<div style={{fontFamily:"sans-serif",fontSize:10,color:MUTED,marginTop:2}}>{sub}</div>}
    </div>
  </div>
);

const Sec = ({children,sub}) => (
  <div style={{marginBottom:14}}>
    <h2 style={{fontFamily:"'Georgia',serif",fontSize:15,fontWeight:900,color:TEXT,margin:0}}>{children}</h2>
    {sub&&<p style={{fontFamily:"sans-serif",fontSize:11,color:MUTED,margin:"3px 0 0"}}>{sub}</p>}
  </div>
);

const TABS = [
  {id:"overview",label:"🏠 Accueil"},
  {id:"finances",label:"💰 Finances"},
  {id:"compta",label:"📊 Comptabilité"},
  {id:"labo",label:"👨‍🍳 Labo"},
  {id:"livraisons",label:"🚚 Livraisons"},
  {id:"commandes",label:"📦 Commandes"},
  {id:"ia",label:"🤖 IA"},
  {id:"bienetre",label:"🌟 Bien-être"},
];

// ─── WELLNESS DATA ─────────────────────────────────────────────────────────────
const programme = [
  {jour:"Lundi",sport:"🏃 Course 20 min",meditation:"🧘 Méditation 10 min",statut:"done"},
  {jour:"Mardi",sport:"💪 Musculation 30 min",meditation:"🧘 Méditation 10 min",statut:"done"},
  {jour:"Mercredi",sport:"🚶 Marche 30 min",meditation:"🧘 Respiration 5 min",statut:"today"},
  {jour:"Jeudi",sport:"🏃 Course 20 min",meditation:"🧘 Méditation 10 min",statut:"upcoming"},
  {jour:"Vendredi",sport:"🧘 Yoga 30 min",meditation:"🧘 Méditation 15 min",statut:"upcoming"},
  {jour:"Samedi",sport:"🚴 Vélo 45 min",meditation:"🌿 Promenade nature",statut:"upcoming"},
  {jour:"Dimanche",sport:"😴 Repos total",meditation:"📖 Lecture / famille",statut:"upcoming"},
];
const habitudes = [
  {icon:"💧",label:"Hydratation",objectif:"8 verres",actuel:5,max:8,color:"#06B6D4"},
  {icon:"😴",label:"Sommeil",objectif:"8h",actuel:6.5,max:8,color:"#7C3AED"},
  {icon:"🏃",label:"Sport",objectif:"5j/sem",actuel:3,max:5,color:"#10B981"},
  {icon:"🧘",label:"Méditation",objectif:"10 min/j",actuel:7,max:10,color:"#F59E0B"},
];
const conseilsWellness = [
  {icon:"⚡",msg:"Vous travaillez depuis 6 jours sans pause — prenez une demi-journée demain",urgence:true,color:"#EF4444"},
  {icon:"💧",msg:"Vous n\'avez bu que 5 verres aujourd\'hui — objectif 8 verres",urgence:false,color:"#06B6D4"},
  {icon:"😴",msg:"Couchez-vous avant 22h ce soir pour récupérer vos 8h de sommeil",urgence:false,color:"#7C3AED"},
  {icon:"🏃",msg:"Il est 14h — parfait pour une pause sport de 20 minutes !",urgence:false,color:"#10B981"},
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [tab,setTab] = useState("overview");
  const [time,setTime] = useState(new Date());
  const [aiLoading,setAiLoading] = useState(false);
  const [aiText,setAiText] = useState("");
  const [showAI,setShowAI] = useState(false);
  const [programmeAccepte,setProgrammeAccepte] = useState(false);
  const [wellnessLoading,setWellnessLoading] = useState(false);
  const [wellnessText,setWellnessText] = useState("");
  const [showWellness,setShowWellness] = useState(false);

  useEffect(()=>{
    const t=setInterval(()=>setTime(new Date()),1000);
    return ()=>clearInterval(t);
  },[]);

  const fetchAI = async () => {
    setAiLoading(true); setShowAI(true); setAiText("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          messages:[{role:"user",content:`Tu es un conseiller financier expert micro-entrepreneur français.
Données Cœur de Sucre juin 2026 : CA 7400€ | Dépenses 2680€ | Cotisations ${cotisTotal}€ | Bénéfice net ${beneficeNet}€.
Historique 3 ans : tendance +15%/an | Pic décembre | Creux juillet-août.
Donne 4 conseils ultra concrets et chiffrés : répartition bénéfice, investissements, optimisation charges, action pour booster CA. Direct, chiffré, motivant. Emojis. Français.`}]
        })
      });
      const data = await res.json();
      setAiText(data.content[0].text);
    } catch { setAiText("❌ Erreur. Réessayez."); }
    setAiLoading(false);
  };

  const fetchWellness = async () => {
    setWellnessLoading(true); setShowWellness(true); setWellnessText("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:800,
          messages:[{role:"user",content:`Tu es un coach bien-être expert pour entrepreneurs débordés. 
Emmanuel dirige la pâtisserie Cœur de Sucre, il travaille 6 jours/7, CA de 7400€ ce mois.
Données : Sommeil 6.5h/nuit (objectif 8h) | Sport 3j/sem (objectif 5j) | Hydratation 5 verres/j | Méditation 7min/j.
Crée-lui un programme bien-être personnalisé pour cette semaine : sport adapté à un entrepreneur occupé, méditation, alimentation, récupération. 
Sois motivant, bienveillant, concret et réaliste. Propose des séances courtes (15-30 min max). Emojis. Français.`}]
        })
      });
      const data = await res.json();
      setWellnessText(data.content[0].text);
    } catch { setWellnessText("❌ Erreur. Réessayez."); }
    setWellnessLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:DARK,color:TEXT,fontFamily:"'Georgia',serif"}}>

      {/* ══ HEADER ══ */}
      <div style={{background:"white",borderBottom:`1.5px solid ${BORDER}`,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10,boxShadow:"0 2px 20px rgba(124,58,237,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${PRI},${PRI2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:`0 4px 12px ${PRI}44`}}>🎂</div>
          <div>
            <div style={{fontWeight:900,fontSize:17,color:TEXT,letterSpacing:-0.5}}>Cœur de Sucre</div>
            <div style={{fontFamily:"sans-serif",fontSize:10,color:MUTED}}>
              {time.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})} · {time.toLocaleTimeString("fr-FR")}
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
          <span style={{...badge(GREEN,10)}}>● LIVE</span>
          <span style={{fontFamily:"sans-serif",fontSize:9,color:MUTED}}>Sync Make · 2 min</span>
        </div>
      </div>

      {/* ══ TABS ══ */}
      <div style={{background:"white",borderBottom:`1.5px solid ${BORDER}`,padding:"10px 16px",display:"flex",gap:6,overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"7px 14px",borderRadius:99,fontSize:11,fontWeight:700,
            fontFamily:"sans-serif",cursor:"pointer",whiteSpace:"nowrap",
            border:`1.5px solid ${tab===t.id?PRI:BORDER}`,
            background:tab===t.id?PRI:"white",
            color:tab===t.id?"white":MUTED,
            transition:"all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{padding:16,display:"flex",flexDirection:"column",gap:14}}>

        {/* ══════════════════════════════════════════════════
            ACCUEIL
        ══════════════════════════════════════════════════ */}
        {tab==="overview" && <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <KpiCard icon="💶" label="CA Juin 2026" val="7 400 €" sub="Meilleur mois" trend={18} color={PRI}/>
            <KpiCard icon="✨" label="Bénéfice net" val={`${beneficeNet} €`} sub="Après charges" trend={12} color={GREEN}/>
            <KpiCard icon="📦" label="Commandes actives" val="47" sub="Ce mois" trend={8} color={ACC}/>
            <KpiCard icon="👥" label="Clients fidèles" val="312" sub="23 nouveaux" trend={6} color={"#8B5CF6"}/>
          </div>

          {/* Alertes */}
          <div style={{...card(),background:"#FFF5F5",border:`1.5px solid ${RED}33`}}>
            <Sec sub="À traiter maintenant">🔴 Alertes urgentes</Sec>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={{padding:"10px 14px",background:"white",borderRadius:10,borderLeft:`4px solid ${RED}`,fontFamily:"sans-serif",fontSize:12,color:TEXT,boxShadow:`0 1px 6px ${RED}15`}}>
                ⚠️ <strong style={{color:RED}}>URSSAF T2</strong> — 580€ à payer avant le 15 juillet
              </div>
              <div style={{padding:"10px 14px",background:"white",borderRadius:10,borderLeft:`4px solid ${ORANGE}`,fontFamily:"sans-serif",fontSize:12,color:TEXT,boxShadow:`0 1px 6px ${ORANGE}15`}}>
                💳 <strong style={{color:ORANGE}}>Yasmine N.</strong> — Acompte 70€ en attente depuis 3 jours
              </div>
            </div>
          </div>

          {/* Notifs */}
          <div style={card()}>
            <Sec sub="Temps réel">🔔 Activité récente</Sec>
            {notifs.map((n,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<notifs.length-1?`1px solid ${BORDER}`:"none"}}>
                <div style={{width:36,height:36,borderRadius:10,background:CARD2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{n.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"sans-serif",fontSize:12,color:TEXT,fontWeight:600}}>{n.msg}</div>
                  <div style={{fontFamily:"sans-serif",fontSize:10,color:MUTED}}>Il y a {n.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CA historique */}
          <div style={card()}>
            <Sec sub="Données SumUp — 3 ans">📈 Historique chiffre d'affaires</Sec>
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={caHisto}>
                <defs>
                  <linearGradient id="gCA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PRI} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={PRI} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                <XAxis dataKey="m" tick={{fontSize:9,fill:MUTED,fontFamily:"sans-serif"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:9,fill:MUTED,fontFamily:"sans-serif"}} axisLine={false} tickLine={false}/>
                <Tooltip content={tip}/>
                <Area type="monotone" dataKey="v" stroke={PRI} strokeWidth={2.5} fill="url(#gCA)" name="CA"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Projection */}
          <div style={card()}>
            <Sec sub="Basée sur votre historique SumUp N-3">🔮 Projection fin 2026</Sec>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
              {[
                {label:"Stable",val:"68k€",color:MUTED},
                {label:"Réaliste",val:"92k€",color:PRI},
                {label:"Optimiste",val:"124k€",color:GREEN},
              ].map((s,i)=>(
                <div key={i} style={{background:s.color+"12",border:`1.5px solid ${s.color}30`,borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
                  <div style={{fontFamily:"sans-serif",fontSize:10,color:s.color,fontWeight:700,marginBottom:4}}>{s.label}</div>
                  <div style={{fontFamily:"'Georgia',serif",fontSize:18,fontWeight:900,color:s.color}}>{s.val}</div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={projData}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                <XAxis dataKey="m" tick={{fontSize:10,fill:MUTED,fontFamily:"sans-serif"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:MUTED,fontFamily:"sans-serif"}} axisLine={false} tickLine={false}/>
                <Tooltip content={tip}/>
                <Line type="monotone" dataKey="s" stroke={MUTED} strokeWidth={2} dot={false} name="Stable" strokeDasharray="5 5"/>
                <Line type="monotone" dataKey="r" stroke={PRI} strokeWidth={2.5} dot={false} name="Réaliste"/>
                <Line type="monotone" dataKey="o" stroke={GREEN} strokeWidth={2} dot={false} name="Optimiste"/>
              </LineChart>
            </ResponsiveContainer>
            <div style={{marginTop:10,padding:"10px 14px",background:PRI+"08",borderRadius:10,borderLeft:`3px solid ${PRI}`,fontFamily:"sans-serif",fontSize:11,color:TEXT}}>
              💡 <strong style={{color:PRI}}>Conseil IA :</strong> Pour atteindre 92 700€, maintenez +3 commandes/semaine en juillet et août — vos mois historiquement creux.
            </div>
          </div>
        </>}

        {/* ══════════════════════════════════════════════════
            FINANCES
        ══════════════════════════════════════════════════ */}
        {tab==="finances" && <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <KpiCard icon="📥" label="CA ce mois" val="7 400 €" trend={18} color={GREEN}/>
            <KpiCard icon="📤" label="Charges totales" val="2 100 €" color={RED}/>
            <KpiCard icon="🏛️" label="Cotisations" val={`${cotisTotal} €`} color={ORANGE}/>
            <KpiCard icon="✨" label="Bénéfice net" val={`${beneficeNet} €`} trend={12} color={PRI}/>
          </div>

          {/* Répartition */}
          <div style={{...card(),background:`linear-gradient(135deg,${PRI}08,${ACC}08)`,border:`1.5px solid ${PRI}20`}}>
            <Sec sub="Plan recommandé pour votre bénéfice">💡 Répartition intelligente du mois</Sec>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                {e:"💰",label:"Épargne",pct:30,desc:"Livret A / LDDS",color:GREEN},
                {e:"📈",label:"Investissement",pct:20,desc:"ETF World / Assur. vie",color:PRI},
                {e:"🏦",label:"Réserve charges",pct:20,desc:"URSSAF prochain trim.",color:ORANGE},
                {e:"🛍️",label:"Rémunération",pct:30,desc:"Salaire personnel",color:ACC},
              ].map((it,i)=>{
                const val=Math.round(beneficeNet*it.pct/100);
                return (
                  <div key={i} style={{background:"white",borderRadius:12,padding:14,border:`1.5px solid ${it.color}20`,boxShadow:`0 2px 8px ${it.color}10`}}>
                    <div style={{fontFamily:"sans-serif",fontSize:11,color:MUTED,marginBottom:6}}>{it.e} {it.label}</div>
                    <div style={{fontFamily:"'Georgia',serif",fontSize:22,fontWeight:900,color:it.color}}>{val} €</div>
                    <div style={{fontFamily:"sans-serif",fontSize:10,color:MUTED,marginTop:4}}>{it.pct}% · {it.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cotisations */}
          <div style={card()}>
            <Sec>🏛️ Détail cotisations & impôts</Sec>
            <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
              <PieChart width={150} height={150}>
                <Pie data={cotisations} cx={70} cy={70} innerRadius={38} outerRadius={65} dataKey="value" strokeWidth={0}>
                  {cotisations.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
              </PieChart>
            </div>
            {cotisations.map((d,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<cotisations.length-1?`1px solid ${BORDER}`:"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:8,height:8,borderRadius:99,background:d.color}}/>
                  <span style={{fontFamily:"sans-serif",fontSize:12,color:MUTED}}>{d.name}</span>
                </div>
                <span style={{fontFamily:"sans-serif",fontSize:13,fontWeight:700,color:TEXT}}>{d.value} €</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",borderTop:`1.5px solid ${BORDER}`}}>
              <span style={{fontFamily:"sans-serif",fontSize:12,fontWeight:700,color:PRI}}>Total</span>
              <span style={{fontFamily:"'Georgia',serif",fontSize:16,fontWeight:900,color:PRI}}>{cotisTotal} €</span>
            </div>
          </div>
        </>}

        {/* ══════════════════════════════════════════════════
            COMPTABILITÉ
        ══════════════════════════════════════════════════ */}
        {tab==="compta" && <>
          <div style={card()}>
            <Sec sub="Juin 2026">📈 Compte de résultat</Sec>
            {compteResultat.map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<compteResultat.length-1?`1px solid ${BORDER}`:"none"}}>
                <span style={{fontFamily:"sans-serif",fontSize:12,color:i===0?TEXT:MUTED}}>{r.label}</span>
                <span style={{fontFamily:"'Georgia',serif",fontSize:14,fontWeight:900,color:r.color}}>{r.sign} {Math.abs(r.val).toLocaleString("fr")} €</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"12px 14px",background:`linear-gradient(135deg,${PRI}10,${PRI2}10)`,borderRadius:12,marginTop:12,border:`1.5px solid ${PRI}25`}}>
              <span style={{fontFamily:"sans-serif",fontSize:13,fontWeight:900,color:PRI}}>🎯 BÉNÉFICE NET</span>
              <span style={{fontFamily:"'Georgia',serif",fontSize:20,fontWeight:900,color:PRI}}>{beneficeNet} €</span>
            </div>
          </div>

          {/* Calendrier fiscal */}
          <div style={{...card(),background:"#FFFBEB",border:`1.5px solid ${ORANGE}30`}}>
            <Sec sub="Ne manquez aucune échéance">📅 Calendrier fiscal 2026</Sec>
            {echeances.map((e,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<echeances.length-1?`1px solid ${BORDER}`:"none"}}>
                <div>
                  <div style={{fontFamily:"sans-serif",fontSize:12,fontWeight:700,color:e.urgent?RED:TEXT}}>{e.label}</div>
                  <div style={{fontFamily:"sans-serif",fontSize:11,color:MUTED}}>📅 {e.date}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                  {e.montant>0&&<span style={{fontFamily:"'Georgia',serif",fontSize:14,fontWeight:900,color:e.urgent?RED:PRI}}>{e.montant} €</span>}
                  <span style={{...badge(e.urgent?RED:MUTED,10)}}>{e.urgent?"⚡ Urgent":"À venir"}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charges */}
          <div style={card()}>
            <Sec>💸 Détail des charges mensuelles</Sec>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={charges} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false}/>
                <XAxis dataKey="cat" tick={{fontSize:10,fill:MUTED,fontFamily:"sans-serif"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:MUTED,fontFamily:"sans-serif"}} axisLine={false} tickLine={false}/>
                <Tooltip content={tip}/>
                <Bar dataKey="val" fill={PRI} radius={[6,6,0,0]} name="Montant (€)"/>
              </BarChart>
            </ResponsiveContainer>
            {charges.map((d,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<charges.length-1?`1px solid ${BORDER}`:"none"}}>
                <span style={{fontFamily:"sans-serif",fontSize:12,color:MUTED}}>{d.cat}</span>
                <span style={{fontFamily:"'Georgia',serif",fontSize:13,fontWeight:700,color:RED}}>{d.val} €</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",borderTop:`1.5px solid ${BORDER}`}}>
              <span style={{fontFamily:"sans-serif",fontSize:12,fontWeight:700,color:RED}}>Total charges</span>
              <span style={{fontFamily:"'Georgia',serif",fontSize:16,fontWeight:900,color:RED}}>{charges.reduce((s,d)=>s+d.val,0)} €</span>
            </div>
          </div>
        </>}

        {/* ══════════════════════════════════════════════════
            LABO
        ══════════════════════════════════════════════════ */}
        {tab==="labo" && <>
          <div style={{...card(),background:`${GREEN}06`,border:`1.5px solid ${GREEN}25`}}>
            <Sec sub="Mis à jour en temps réel">👨‍🍳 Suivi équipe aujourd'hui</Sec>
            {employes.map((e,i)=>{
              const c=statutColor[e.statut]||MUTED;
              const prog=Math.round(e.done/e.taches*100);
              return (
                <div key={i} style={{padding:"14px 0",borderBottom:i<employes.length-1?`1px solid ${BORDER}`:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:36,height:36,borderRadius:10,background:c+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                        {i===0?"👨‍🍳":i===1?"👩‍🎨":"🚚"}
                      </div>
                      <div>
                        <div style={{fontFamily:"sans-serif",fontSize:13,fontWeight:700,color:TEXT}}>{e.nom}</div>
                        <div style={{fontFamily:"sans-serif",fontSize:11,color:MUTED}}>{e.poste}</div>
                      </div>
                    </div>
                    <span style={{...badge(c,10)}}>{e.statut}</span>
                  </div>
                  <div style={{display:"flex",gap:16,marginBottom:8}}>
                    <span style={{fontFamily:"sans-serif",fontSize:11,color:MUTED}}>🕐 <strong style={{color:TEXT}}>{e.arrivee}</strong></span>
                    <span style={{fontFamily:"sans-serif",fontSize:11,color:MUTED}}>🚪 <strong style={{color:TEXT}}>{e.depart||"—"}</strong></span>
                    <span style={{fontFamily:"sans-serif",fontSize:11,color:MUTED}}>✅ <strong style={{color:c}}>{e.done}/{e.taches}</strong></span>
                  </div>
                  <div style={{height:6,background:BORDER,borderRadius:99}}>
                    <div style={{height:6,borderRadius:99,background:`linear-gradient(90deg,${c},${c}aa)`,width:`${prog}%`,transition:"width 0.5s"}}/>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={card()}>
            <Sec sub="Commandes à préparer aujourd'hui">📋 Planning production</Sec>
            {commandes.slice(0,3).map((c,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<2?`1px solid ${BORDER}`:"none"}}>
                <div>
                  <div style={{fontFamily:"sans-serif",fontSize:12,fontWeight:700,color:TEXT}}>{c.gateau}</div>
                  <div style={{fontFamily:"sans-serif",fontSize:11,color:MUTED}}>{c.id} · {c.client} · {c.date}</div>
                </div>
                <span style={{...badge(statutColor[c.statut]||MUTED,10)}}>{c.statut}</span>
              </div>
            ))}
          </div>
        </>}

        {/* ══════════════════════════════════════════════════
            LIVRAISONS
        ══════════════════════════════════════════════════ */}
        {tab==="livraisons" && <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {[
              {icon:"🚚",label:"Du jour",val:"3",color:PRI},
              {icon:"✅",label:"Livrées",val:"1",color:GREEN},
              {icon:"⏳",label:"En attente",val:"2",color:ORANGE},
            ].map((k,i)=>(
              <div key={i} style={{...card(),padding:14,textAlign:"center"}}>
                <div style={{fontSize:26,marginBottom:6}}>{k.icon}</div>
                <div style={{fontFamily:"'Georgia',serif",fontSize:28,fontWeight:900,color:k.color}}>{k.val}</div>
                <div style={{fontFamily:"sans-serif",fontSize:10,color:MUTED,marginTop:4}}>{k.label}</div>
              </div>
            ))}
          </div>

          <div style={card()}>
            <Sec sub="Planning livreur — Aujourd'hui">🗺️ Tournée du jour</Sec>
            {livraisons.map((l,i)=>{
              const c=statutColor[l.statut]||MUTED;
              return (
                <div key={i} style={{padding:"12px 0",borderBottom:i<livraisons.length-1?`1px solid ${BORDER}`:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontFamily:"sans-serif",fontSize:11,color:MUTED}}>{l.id}</span>
                        <span style={{...badge(c,10)}}>{l.statut}</span>
                      </div>
                      <div style={{fontFamily:"sans-serif",fontSize:13,fontWeight:700,color:TEXT}}>{l.client}</div>
                      <div style={{fontFamily:"sans-serif",fontSize:11,color:MUTED}}>📍 {l.adresse}</div>
                      <div style={{fontFamily:"sans-serif",fontSize:11,color:MUTED}}>🕐 {l.heure}</div>
                    </div>
                    <div style={{fontFamily:"'Georgia',serif",fontSize:18,fontWeight:900,color:PRI,marginLeft:12}}>{l.montant}€</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        {/* ══════════════════════════════════════════════════
            COMMANDES
        ══════════════════════════════════════════════════ */}
        {tab==="commandes" && <>
          <div style={card()}>
            <Sec sub="Semaine en cours">📦 Commandes actives</Sec>
            {commandes.map((c,i)=>{
              const sc=statutColor[c.statut]||MUTED;
              return (
                <div key={i} style={{padding:"12px 0",borderBottom:i<commandes.length-1?`1px solid ${BORDER}`:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontFamily:"sans-serif",fontSize:11,color:MUTED}}>{c.id}</span>
                        <span style={{...badge(sc,10)}}>{c.statut}</span>
                      </div>
                      <div style={{fontFamily:"sans-serif",fontSize:13,fontWeight:700,color:TEXT}}>{c.client}</div>
                      <div style={{fontFamily:"sans-serif",fontSize:11,color:MUTED}}>{c.gateau}</div>
                      <div style={{fontFamily:"sans-serif",fontSize:11,color:MUTED,marginTop:2}}>📅 {c.date} · 📍 {c.zone}</div>
                    </div>
                    <div style={{fontFamily:"'Georgia',serif",fontSize:20,fontWeight:900,color:PRI,marginLeft:12}}>{c.montant}€</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={card()}>
            <Sec>📊 Commandes par jour</Sec>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={cmdsJour} barSize={26}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false}/>
                <XAxis dataKey="j" tick={{fontSize:11,fill:MUTED,fontFamily:"sans-serif"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:MUTED,fontFamily:"sans-serif"}} axisLine={false} tickLine={false}/>
                <Tooltip content={tip}/>
                <Bar dataKey="n" fill={PRI} radius={[6,6,0,0]} name="Commandes"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>}

        {/* ══════════════════════════════════════════════════
            CONSEILS IA
        ══════════════════════════════════════════════════ */}
        {tab==="ia" && <>
          <div style={{...card(),background:`linear-gradient(135deg,${PRI}06,${ACC}06)`,border:`1.5px solid ${PRI}25`}}>
            <Sec sub="Analyse Claude basée sur vos données réelles">🤖 Conseils financiers personnalisés</Sec>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              {[
                {icon:"💶",label:"CA Juin",val:"7 400 €",color:PRI},
                {icon:"✨",label:"Bénéfice",val:`${beneficeNet} €`,color:GREEN},
                {icon:"📈",label:"Tendance",val:"+15%/an",color:ACC},
                {icon:"🎯",label:"Objectif 2026",val:"92k€",color:"#8B5CF6"},
              ].map((k,i)=>(
                <div key={i} style={{background:"white",borderRadius:12,padding:12,display:"flex",alignItems:"center",gap:10,border:`1.5px solid ${BORDER}`,boxShadow:`0 2px 8px ${k.color}10`}}>
                  <div style={{width:32,height:32,borderRadius:8,background:k.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{k.icon}</div>
                  <div>
                    <div style={{fontFamily:"sans-serif",fontSize:10,color:MUTED}}>{k.label}</div>
                    <div style={{fontFamily:"'Georgia',serif",fontSize:15,fontWeight:900,color:k.color}}>{k.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {!showAI ? (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:44,marginBottom:12}}>✨</div>
                <p style={{fontFamily:"sans-serif",fontSize:13,color:MUTED,marginBottom:20,lineHeight:1.6}}>
                  Claude analyse vos données et vous donne<br/>des conseils financiers ultra personnalisés
                </p>
                <button onClick={fetchAI} style={{
                  padding:"13px 28px",borderRadius:99,border:"none",cursor:"pointer",
                  background:`linear-gradient(135deg,${PRI},${PRI2})`,
                  color:"white",fontWeight:900,fontSize:13,fontFamily:"sans-serif",
                  boxShadow:`0 4px 20px ${PRI}44`,
                }}>🎯 Analyser mes finances</button>
              </div>
            ) : aiLoading ? (
              <div style={{textAlign:"center",padding:"24px 0"}}>
                <div style={{fontSize:30,marginBottom:10}}>⚙️</div>
                <p style={{fontFamily:"sans-serif",fontSize:12,color:MUTED}}>Claude analyse vos données...</p>
              </div>
            ) : (
              <div>
                <div style={{background:"white",borderRadius:12,padding:16,marginBottom:14,border:`1.5px solid ${BORDER}`}}>
                  <p style={{fontFamily:"sans-serif",fontSize:13,color:TEXT,lineHeight:1.7,whiteSpace:"pre-wrap",margin:0}}>{aiText}</p>
                </div>
                <button onClick={fetchAI} style={{
                  width:"100%",padding:"10px",borderRadius:99,
                  border:`1.5px solid ${PRI}30`,background:PRI+"08",
                  color:PRI,fontWeight:700,fontSize:12,fontFamily:"sans-serif",cursor:"pointer",
                }}>🔄 Actualiser les conseils</button>
              </div>
            )}
          </div>

          {/* Conseils rapides */}
          <div style={card()}>
            <Sec>💡 Conseils rapides</Sec>
            {[
              {icon:"💰",text:`Mettez ${Math.round(beneficeNet*0.3)}€ sur votre Livret A avant le 5 du mois`,color:GREEN},
              {icon:"📈",text:"Un ETF MSCI World à 150€/mois peut rapporter 28 000€ dans 10 ans",color:PRI},
              {icon:"🎯",text:"Décembre est votre pic — préparez +20% de stocks dès octobre",color:ORANGE},
              {icon:"⚡",text:"Ajoutez 'Livraison express +24h' à +30% — vos clients weekend l'adorent",color:ACC},
            ].map((c,i)=>(
              <div key={i} style={{padding:"10px 14px",background:c.color+"08",borderRadius:10,borderLeft:`3px solid ${c.color}`,marginBottom:8,fontFamily:"sans-serif",fontSize:12,color:TEXT,lineHeight:1.5}}>
                <span style={{fontSize:16,marginRight:8}}>{c.icon}</span>{c.text}
              </div>
            ))}
          </div>
        </>}

        {/* ══════════════════════════════════════════════════
            BIEN-ÊTRE
        ══════════════════════════════════════════════════ */}
        {tab==="bienetre" && <>

          {/* Message du coach */}
          <div style={{background:`linear-gradient(135deg,#10B981,#059669)`,borderRadius:16,padding:20,boxShadow:"0 4px 20px rgba(16,185,129,0.3)"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🌟</div>
              <div>
                <div style={{fontWeight:900,fontSize:15,color:"white"}}>Votre coach bien-être</div>
                <div style={{fontFamily:"sans-serif",fontSize:11,color:"rgba(255,255,255,0.8)"}}>Message du jour</div>
              </div>
            </div>
            <div style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:14,fontFamily:"sans-serif",fontSize:13,color:"white",lineHeight:1.6}}>
              💪 <strong>Bonjour Emmanuel !</strong> Vous avez travaillé 6 jours d'affilée — votre corps a besoin de récupérer. Aujourd'hui : 20 min de marche + 10 min de méditation avant 18h. Votre CA ce mois est excellent, vous méritez de prendre soin de vous !
            </div>
          </div>

          {/* Alertes bien-être */}
          <div style={{background:"white",border:`1.5px solid #E8E0FF`,borderRadius:16,padding:18,boxShadow:"0 2px 12px rgba(124,58,237,0.06)"}}>
            <div style={{marginBottom:14}}>
              <h2 style={{fontFamily:"'Georgia',serif",fontSize:15,fontWeight:900,color:"#1A0F3A",margin:0}}>⚡ Alertes bien-être</h2>
              <p style={{fontFamily:"sans-serif",fontSize:11,color:"#9585B4",margin:"3px 0 0"}}>Basées sur votre activité</p>
            </div>
            {conseilsWellness.map((c,i)=>(
              <div key={i} style={{padding:"10px 14px",background:c.color+"08",borderRadius:10,borderLeft:`3px solid ${c.color}`,marginBottom:8,fontFamily:"sans-serif",fontSize:12,color:"#1A0F3A",lineHeight:1.5,display:"flex",alignItems:"flex-start",gap:10}}>
                <span style={{fontSize:18,flexShrink:0}}>{c.icon}</span>
                <div>
                  {c.urgence && <span style={{background:"#EF444420",color:"#EF4444",borderRadius:99,padding:"1px 8px",fontSize:10,fontWeight:700,marginRight:6}}>URGENT</span>}
                  {c.msg}
                </div>
              </div>
            ))}
          </div>

          {/* Habitudes du jour */}
          <div style={{background:"white",border:`1.5px solid #E8E0FF`,borderRadius:16,padding:18,boxShadow:"0 2px 12px rgba(124,58,237,0.06)"}}>
            <div style={{marginBottom:14}}>
              <h2 style={{fontFamily:"'Georgia',serif",fontSize:15,fontWeight:900,color:"#1A0F3A",margin:0}}>📊 Habitudes du jour</h2>
              <p style={{fontFamily:"sans-serif",fontSize:11,color:"#9585B4",margin:"3px 0 0"}}>Suivi en temps réel</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {habitudes.map((h,i)=>{
                const pct = Math.round(h.actuel/h.max*100);
                return (
                  <div key={i} style={{background:`${h.color}08`,borderRadius:12,padding:14,border:`1.5px solid ${h.color}20`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <span style={{fontSize:20}}>{h.icon}</span>
                      <span style={{fontFamily:"sans-serif",fontSize:11,fontWeight:700,color:h.color}}>{pct}%</span>
                    </div>
                    <div style={{fontFamily:"sans-serif",fontSize:12,color:"#1A0F3A",fontWeight:700,marginBottom:2}}>{h.label}</div>
                    <div style={{fontFamily:"sans-serif",fontSize:10,color:"#9585B4",marginBottom:8}}>{h.actuel} / {h.objectif}</div>
                    <div style={{height:5,background:"#E8E0FF",borderRadius:99}}>
                      <div style={{height:5,borderRadius:99,background:h.color,width:`${pct}%`,transition:"width 0.5s"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Programme semaine */}
          <div style={{background:"white",border:`1.5px solid #E8E0FF`,borderRadius:16,padding:18,boxShadow:"0 2px 12px rgba(124,58,237,0.06)"}}>
            <div style={{marginBottom:14}}>
              <h2 style={{fontFamily:"'Georgia',serif",fontSize:15,fontWeight:900,color:"#1A0F3A",margin:0}}>📅 Programme de la semaine</h2>
              <p style={{fontFamily:"sans-serif",fontSize:11,color:"#9585B4",margin:"3px 0 0"}}>{programmeAccepte?"✅ Programme accepté":"En attente de votre validation"}</p>
            </div>
            {programme.map((p,i)=>{
              const isToday = p.statut==="today";
              const isDone = p.statut==="done";
              return (
                <div key={i} style={{padding:"10px 12px",borderRadius:10,marginBottom:8,background:isToday?`#10B98110`:isDone?`#10B98106`:"#F8F7FF",border:isToday?`1.5px solid #10B981`:`1.5px solid #E8E0FF`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontFamily:"sans-serif",fontSize:12,fontWeight:900,color:isToday?"#10B981":isDone?"#9585B4":"#1A0F3A"}}>{p.jour}</span>
                    <span style={{fontFamily:"sans-serif",fontSize:10,color:isDone?"#10B981":isToday?"#10B981":"#9585B4"}}>
                      {isDone?"✅ Fait":isToday?"📍 Aujourd'hui":"⏳ À venir"}
                    </span>
                  </div>
                  <div style={{fontFamily:"sans-serif",fontSize:11,color:"#6B7280"}}>{p.sport}</div>
                  <div style={{fontFamily:"sans-serif",fontSize:11,color:"#9585B4"}}>{p.meditation}</div>
                </div>
              );
            })}
            {!programmeAccepte && (
              <button onClick={()=>setProgrammeAccepte(true)} style={{
                width:"100%",marginTop:8,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                background:`linear-gradient(135deg,#10B981,#059669)`,
                color:"white",fontWeight:900,fontSize:13,fontFamily:"sans-serif",
                boxShadow:"0 4px 16px rgba(16,185,129,0.4)",
              }}>✅ Accepter ce programme</button>
            )}
          </div>

          {/* IA Coach personnalisé */}
          <div style={{background:`linear-gradient(135deg,#10B98108,#7C3AED08)`,border:`1.5px solid #10B98130`,borderRadius:16,padding:18}}>
            <div style={{marginBottom:14}}>
              <h2 style={{fontFamily:"'Georgia',serif",fontSize:15,fontWeight:900,color:"#1A0F3A",margin:0}}>🤖 Coach IA personnalisé</h2>
              <p style={{fontFamily:"sans-serif",fontSize:11,color:"#9585B4",margin:"3px 0 0"}}>Programme sur mesure généré par Claude</p>
            </div>
            {!showWellness ? (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:44,marginBottom:12}}>🌿</div>
                <p style={{fontFamily:"sans-serif",fontSize:13,color:"#9585B4",marginBottom:20,lineHeight:1.6}}>
                  Claude va créer un programme bien-être<br/>adapté à votre emploi du temps d'entrepreneur
                </p>
                <button onClick={fetchWellness} style={{
                  padding:"13px 28px",borderRadius:99,border:"none",cursor:"pointer",
                  background:`linear-gradient(135deg,#10B981,#059669)`,
                  color:"white",fontWeight:900,fontSize:13,fontFamily:"sans-serif",
                  boxShadow:"0 4px 20px rgba(16,185,129,0.4)",
                }}>🌟 Créer mon programme bien-être</button>
              </div>
            ) : wellnessLoading ? (
              <div style={{textAlign:"center",padding:"24px 0"}}>
                <div style={{fontSize:30,marginBottom:10}}>🌿</div>
                <p style={{fontFamily:"sans-serif",fontSize:12,color:"#9585B4"}}>Claude prépare votre programme...</p>
              </div>
            ) : (
              <div>
                <div style={{background:"white",borderRadius:12,padding:16,marginBottom:14,border:`1.5px solid #E8E0FF`}}>
                  <p style={{fontFamily:"sans-serif",fontSize:13,color:"#1A0F3A",lineHeight:1.7,whiteSpace:"pre-wrap",margin:0}}>{wellnessText}</p>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setProgrammeAccepte(true)} style={{
                    flex:1,padding:"10px",borderRadius:99,border:"none",cursor:"pointer",
                    background:`linear-gradient(135deg,#10B981,#059669)`,
                    color:"white",fontWeight:700,fontSize:12,fontFamily:"sans-serif",
                  }}>✅ Accepter ce programme</button>
                  <button onClick={fetchWellness} style={{
                    padding:"10px 16px",borderRadius:99,cursor:"pointer",fontFamily:"sans-serif",fontSize:12,fontWeight:700,
                    border:`1.5px solid #10B98130`,background:"transparent",color:"#10B981",
                  }}>🔄</button>
                </div>
              </div>
            )}
          </div>
        </>}

        <div style={{textAlign:"center",padding:"4px 0"}}>
          <p style={{fontFamily:"sans-serif",fontSize:10,color:MUTED}}>
            Cœur de Sucre Dashboard · Sync automatique Make & SumUp · {time.toLocaleTimeString("fr-FR")}
          </p>
        </div>
      </div>
    </div>
  );
}
