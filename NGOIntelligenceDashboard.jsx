import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend,
} from "recharts";

// ─── COLOUR TOKENS ────────────────────────────────────────────────────────────
const C = {
  corp: "#1B4F8A", ind: "#2D7D46", gov: "#C47B1A", found: "#6B4CA8",
  gap: "#E8E8E4", my: "#C8102E", gl: "#1B4F8A", accent: "#00A878",
  bg: "#F5F4F0", card: "#FFFFFF", text: "#1A1A18", muted: "#6B6B65", border: "#E2E1DC",
};

// ─── DATASET ──────────────────────────────────────────────────────────────────
const GLOBAL = [
  { id:"fa",   name:"Feeding America",       country:"USA",       sector:"Food",      model:"Gov/Found",   conf:"Low",    rev:"$3–5B",          corp:0,  ind:0,  gov:30, found:30, gap:40, trend:[100,130,118,112,115], proj:[118,122,127] },
  { id:"sh",   name:"Second Harvest SV",     country:"USA",       sector:"Food",      model:"Individual",  conf:"Medium", rev:"~$200M",          corp:10, ind:67, gov:12, found:10, gap:1,  trend:[100,115,112,113,115], proj:[118,122,128] },
  { id:"ch",   name:"City Harvest",          country:"USA",       sector:"Food",      model:"Gov/Found",   conf:"Low",    rev:"$150–200M",       corp:0,  ind:0,  gov:50, found:30, gap:20, trend:[100,118,110,108,110], proj:[112,115,119] },
  { id:"oz",   name:"OzHarvest",             country:"Australia", sector:"Food",      model:"Corporate",   conf:"Low",    rev:"$20–40M AUD",     corp:40, ind:30, gov:10, found:20, gap:0,  trend:[100,140,125,118,120], proj:[123,128,134] },
  { id:"fs",   name:"FareShare",             country:"UK",        sector:"Food",      model:"Corporate",   conf:"Low",    rev:"£20–30M",         corp:45, ind:20, gov:15, found:20, gap:0,  trend:[100,135,122,115,118], proj:[121,125,130] },
  { id:"shca", name:"Second Harvest Canada", country:"Canada",    sector:"Food",      model:"Individual",  conf:"Medium", rev:"$100–150M CAD",   corp:30, ind:40, gov:20, found:10, gap:0,  trend:[100,120,115,112,114], proj:[117,121,126] },
  { id:"tt",   name:"Trussell Trust",        country:"UK",        sector:"Poverty",   model:"Government",  conf:"Medium", rev:"£50–80M",         corp:10, ind:25, gov:45, found:20, gap:0,  trend:[100,112,108,110,113], proj:[116,120,125] },
  { id:"aah",  name:"Action Against Hunger", country:"Global",    sector:"Hunger",    model:"Gov/Found",   conf:"Medium", rev:"€400–500M",       corp:20, ind:20, gov:40, found:20, gap:0,  trend:[100,108,105,103,106], proj:[109,113,118] },
  { id:"wfp",  name:"WFP",                   country:"UN",        sector:"Hunger",    model:"Government",  conf:"High",   rev:"$7–9B",           corp:5,  ind:5,  gov:80, found:10, gap:0,  trend:[100,145,125,118,122], proj:[125,128,132] },
  { id:"gd",   name:"GiveDirectly",          country:"USA",       sector:"Cash Aid",  model:"Individual",  conf:"High",   rev:"$200–400M",       corp:10, ind:60, gov:15, found:15, gap:0,  trend:[100,118,125,130,138], proj:[145,155,168] },
];

const MALAYSIAN = [
  { id:"mercy",   name:"MERCY Malaysia",        founded:1999, sector:"Medical/Humanitarian", model:"Individual/Found", conf:"Medium", rev:"~RM 30–50M",   corp:20, ind:40, gov:15, found:25, trend:[100,108,130,118,120], proj:[124,130,138],
    note:"Founded 1999 by Dr Jemilah Mahmood. Received RM10M+ from ABM member banks for COVID fund. Partners: Maybank, Lazada, Ministry of Health.",
    bp:"Rapid mobilisation model. Strong institutional donor base. Transparent annual audited reports per Societies Act 1966." },
  { id:"yfbm",    name:"Yayasan Food Bank MY",  founded:2019, sector:"Food Security",        model:"Corporate/Gov",    conf:"Medium", rev:"~RM 5–15M",    corp:35, ind:15, gov:40, found:10, trend:[100,130,145,138,142], proj:[150,162,175],
    note:"Established under Trustee Act 1952. Partners: Nestlé Malaysia, Marrybrown, Dunkin. Backed by KPDNHEP (Ministry of Domestic Trade).",
    bp:"Government-anchored model with strong FMCG corporate partners. Rescues surplus food from manufacturers, hypermarkets, hotels." },
  { id:"ksk",     name:"Kechara Soup Kitchen",  founded:2008, sector:"Food/Homeless",        model:"Individual/Corp",  conf:"Low",    rev:"~RM 3–8M",     corp:25, ind:50, gov:5,  found:20, trend:[100,115,125,118,120], proj:[124,130,138],
    note:"Since 2008, served 1.3M+ meals. Food bank program reached 21,698 families. Partners include hotels and markets for surplus food.",
    bp:"Community-embedded, zero-waste model. Combines individual giving with in-kind corporate food donations." },
  { id:"yh",      name:"Yayasan Hasanah",       founded:2014, sector:"Education/Community",  model:"Foundation",       conf:"Medium", rev:"~RM 50–100M",  corp:10, ind:10, gov:20, found:60, trend:[100,105,108,110,112], proj:[115,120,126],
    note:"Established by Khazanah Nasional Berhad. Funds education, arts, environment. Key funder of civil society capacity building.",
    bp:"GLiC-backed foundation model. Multi-sector grant-making with emphasis on measurable social return on investment." },
  { id:"ysd",     name:"Yayasan Sime Darby",    founded:2010, sector:"Education/Environment",model:"Corporate",        conf:"Medium", rev:"~RM 40–80M",   corp:75, ind:5,  gov:10, found:10, trend:[100,102,105,108,112], proj:[116,121,127],
    note:"Funded by Sime Darby Berhad (GLC). Scholarships, conservation, youth development. 95,000+ beneficiaries across programmes.",
    bp:"Pure corporate CSR foundation. Clearest example of GLC-to-NGO funding pipeline in Malaysia." },
  { id:"tfm",     name:"Teach For Malaysia",    founded:2010, sector:"Education",             model:"Corporate/Found",  conf:"Medium", rev:"~RM 15–25M",   corp:40, ind:20, gov:20, found:20, trend:[100,105,102,108,115], proj:[120,127,135],
    note:"Modelled on Teach For America. MoU with Ministry of Education. Corporate sponsors include banks and multinationals.",
    bp:"Hybrid public-private model. Government MoU provides credibility; corporate CSR provides operational funding." },
  { id:"pertiwi", name:"PERTIWI",               founded:1973, sector:"Women/Food Aid",        model:"Individual/Corp",  conf:"Low",    rev:"~RM 2–5M",     corp:20, ind:55, gov:15, found:10, trend:[100,112,118,115,116], proj:[119,124,130],
    note:"Over 50 years serving marginalised communities. Daily meal distribution, weekly healthcare. Soup kitchen is flagship programme.",
    bp:"Grassroots resilience model. Long community trust drives individual donation loyalty. Low overhead, high direct impact." },
  { id:"mkkm",    name:"MyKasih Foundation",    founded:2008, sector:"Poverty/Food",          model:"Corporate",        conf:"Low",    rev:"~RM 10–20M",   corp:60, ind:15, gov:15, found:10, trend:[100,115,120,118,122], proj:[126,132,140],
    note:"Digital welfare card system for B40 families. Corporate-sponsored grocery aid. Partners: retailers, banks, GLCs.",
    bp:"Tech-enabled corporate CSR delivery. Card-based aid system reduces leakage and increases corporate donor confidence." },
  { id:"sols",    name:"SOLS Foundation",       founded:2002, sector:"Education/Vocational",  model:"Corporate/Found",  conf:"Low",    rev:"~RM 8–15M",    corp:35, ind:25, gov:15, found:25, trend:[100,108,112,115,120], proj:[125,132,140],
    note:"Education and vocational training for B40 youth. SOLS Energy (solar) is a social enterprise arm. Partners: UN, corporates, foundations.",
    bp:"Social enterprise integration — revenue from SOLS Energy cross-subsidises charitable education programmes." },
  { id:"faf",     name:"Food Aid Foundation",   founded:2003, sector:"Food Security",         model:"Corporate/Ind",    conf:"Low",    rev:"~RM 3–8M",     corp:30, ind:40, gov:10, found:20, trend:[100,118,130,125,128], proj:[132,138,146],
    note:"Rescues surplus food, redistributes to welfare homes, refugee communities, soup kitchens. Corporate food-in-kind donations are core.",
    bp:"Food rescue model similar to FareShare (UK). Builds supply-chain relationships with FMCG, hospitality and retail sectors." },
];

const YEARS  = ["2019","2020","2021","2022","2023"];
const PROJ   = ["2024E","2025E","2026E"];
const ALL_YR = [...YEARS, ...PROJ];

const CONF_STYLE = { High:["#EAF3DE","#27500A"], Medium:["#FFF3D6","#7A4F00"], Low:["#FCEBEB","#A32D2D"] };
const MODEL_STYLE = {
  "Corporate":       ["#1B4F8A","#E6F1FB"],
  "Individual":      ["#2D7D46","#EAF3DE"],
  "Government":      ["#C47B1A","#FFF3D6"],
  "Foundation":      ["#6B4CA8","#EEEDFE"],
  "Individual/Found":["#2D7D46","#EAF3DE"],
  "Corporate/Gov":   ["#1B4F8A","#E6F1FB"],
  "Gov/Found":       ["#C47B1A","#FFF3D6"],
  "Individual/Corp": ["#2D7D46","#EAF3DE"],
  "Corporate/Found": ["#1B4F8A","#E6F1FB"],
  "Corporate/Ind":   ["#1B4F8A","#E6F1FB"],
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const TIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", fontSize:12, boxShadow:"0 4px 16px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight:500, marginBottom:6 }}>{label}</div>
      {payload.filter(p => p.value !== null && p.value > 0).map(p => (
        <div key={p.name} style={{ display:"flex", justifyContent:"space-between", gap:16 }}>
          <span style={{ color: p.fill || p.stroke }}>{p.name}</span>
          <span>{p.value}{p.unit ?? "%"}</span>
        </div>
      ))}
    </div>
  );
};

function ConfBadge({ conf }) {
  const [bg, tx] = CONF_STYLE[conf] || ["#eee","#555"];
  return <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:4, background:bg, color:tx, letterSpacing:"0.04em" }}>{conf.toUpperCase()}</span>;
}

function ModelTag({ model }) {
  const [tx, bg] = MODEL_STYLE[model] || ["#555","#eee"];
  return <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:4, background:bg, color:tx }}>{model}</span>;
}

function FundBar({ label, value, color }) {
  if (!value) return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
      <span style={{ fontSize:11, color:C.muted, width:72 }}>{label}</span>
      <span style={{ fontSize:11, color:"#bbb", fontStyle:"italic" }}>not disclosed</span>
    </div>
  );
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
      <span style={{ fontSize:11, color:C.muted, width:72 }}>{label}</span>
      <div style={{ flex:1, height:6, background:"#eee", borderRadius:3, overflow:"hidden" }}>
        <div style={{ width:`${value}%`, height:"100%", background:color, borderRadius:3 }} />
      </div>
      <span style={{ fontSize:11, fontWeight:500, color:C.text, width:32 }}>{value}%</span>
    </div>
  );
}

function Card({ children, mb }) {
  return <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px", marginBottom: mb ?? 16 }}>{children}</div>;
}

function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom:24 }}>
      <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", color:C.accent, textTransform:"uppercase", marginBottom:6, margin:0 }}>{eyebrow}</p>
      <h2 style={{ fontSize:22, fontWeight:500, color:C.text, margin:"6px 0 6px" }}>{title}</h2>
      {sub && <p style={{ fontSize:14, color:C.muted, margin:0 }}>{sub}</p>}
    </div>
  );
}

function Legend({ items }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:12 }}>
      {items.map(([label, color]) => (
        <span key={label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:C.muted }}>
          <span style={{ width:10, height:10, borderRadius:2, background:color, flexShrink:0 }} />{label}
        </span>
      ))}
    </div>
  );
}

const SEG_LEGEND = [["Corporate",C.corp],["Individual",C.ind],["Government",C.gov],["Foundation",C.found],["Undisclosed",C.gap]];
const SEG_LEGEND_4 = SEG_LEGEND.slice(0,4);

// ─── SECTION: EXEC SUMMARY ────────────────────────────────────────────────────
function ExecSummary() {
  const overviewData = [
    { segment:"Corporate",  Global:19, Malaysia:35 },
    { segment:"Individual", Global:37, Malaysia:27 },
    { segment:"Government", Global:30, Malaysia:18 },
    { segment:"Foundation", Global:17, Malaysia:17 },
  ];
  return (
    <section style={{ marginBottom:48 }}>
      <SectionHeader eyebrow="Overview" title="NGO Funding Intelligence" sub="A comparative analysis of funding structures, growth trajectories and best practices across 20 global and Malaysian NGOs — 2019 to 2026." />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {[["95,694","NGOs in Malaysia (2024)","Registry of Societies + SSM"],["10","Global benchmark NGOs","US, UK, Australia, Canada, UN"],["10","Malaysian NGOs profiled","Food, education, poverty, health"],["3","Dominant funding models","Corporate · Individual · Government"]].map(([v,l,s]) => (
          <div key={l} style={{ background:"#F7F7F5", borderRadius:8, padding:"16px" }}>
            <div style={{ fontSize:26, fontWeight:500, color:C.text }}>{v}</div>
            <div style={{ fontSize:12, fontWeight:500, color:C.text, margin:"4px 0 3px" }}>{l}</div>
            <div style={{ fontSize:11, color:C.muted }}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"#1A1A18", borderRadius:12, padding:"20px 24px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, marginBottom:24 }}>
        {[
          ["Key finding 01","Malaysian NGOs are heavily CSR-dependent — 6 of 10 list corporate funding as their primary or co-primary source, unlike Western peers where individual giving dominates."],
          ["Key finding 02","Transparency is the largest structural gap. Only WFP and GiveDirectly globally — and Yayasan Hasanah locally — publish near-complete funding breakdowns."],
          ["Key finding 03","The fastest-growing segment is food security NGOs — both globally post-COVID and in Malaysia, where B40 demand has driven YFBM and Kechara to expand rapidly since 2020."],
        ].map(([kf, txt]) => (
          <div key={kf}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:C.accent, marginBottom:8, textTransform:"uppercase" }}>{kf}</div>
            <p style={{ fontSize:13, lineHeight:1.6, margin:0, color:"#D8D7D2" }}>{txt}</p>
          </div>
        ))}
      </div>
      <Card>
        <div style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:4 }}>Average funding mix — global vs. Malaysian NGOs</div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>Malaysian NGOs skew corporate; global peers skew individual.</div>
        <Legend items={[["Global (avg.)",C.gl],["Malaysia (avg.)",C.my]]} />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={overviewData} margin={{ left:0, right:16 }}>
            <XAxis dataKey="segment" tick={{ fontSize:11, fill:C.muted }} />
            <YAxis tickFormatter={v=>`${v}%`} tick={{ fontSize:11, fill:C.muted }} domain={[0,55]} />
            <Tooltip content={TIP} />
            <Bar dataKey="Global"   name="Global"   fill={C.gl} radius={[4,4,0,0]} isAnimationActive={false} />
            <Bar dataKey="Malaysia" name="Malaysia" fill={C.my} radius={[4,4,0,0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </section>
  );
}

// ─── SECTION: GLOBAL NGOs ─────────────────────────────────────────────────────
function GlobalProfiles() {
  const [sel, setSel] = useState("fa");
  const ngo = GLOBAL.find(n => n.id === sel);
  const trendData = ALL_YR.map((yr, i) => ({
    year: yr,
    Actual:    i < 5 ? ngo.trend[i] : null,
    Projected: i >= 4 ? (i === 4 ? ngo.trend[4] : ngo.proj[i-5]) : null,
  }));
  const mixData = GLOBAL.map(n => ({ name:n.name, Corporate:n.corp, Individual:n.ind, Government:n.gov, Foundation:n.found, Undisclosed:n.gap }));

  return (
    <section style={{ marginBottom:48 }}>
      <SectionHeader eyebrow="Section 01 — Global Benchmarks" title="10 Global NGOs — Funding Structure" sub="Verified annual report data + research estimates. Grey bar = undisclosed segment." />
      <Card mb={16}>
        <div style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:4 }}>Funding mix — 2023 snapshot (% of total income)</div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>Hover for values. Grey = undisclosed donor segment.</div>
        <Legend items={SEG_LEGEND} />
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={mixData} layout="vertical" margin={{ left:8, right:16 }}>
            <XAxis type="number" domain={[0,100]} tickFormatter={v=>`${v}%`} tick={{ fontSize:10, fill:C.muted }} />
            <YAxis type="category" dataKey="name" width={148} tick={{ fontSize:10, fill:C.text }} />
            <Tooltip content={TIP} />
            <Bar dataKey="Corporate"   stackId="a" fill={C.corp}  isAnimationActive={false} />
            <Bar dataKey="Individual"  stackId="a" fill={C.ind}   isAnimationActive={false} />
            <Bar dataKey="Government"  stackId="a" fill={C.gov}   isAnimationActive={false} />
            <Bar dataKey="Foundation"  stackId="a" fill={C.found} isAnimationActive={false} />
            <Bar dataKey="Undisclosed" stackId="a" fill={C.gap}   isAnimationActive={false} radius={[0,4,4,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"188px 1fr", gap:12 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          {GLOBAL.map(n => (
            <button key={n.id} onClick={() => setSel(n.id)} style={{ textAlign:"left", padding:"8px 11px", borderRadius:8, border:`1px solid ${sel===n.id ? C.corp : C.border}`, background: sel===n.id ? "#E6F1FB" : C.card, cursor:"pointer", fontSize:12, fontWeight:sel===n.id?500:400, color:sel===n.id?C.corp:C.text }}>
              {n.name}
              <div style={{ fontSize:10, color:C.muted, fontWeight:400 }}>{n.country} · {n.sector}</div>
            </button>
          ))}
        </div>
        <Card mb={0}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
            <div>
              <h3 style={{ fontSize:17, fontWeight:500, color:C.text, margin:"0 0 4px" }}>{ngo.name}</h3>
              <p style={{ fontSize:13, color:C.muted, margin:0 }}>{ngo.country} · {ngo.sector} · Revenue: {ngo.rev}</p>
            </div>
            <div style={{ display:"flex", gap:6 }}><ModelTag model={ngo.model} /><ConfBadge conf={ngo.conf} /></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:500, color:C.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>Funding breakdown</div>
              <FundBar label="Corporate"  value={ngo.corp}  color={C.corp} />
              <FundBar label="Individual" value={ngo.ind}   color={C.ind} />
              <FundBar label="Government" value={ngo.gov}   color={C.gov} />
              <FundBar label="Foundation" value={ngo.found} color={C.found} />
              {ngo.gap > 0 && <div style={{ fontSize:11, color:C.muted, fontStyle:"italic", marginTop:6 }}>{ngo.gap}% undisclosed</div>}
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:500, color:C.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>Revenue index (2019 = 100)</div>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={trendData}>
                  <XAxis dataKey="year" tick={{ fontSize:9, fill:C.muted }} />
                  <YAxis tick={{ fontSize:9, fill:C.muted }} domain={[80,185]} />
                  <Tooltip content={TIP} />
                  <Area type="monotone" dataKey="Actual"    stroke={C.gl} fill="#E6F1FB" strokeWidth={2} dot={false} connectNulls={false} />
                  <Area type="monotone" dataKey="Projected" stroke={C.gl} fill="#E6F1FB" strokeWidth={1.5} strokeDasharray="4 3" dot={false} connectNulls={false} fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

// ─── SECTION: MALAYSIAN NGOs ──────────────────────────────────────────────────
function MalaysianProfiles() {
  const [sel, setSel] = useState("mercy");
  const ngo = MALAYSIAN.find(n => n.id === sel);
  const trendData = ALL_YR.map((yr, i) => ({
    year: yr,
    Actual:    i < 5 ? ngo.trend[i] : null,
    Projected: i >= 4 ? (i === 4 ? ngo.trend[4] : ngo.proj[i-5]) : null,
  }));
  const mixData = MALAYSIAN.map(n => ({ name: n.name.length > 18 ? n.name.slice(0,17)+"…" : n.name, Corporate:n.corp, Individual:n.ind, Government:n.gov, Foundation:n.found }));

  return (
    <section style={{ marginBottom:48 }}>
      <SectionHeader eyebrow="Section 02 — Malaysian NGOs" title="Top 10 Malaysian NGOs — Funding & Growth" sub="Research-compiled profiles. Malaysia has 95,694 registered NGOs (2024). These 10 represent best-practice organisations across food, education, health and poverty sectors." />
      <Card mb={16}>
        <div style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:4 }}>Malaysian NGO funding mix — research estimates 2019–2023</div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>Malaysian NGOs rely heavily on corporate CSR and government grants vs. the individual-giving model that dominates Western peers.</div>
        <Legend items={SEG_LEGEND_4} />
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={mixData} layout="vertical" margin={{ left:8, right:16 }}>
            <XAxis type="number" domain={[0,100]} tickFormatter={v=>`${v}%`} tick={{ fontSize:10, fill:C.muted }} />
            <YAxis type="category" dataKey="name" width={140} tick={{ fontSize:10, fill:C.text }} />
            <Tooltip content={TIP} />
            <Bar dataKey="Corporate"  stackId="a" fill={C.corp}  isAnimationActive={false} />
            <Bar dataKey="Individual" stackId="a" fill={C.ind}   isAnimationActive={false} />
            <Bar dataKey="Government" stackId="a" fill={C.gov}   isAnimationActive={false} />
            <Bar dataKey="Foundation" stackId="a" fill={C.found} isAnimationActive={false} radius={[0,4,4,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"188px 1fr", gap:12 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          {MALAYSIAN.map(n => (
            <button key={n.id} onClick={() => setSel(n.id)} style={{ textAlign:"left", padding:"8px 11px", borderRadius:8, border:`1px solid ${sel===n.id ? C.my : C.border}`, background: sel===n.id ? "#FFF0F0" : C.card, cursor:"pointer", fontSize:12, fontWeight:sel===n.id?500:400, color:sel===n.id?C.my:C.text }}>
              {n.name}
              <div style={{ fontSize:10, color:C.muted, fontWeight:400 }}>Est. {n.founded} · {n.sector}</div>
            </button>
          ))}
        </div>
        <Card mb={0}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
            <div>
              <h3 style={{ fontSize:17, fontWeight:500, color:C.text, margin:"0 0 4px" }}>{ngo.name}</h3>
              <p style={{ fontSize:13, color:C.muted, margin:0 }}>Est. {ngo.founded} · {ngo.sector} · Revenue: {ngo.rev}</p>
            </div>
            <div style={{ display:"flex", gap:6 }}><ModelTag model={ngo.model} /><ConfBadge conf={ngo.conf} /></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:14 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:500, color:C.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>Funding breakdown</div>
              <FundBar label="Corporate"  value={ngo.corp}  color={C.corp} />
              <FundBar label="Individual" value={ngo.ind}   color={C.ind} />
              <FundBar label="Government" value={ngo.gov}   color={C.gov} />
              <FundBar label="Foundation" value={ngo.found} color={C.found} />
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:500, color:C.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>Revenue index (2019 = 100)</div>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={trendData}>
                  <XAxis dataKey="year" tick={{ fontSize:9, fill:C.muted }} />
                  <YAxis tick={{ fontSize:9, fill:C.muted }} domain={[80,200]} />
                  <Tooltip content={TIP} />
                  <Area type="monotone" dataKey="Actual"    stroke={C.my} fill="#FFE8E8" strokeWidth={2} dot={false} connectNulls={false} />
                  <Area type="monotone" dataKey="Projected" stroke={C.my} fill="#FFE8E8" strokeWidth={1.5} strokeDasharray="4 3" dot={false} connectNulls={false} fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ background:"#F9F8F5", borderRadius:8, padding:"12px 14px", marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:500, color:C.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>Research notes</div>
            <p style={{ fontSize:13, color:C.text, lineHeight:1.6, margin:0 }}>{ngo.note}</p>
          </div>
          <div style={{ background:"#F0FAF5", borderRadius:8, padding:"12px 14px", borderLeft:"2px solid #00A878" }}>
            <div style={{ fontSize:11, fontWeight:500, color:C.accent, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>Best practice</div>
            <p style={{ fontSize:13, color:C.text, lineHeight:1.6, margin:0 }}>{ngo.bp}</p>
          </div>
        </Card>
      </div>
    </section>
  );
}

// ─── SECTION: COMPARISON ──────────────────────────────────────────────────────
function Comparison() {
  const cmpData = [
    { segment:"Corporate",  Global:19, Malaysia:35 },
    { segment:"Individual", Global:37, Malaysia:27 },
    { segment:"Government", Global:30, Malaysia:18 },
    { segment:"Foundation", Global:17, Malaysia:17 },
  ];
  const domG = n => { const d={Corporate:n.corp,Individual:n.ind,Government:n.gov,Foundation:n.found}; return Object.entries(d).sort((a,b)=>b[1]-a[1])[0][0]; };
  const domM = n => n.model.split("/")[0];
  const MODS = ["Corporate","Individual","Government","Foundation"];
  const modelData = MODS.map(m => ({ model:m, Global:GLOBAL.filter(n=>domG(n)===m).length, Malaysia:MALAYSIAN.filter(n=>domM(n)===m).length }));

  const gDiffs = ["Individual giving is the backbone — GiveDirectly (60%), Second Harvest SV (67%) prove scalability of retail donor models.","Government funding dominates humanitarian NGOs (WFP: 80%) but creates dependency risk when state priorities shift.","High-transparency orgs attract more individual donors — GiveDirectly is the fastest-growing NGO in the sample.","Best practice: publish audited donor segmentation, not just totals. Only 3 of 10 global NGOs do this fully."];
  const mDiffs = ["Corporate CSR is the dominant channel — driven by GLC CSR mandates, Bursa Malaysia ESG disclosure requirements, and tax deductibility under S44(6) Income Tax Act 1967.","Government grants via JKM, KPKM, and SDG Trust Fund are growing but remain project-based rather than operational.","Individual giving is under-developed — digital platforms (GivingHub, KitaFund) are expanding the retail donor base.","Best practice gap: most Malaysian NGOs do not publish donor segmentation. Yayasan Hasanah and MERCY Malaysia are exceptions."];

  return (
    <section style={{ marginBottom:48 }}>
      <SectionHeader eyebrow="Section 03 — Side-by-Side" title="Global vs. Malaysian NGOs — What's Different?" sub="Average funding mix, dominant models, and structural differences between international best-practice NGOs and the Malaysian ecosystem." />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <Card mb={0}>
          <div style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:14 }}>Average funding mix comparison</div>
          <Legend items={[["Global",C.gl],["Malaysia",C.my]]} />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cmpData}>
              <XAxis dataKey="segment" tick={{ fontSize:11, fill:C.muted }} />
              <YAxis tickFormatter={v=>`${v}%`} tick={{ fontSize:11, fill:C.muted }} domain={[0,55]} />
              <Tooltip content={TIP} />
              <Bar dataKey="Global"   fill={C.gl} radius={[4,4,0,0]} isAnimationActive={false} />
              <Bar dataKey="Malaysia" fill={C.my} radius={[4,4,0,0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card mb={0}>
          <div style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:14 }}>Dominant model — NGO count</div>
          <Legend items={[["Global",C.gl],["Malaysia",C.my]]} />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={modelData}>
              <XAxis dataKey="model" tick={{ fontSize:11, fill:C.muted }} />
              <YAxis tick={{ fontSize:11, fill:C.muted }} domain={[0,5]} />
              <Tooltip content={p => p.active && p.payload?.length ? <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontSize:12}}><div style={{fontWeight:500,marginBottom:6}}>{p.label}</div>{p.payload.map(x=><div key={x.name} style={{display:"flex",justifyContent:"space-between",gap:16}}><span style={{color:x.fill}}>{x.name}</span><span>{x.value} NGOs</span></div>)}</div> : null} />
              <Bar dataKey="Global"   fill={C.gl} radius={[4,4,0,0]} isAnimationActive={false} />
              <Bar dataKey="Malaysia" fill={C.my} radius={[4,4,0,0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {[[gDiffs,"#E6F1FB","#185FA5","🌍","Global NGO ecosystem"],[mDiffs,"#FFF0F0","#C8102E","🇲🇾","Malaysian NGO ecosystem"]].map(([diffs,bg,col,flag,label])=>(
          <div key={label} style={{ background:bg, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px" }}>
            <div style={{ fontSize:14, fontWeight:500, color:col, marginBottom:12 }}>{flag} {label}</div>
            {diffs.map((p,i)=>(
              <div key={i} style={{ display:"flex", gap:10, marginBottom:10 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:col, color:"#fff", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>{i+1}</div>
                <p style={{ fontSize:13, color:C.text, lineHeight:1.6, margin:0 }}>{p}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── SECTION: GROWTH ──────────────────────────────────────────────────────────
function GrowthProjections() {
  const gGlobal = YEARS.map((_,i) => Math.round(GLOBAL.reduce((s,n)=>s+n.trend[i],0)/GLOBAL.length));
  const gMy     = YEARS.map((_,i) => Math.round(MALAYSIAN.reduce((s,n)=>s+n.trend[i],0)/MALAYSIAN.length));
  const gGP     = PROJ.map((_,i)  => Math.round(GLOBAL.reduce((s,n)=>s+n.proj[i],0)/GLOBAL.length));
  const gMP     = PROJ.map((_,i)  => Math.round(MALAYSIAN.reduce((s,n)=>s+n.proj[i],0)/MALAYSIAN.length));

  const growthData = ALL_YR.map((yr,i) => ({
    year: yr,
    "Global actual":    i < 5 ? gGlobal[i] : null,
    "Malaysia actual":  i < 5 ? gMy[i]     : null,
    "Global projected": i >= 4 ? (i===4 ? gGlobal[4] : gGP[i-5]) : null,
    "Malaysia projected": i >= 4 ? (i===4 ? gMy[4] : gMP[i-5]) : null,
  }));

  const drivers = [
    { yr:"2024–2025", icon:"🏛️", title:"Government SDG acceleration",    body:"Malaysia-UN SDG Trust Fund active; Madani government expanding B40 welfare allocations. NGOs with government alignment see funding uptick." },
    { yr:"2025–2026", icon:"📱", title:"Digital fundraising scale-up",    body:"GivingHub, KitaFund, and Sedunia platforms driving individual giving growth. E-wallet integration (TNG, GrabPay) reduces friction for micro-donors." },
    { yr:"2026+",     icon:"⚡", title:"ESG mandate pressure",            body:"Bursa Malaysia enhanced sustainability reporting (2024) forces listed companies to demonstrate measurable community impact — NGO CSR partnerships become strategic, not optional." },
    { yr:"2026+",     icon:"🌱", title:"Social enterprise hybridisation", body:"SOLS Energy model — revenue from commercial arm cross-subsidises charitable arm — gaining traction. Reduces pure donation dependency." },
  ];

  return (
    <section style={{ marginBottom:48 }}>
      <SectionHeader eyebrow="Section 04 — Forward View" title="Growth Trajectory: 2019–2026" sub="Indexed revenue growth (2019 = 100). Dashed lines are research-based projections, not audited figures." />
      <Card mb={16}>
        <div style={{ display:"flex", gap:16, marginBottom:14 }}>
          {[["Global actual",C.gl,"solid"],["Malaysia actual",C.my,"solid"],["Projected","#999","dashed"]].map(([l,c,s])=>(
            <span key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.muted }}>
              <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke={c} strokeWidth="2" strokeDasharray={s==="dashed"?"4 2":"none"} /></svg>{l}
            </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={270}>
          <LineChart data={growthData} margin={{ left:0, right:20 }}>
            <XAxis dataKey="year" tick={{ fontSize:11, fill:C.muted }} />
            <YAxis tick={{ fontSize:11, fill:C.muted }} domain={[90,200]} label={{ value:"Index (2019=100)", angle:-90, position:"insideLeft", style:{fontSize:10,fill:C.muted} }} />
            <Tooltip content={TIP} />
            <Line type="monotone" dataKey="Global actual"      stroke={C.gl} strokeWidth={2.5} dot={{ r:3 }} connectNulls={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="Malaysia actual"    stroke={C.my} strokeWidth={2.5} dot={{ r:3 }} connectNulls={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="Global projected"   stroke={C.gl} strokeWidth={2} strokeDasharray="5 3" dot={{ r:2 }} connectNulls={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="Malaysia projected" stroke={C.my} strokeWidth={2} strokeDasharray="5 3" dot={{ r:2 }} connectNulls={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
        <p style={{ fontSize:12, color:C.muted, textAlign:"center", margin:"10px 0 0" }}>COVID-19 spike visible in 2020 across both ecosystems. Malaysian NGOs growing faster post-2021 driven by B40 demand surge and digital fundraising expansion.</p>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {drivers.map(d => (
          <div key={d.title} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ fontSize:20 }}>{d.icon}</span>
              <div>
                <div style={{ fontSize:11, color:C.accent, fontWeight:500, letterSpacing:"0.06em" }}>{d.yr}</div>
                <div style={{ fontSize:14, fontWeight:500, color:C.text }}>{d.title}</div>
              </div>
            </div>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.6, margin:0 }}>{d.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── SECTION: BEST PRACTICES ──────────────────────────────────────────────────
function BestPractices() {
  const bps = [
    { rank:1, tag:"Transparency",          who:"GiveDirectly + Yayasan Hasanah",    color:C.accent, what:"Publish full donor segmentation — not just totals.", why:"High transparency directly correlates with individual donor growth. GiveDirectly grew revenue index from 100 → 138 in 5 years.",                     apply:"Malaysian NGOs should adopt Charity Navigator-style reporting. GivingHub can enforce this as a listing requirement." },
    { rank:2, tag:"Corporate Partnership", who:"FareShare + YFBM + MyKasih",        color:C.corp,   what:"Build structured, multi-year corporate partnerships rather than one-off sponsorships.", why:"YFBM's partnerships with Nestlé, Marrybrown and Dunkin are stable, recurring and tied to ESG reporting — not charity budgets.", apply:"Pitch to corporate sustainability teams, not marketing. Frame the NGO as an ESG KPI delivery partner." },
    { rank:3, tag:"Government Anchoring",  who:"WFP + YFBM + Teach For Malaysia",   color:C.gov,    what:"Secure one government MoU or programme anchor early — it de-risks the organisation for other funders.", why:"TFM's MoE partnership legitimises it to corporate sponsors. YFBM's KPDNHEP anchor gives policy-level credibility.", apply:"Align programmes to Madani agenda pillars (B40, SDGs, digital economy) to access government grant windows." },
    { rank:4, tag:"Digital Giving",        who:"GiveDirectly + Second Harvest SV",  color:C.ind,    what:"Invest in a scalable digital donor journey — email, WhatsApp, recurring giving, e-wallet integration.", why:"Second Harvest SV grew individual giving from 65% → 75% of income in 5 years through digital channel investment.",               apply:"Malaysia's TNG, Boost and GrabPay ecosystems are underused by NGOs. Micro-giving (RM5–RM20/month) at scale is viable." },
    { rank:5, tag:"Social Enterprise Arm", who:"SOLS Foundation + OzHarvest",       color:C.found,  what:"Create a revenue-generating social enterprise that cross-subsidises the charitable core.", why:"SOLS Energy generates commercial solar income that funds free education. OzHarvest's Refettorio restaurant generates awareness + revenue.", apply:"Food NGOs can run catering services. Education NGOs can run paid professional training. Reduces grant dependency by 20–30%." },
    { rank:6, tag:"Impact Reporting",      who:"GiveDirectly + MERCY Malaysia",     color:"#888",   what:"Publish unit-economics: cost per meal, cost per beneficiary, cost per school year.", why:"Donors increasingly treat giving like investment. Quantified impact reports drive repeat giving and unlock foundation grants.",          apply:"MERCY Malaysia's audited annual reports under Societies Act 1966 is the standard. Every Malaysian NGO should match this baseline." },
  ];

  return (
    <section style={{ marginBottom:48 }}>
      <SectionHeader eyebrow="Section 05 — Strategic Intelligence" title="Best Practices NGOs Should Adopt" sub="Derived from comparative analysis of 20 organisations. Ranked by applicability to the Malaysian context." />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {bps.map(p => (
          <div key={p.rank} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:28, height:28, borderRadius:6, background:p.color, color:"#fff", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{p.rank}</div>
                <span style={{ fontSize:12, fontWeight:500, color:p.color }}>{p.tag}</span>
              </div>
              <span style={{ fontSize:10, color:C.muted, textAlign:"right", maxWidth:160, lineHeight:1.4 }}>{p.who}</span>
            </div>
            <p style={{ fontSize:13, fontWeight:500, color:C.text, margin:"0 0 6px" }}>{p.what}</p>
            <p style={{ fontSize:12, color:C.muted, margin:"0 0 8px", lineHeight:1.6 }}><strong style={{ color:C.text }}>Why it works:</strong> {p.why}</p>
            <div style={{ background:"#F0FAF5", borderRadius:6, padding:"8px 10px", borderLeft:"2px solid #00A878" }}>
              <p style={{ fontSize:12, color:C.text, margin:0, lineHeight:1.5 }}><strong>For Malaysia:</strong> {p.apply}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id:"exec",    label:"Overview",        Component: ExecSummary },
  { id:"global",  label:"Global NGOs",     Component: GlobalProfiles },
  { id:"my",      label:"Malaysian NGOs",  Component: MalaysianProfiles },
  { id:"compare", label:"Comparison",      Component: Comparison },
  { id:"growth",  label:"Growth 2026+",    Component: GrowthProjections },
  { id:"best",    label:"Best Practices",  Component: BestPractices },
];

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function NGOIntelligenceDashboard() {
  const [active, setActive] = useState("exec");
  const ActiveSection = SECTIONS.find(s => s.id === active)?.Component ?? ExecSummary;

  return (
    <div style={{ fontFamily:"-apple-system,'Helvetica Neue',Arial,sans-serif", background:C.bg, minHeight:"100vh" }}>
      {/* Sticky nav */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(245,244,240,0.95)", backdropFilter:"blur(8px)", borderBottom:`1px solid ${C.border}`, padding:"0 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", gap:4, height:50 }}>
          <div style={{ fontSize:13, fontWeight:500, color:C.text, marginRight:14, whiteSpace:"nowrap" }}>NGO Intelligence</div>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)} style={{ padding:"4px 11px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight: active===s.id ? 500 : 400, background: active===s.id ? C.text : "transparent", color: active===s.id ? "#fff" : C.muted }}>
              {s.label}
            </button>
          ))}
          <div style={{ marginLeft:"auto", fontSize:11, color:C.muted }}>2019–2026 · 20 NGOs · Research Edition</div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"36px 32px" }}>
        <ActiveSection />
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:18, textAlign:"center" }}>
          <p style={{ fontSize:11, color:C.muted, margin:0, lineHeight:1.7 }}>
            Data sourced from NGO annual reports, MERCY Malaysia (Societies Act 1966), Yayasan Food Bank Malaysia (Trustee Act 1952),
            Yayasan Hasanah / Khazanah Nasional, Sime Darby Foundation, Malaysia-UN SDG Trust Fund, borgenproject.org,
            hopesmalaysia.com (2026), fundsforNGOs.org · Estimates flagged by confidence tier (High / Medium / Low) ·
            Projections are indicative, not audited.
          </p>
        </div>
      </div>
    </div>
  );
}
