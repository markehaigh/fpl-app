import React, { useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// ------------------------------------------------------------------
// FPL Companion — clickable prototype with realistic mock data.
// In production this data comes live from the FPL API using the
// user's team ID. Everything below mirrors that API's shape.
// ------------------------------------------------------------------

const T = {
  bg: "#0E1A15",
  surface: "#16261F",
  surface2: "#1D332A",
  line: "rgba(255,255,255,0.08)",
  text: "#EAF4EE",
  dim: "#8FA89B",
  gold: "#F2C14E",
  buy: "#7FE3B0",
  sell: "#FF7A70",
  pitchA: "#3E9447",
  pitchB: "#35843E",
};

const manager = {
  teamName: "Kicking & Screaming",
  gw: 38,
  gwPoints: 71,
  total: 2241,
  rank: "312,406",
  rankDelta: "+41,208",
  bank: 1.7,
  freeTransfers: 2,
  chips: ["Bench Boost"],
};

const squad = {
  GK: [{ n: "Raya", club: "ARS", price: 5.6, pts: 9, form: 5.3, cap: false }],
  DEF: [
    { n: "Gabriel", club: "ARS", price: 6.3, pts: 6, form: 4.8 },
    { n: "Van Dijk", club: "LIV", price: 6.4, pts: 2, form: 3.9 },
    { n: "Muñoz", club: "CRY", price: 5.1, pts: 8, form: 5.6 },
  ],
  MID: [
    { n: "Saka", club: "ARS", price: 10.4, pts: 12, form: 7.8 },
    { n: "Palmer", club: "CHE", price: 10.9, pts: 14, form: 8.4, cap: true },
    { n: "Fernandes", club: "MUN", price: 8.6, pts: 3, form: 4.1 },
    { n: "Mbeumo", club: "MUN", price: 7.9, pts: 7, form: 6.2 },
  ],
  FWD: [
    { n: "Haaland", club: "MCI", price: 14.8, pts: 13, form: 8.9 },
    { n: "Watkins", club: "AVL", price: 8.7, pts: 1, form: 2.6 },
    { n: "Isak", club: "LIV", price: 12.1, pts: 8, form: 6.7 },
  ],
};

const bench = [
  { n: "Dúbravka", club: "BUR", price: 4.1, pts: 2, pos: "GK" },
  { n: "Aina", club: "NFO", price: 4.9, pts: 1, pos: "DEF" },
  { n: "Kudus", club: "TOT", price: 6.4, pts: 5, pos: "MID" },
  { n: "Wood", club: "NFO", price: 6.9, pts: 2, pos: "FWD" },
];

// Second mock team, used to demo loading a different team ID.
// In production, makeTeam(id) is replaced by a live FPL API call.
const altSquad = {
  GK: [{ n: "Sánchez", club: "CHE", price: 5.0, pts: 6 }],
  DEF: [
    { n: "Trent", club: "LIV", price: 7.2, pts: 5 },
    { n: "Gvardiol", club: "MCI", price: 6.1, pts: 9 },
    { n: "Colwill", club: "CHE", price: 4.9, pts: 6 },
    { n: "Porro", club: "TOT", price: 5.6, pts: 2 },
  ],
  MID: [
    { n: "Foden", club: "MCI", price: 9.3, pts: 11 },
    { n: "Palmer", club: "CHE", price: 10.9, pts: 14, cap: true },
    { n: "Gordon", club: "NEW", price: 7.7, pts: 6 },
    { n: "Semenyo", club: "BOU", price: 6.8, pts: 8 },
  ],
  FWD: [
    { n: "Haaland", club: "MCI", price: 14.8, pts: 13 },
    { n: "Ekitiké", club: "LIV", price: 8.9, pts: 7 },
  ],
};

const altBench = [
  { n: "Petrović", club: "BOU", price: 4.4, pts: 1, pos: "GK" },
  { n: "Estève", club: "BUR", price: 4.2, pts: 6, pos: "DEF" },
  { n: "Anderson", club: "NFO", price: 5.4, pts: 2, pos: "MID" },
  { n: "Mateta", club: "CRY", price: 7.4, pts: 9, pos: "FWD" },
];

function makeTeam(id) {
  const seed = [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  const alt = seed % 2 === 1;
  return {
    manager: {
      ...manager,
      teamName: `FPL Team #${id}`,
      gwPoints: 48 + (seed % 40),
      total: 1900 + (seed % 600),
      rank: ((seed * 13577) % 900000).toLocaleString(),
      bank: ((seed % 30) / 10).toFixed(1) * 1,
      freeTransfers: (seed % 2) + 1,
    },
    squad: alt ? altSquad : squad,
    bench: alt ? altBench : bench,
  };
}

const suggestions = [
  {
    out: { n: "Watkins", club: "AVL", price: 8.7, form: 2.6 },
    in: { n: "João Pedro", club: "CHE", price: 8.0, form: 7.1 },
    gain: "+9.4",
    cost: "Free transfer",
    why:
      "Watkins has blanked in 5 of his last 6 and Villa face MCI and ARS next. João Pedro is on penalties, has returned in 4 straight, and Chelsea's next 4 fixtures average FDR 2.2. You also bank £0.7m.",
  },
  {
    out: { n: "Fernandes", club: "MUN", price: 8.6, form: 4.1 },
    in: { n: "Eze", club: "ARS", price: 7.8, form: 6.8 },
    gain: "+5.1",
    cost: "Free transfer",
    why:
      "Fernandes is being rotated deeper with lower xGI (0.31/90 over 4 GWs). Eze is Arsenal's top attacking-returns midfielder per £ and has the league's easiest 3-game run.",
  },
  {
    out: { n: "Van Dijk", club: "LIV", price: 6.4, form: 3.9 },
    in: { n: "Gvardiol", club: "MCI", price: 6.1, form: 6.0 },
    gain: "+3.7",
    cost: "−4 pts (hit)",
    why:
      "Only worth it with your Bench Boost: Liverpool's defence has 1 clean sheet in 7, while City have the highest projected clean-sheet odds for the run-in and Gvardiol adds attacking threat.",
  },
];

const topPlayers = [
  { n: "Haaland", club: "MCI", pos: "FWD", price: 14.8, sel: "84.2%", form: 8.9, total: 262, xgi: 1.21 },
  { n: "Palmer", club: "CHE", pos: "MID", price: 10.9, sel: "61.7%", form: 8.4, total: 231, xgi: 0.94 },
  { n: "Saka", club: "ARS", pos: "MID", price: 10.4, sel: "55.3%", form: 7.8, total: 218, xgi: 0.88 },
  { n: "João Pedro", club: "CHE", pos: "FWD", price: 8.0, sel: "24.9%", form: 7.1, total: 169, xgi: 0.79 },
  { n: "Eze", club: "ARS", pos: "MID", price: 7.8, sel: "19.4%", form: 6.8, total: 171, xgi: 0.71 },
  { n: "Isak", club: "LIV", pos: "FWD", price: 12.1, sel: "47.8%", form: 6.7, total: 209, xgi: 0.92 },
  { n: "Muñoz", club: "CRY", pos: "DEF", price: 5.1, sel: "31.2%", form: 5.6, total: 154, xgi: 0.38 },
  { n: "Gvardiol", club: "MCI", pos: "DEF", price: 6.1, sel: "22.6%", form: 6.0, total: 158, xgi: 0.29 },
];

const fixtures = [
  { club: "ARS", run: [["wol", 2], ["BHA", 2], ["ful", 2]] },
  { club: "CHE", run: [["sun", 2], ["BOU", 2], ["eve", 3]] },
  { club: "MCI", run: [["BUR", 1], ["whu", 2], ["AVL", 3]] },
  { club: "LIV", run: [["BRE", 2], ["mci", 5], ["TOT", 4]] },
  { club: "MUN", run: [["tot", 4], ["NEW", 4], ["cry", 3]] },
  { club: "AVL", run: [["MCI", 5], ["ars", 5], ["LEE", 2]] },
];

const fdrColor = (d) =>
  ({ 1: "#2E8B57", 2: "#56B87A", 3: "#9AA39B", 4: "#E2796B", 5: "#C7372F" }[d]);

// Price change predictions — driven by net transfers in/out.
// progress = how close a player is to the rise/fall threshold (100% = changes tonight).
const priceRisers = [
  { n: "João Pedro", club: "CHE", price: 8.0, net: "+312,440", progress: 102, owned: false },
  { n: "Eze", club: "ARS", price: 7.8, net: "+201,883", progress: 96, owned: false },
  { n: "Semenyo", club: "BOU", price: 6.8, net: "+148,067", progress: 81, owned: false },
  { n: "Gvardiol", club: "MCI", price: 6.1, net: "+97,520", progress: 64, owned: false },
  { n: "Mateta", club: "CRY", price: 7.4, net: "+71,254", progress: 48, owned: false },
];

const priceFallers = [
  { n: "Watkins", club: "AVL", price: 8.7, net: "−287,902", progress: 98, owned: true },
  { n: "Fernandes", club: "MUN", price: 8.6, net: "−176,330", progress: 77, owned: true },
  { n: "Van Dijk", club: "LIV", price: 6.4, net: "−118,415", progress: 59, owned: true },
  { n: "Wood", club: "NFO", price: 6.9, net: "−84,772", progress: 41, owned: true },
];

// ---------------------------------------------------------------

const Chip = ({ children, color = T.dim }) => (
  <span
    style={{
      fontSize: 10,
      letterSpacing: 1,
      textTransform: "uppercase",
      color,
      border: `1px solid ${color}55`,
      borderRadius: 999,
      padding: "2px 8px",
      fontWeight: 600,
    }}
  >
    {children}
  </span>
);

const Player = ({ p, small }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: small ? 64 : 72 }}>
    <div
      style={{
        position: "relative",
        width: small ? 34 : 40,
        height: small ? 38 : 44,
        background: "linear-gradient(180deg,#F6F8F7 0%,#DCE5E0 100%)",
        clipPath: "polygon(20% 0, 80% 0, 100% 22%, 88% 30%, 88% 100%, 12% 100%, 12% 30%, 0 22%)",
        marginBottom: 4,
      }}
    >
      {p.cap && (
        <div
          style={{
            position: "absolute", top: -7, right: -9, width: 17, height: 17, borderRadius: "50%",
            background: T.gold, color: "#1A1A1A", fontSize: 10, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          C
        </div>
      )}
    </div>
    <div
      style={{
        background: "#0C1410", color: T.text, fontSize: small ? 10 : 11, fontWeight: 700,
        padding: "2px 6px", borderRadius: "3px 3px 0 0", width: "100%", textAlign: "center",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}
    >
      {p.n}
    </div>
    <div
      style={{
        background: T.gold, color: "#1A1A1A", fontSize: small ? 10 : 11, fontWeight: 800,
        padding: "1px 6px", borderRadius: "0 0 3px 3px", width: "100%", textAlign: "center",
      }}
    >
      {p.pts != null ? `${p.cap ? p.pts * 2 : p.pts} pts` : p.club}
    </div>
  </div>
);

const Row = ({ players }) => (
  <div style={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}>
    {players.map((p) => (
      <Player key={p.n} p={p} />
    ))}
  </div>
);

function PitchView({ squad, bench }) {
  return (
    <div>
      <div
        style={{
          borderRadius: 14,
          padding: "30px 8px 26px",
          background: [
            // soft floodlight falloff
            "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 55%)",
            // fine grass grain
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 2px, rgba(255,255,255,0.02) 2px 4px)",
            // mown stripes
            `repeating-linear-gradient(180deg, ${T.pitchA} 0 52px, ${T.pitchB} 52px 104px)`,
          ].join(", "),
          boxShadow: "inset 0 0 60px rgba(0,30,5,0.45)",
          border: `1px solid ${T.line}`,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Pitch markings */}
        <svg
          viewBox="0 0 400 560"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        >
          <g stroke="rgba(255,255,255,0.55)" strokeWidth="2" fill="none">
            {/* touchlines */}
            <rect x="12" y="12" width="376" height="536" rx="2" />
            {/* penalty area + six-yard box (top goal) */}
            <rect x="100" y="12" width="200" height="86" />
            <rect x="152" y="12" width="96" height="36" />
            {/* penalty spot + D */}
            <circle cx="200" cy="72" r="2.5" fill="rgba(255,255,255,0.55)" stroke="none" />
            <path d="M 158 98 A 46 46 0 0 0 242 98" />
            {/* halfway line + centre circle at the bottom edge */}
            <line x1="12" y1="548" x2="388" y2="548" />
            <path d="M 142 548 A 58 58 0 0 1 258 548" />
            <circle cx="200" cy="548" r="2.5" fill="rgba(255,255,255,0.55)" stroke="none" />
            {/* corner arcs */}
            <path d="M 12 26 A 14 14 0 0 0 26 12" />
            <path d="M 374 12 A 14 14 0 0 0 388 26" />
          </g>
        </svg>
        <Row players={squad.GK} />
        <Row players={squad.DEF} />
        <Row players={squad.MID} />
        <Row players={squad.FWD} />
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.dim, marginBottom: 8 }}>
          Bench
        </div>
        <div
          style={{
            display: "flex", justifyContent: "space-evenly", background: T.surface,
            border: `1px solid ${T.line}`, borderRadius: 12, padding: "12px 4px",
          }}
        >
          {bench.map((p) => (
            <Player key={p.n} p={p} small />
          ))}
        </div>
      </div>
    </div>
  );
}

function Transfers({ manager }) {
  const [applied, setApplied] = useState([]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Chip color={T.buy}>{manager.freeTransfers} free transfers</Chip>
        <Chip color={T.gold}>£{manager.bank.toFixed(1)}m in the bank</Chip>
      </div>
      {suggestions.map((s, i) => {
        const done = applied.includes(i);
        return (
          <div
            key={i}
            style={{
              background: T.surface, border: `1px solid ${done ? T.buy + "66" : T.line}`,
              borderRadius: 14, padding: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Barlow Condensed', sans-serif" }}>
                <div>
                  <div style={{ color: T.sell, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>Out</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{s.out.n}</div>
                  <div style={{ fontSize: 12, color: T.dim }}>{s.out.club} · £{s.out.price}m</div>
                </div>
                <div style={{ color: T.dim, fontSize: 20, padding: "0 4px" }}>→</div>
                <div>
                  <div style={{ color: T.buy, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>In</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{s.in.n}</div>
                  <div style={{ fontSize: 12, color: T.dim }}>{s.in.club} · £{s.in.price}m</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: T.buy, fontWeight: 800, fontSize: 18 }}>{s.gain}</div>
                <div style={{ fontSize: 10, color: T.dim, textTransform: "uppercase", letterSpacing: 1 }}>
                  proj. pts / 4 GWs
                </div>
              </div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: "#C4D6CB", margin: "0 0 12px" }}>{s.why}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Chip color={s.cost.includes("hit") ? T.sell : T.buy}>{s.cost}</Chip>
              <button
                onClick={() => setApplied((a) => (done ? a.filter((x) => x !== i) : [...a, i]))}
                style={{
                  background: done ? "transparent" : T.buy, color: done ? T.buy : "#10241A",
                  border: `1px solid ${T.buy}`, borderRadius: 8, padding: "8px 14px",
                  fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}
              >
                {done ? "Added to plan ✓" : "Add to transfer plan"}
              </button>
            </div>
          </div>
        );
      })}
      <p style={{ fontSize: 11, color: T.dim, textAlign: "center", margin: "4px 0 0" }}>
        Suggestions are planned in here, then confirmed on the official FPL site.
      </p>
    </div>
  );
}

function Stats() {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.7fr 0.7fr 0.7fr 0.7fr", padding: "10px 14px", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: T.dim, borderBottom: `1px solid ${T.line}` }}>
        <div>Player</div><div>Price</div><div>Sel.</div><div>Form</div><div>Pts</div>
      </div>
      {topPlayers.map((p) => (
        <div key={p.n} style={{ display: "grid", gridTemplateColumns: "1.6fr 0.7fr 0.7fr 0.7fr 0.7fr", padding: "11px 14px", fontSize: 13, borderBottom: `1px solid ${T.line}`, alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700 }}>{p.n}</div>
            <div style={{ fontSize: 11, color: T.dim }}>{p.club} · {p.pos}</div>
          </div>
          <div>£{p.price}m</div>
          <div style={{ color: T.dim }}>{p.sel}</div>
          <div style={{ color: p.form >= 6.5 ? T.buy : T.text }}>{p.form}</div>
          <div style={{ fontWeight: 700, color: T.gold }}>{p.total}</div>
        </div>
      ))}
    </div>
  );
}

function PriceRow({ p, dir }) {
  const color = dir === "up" ? T.buy : T.sell;
  const tonight = p.progress >= 95;
  const losesValue = p.owned && dir === "down";
  const buyNudge = !p.owned && dir === "up";
  return (
    <div style={{ padding: "11px 14px", borderBottom: `1px solid ${T.line}`, background: losesValue ? T.sell + "0D" : buyNudge ? T.buy + "08" : "transparent" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {losesValue && (
            <span
              title="This player is in your team — if his price falls you lose team value"
              aria-label="Warning: you will lose team value"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 18, height: 18, borderRadius: "50%", background: T.sell,
                color: "#1A0E0C", fontSize: 12, fontWeight: 900, flexShrink: 0,
              }}
            >
              !
            </span>
          )}
          {buyNudge && (
            <span
              title="Not in your team — buy before the rise to bank the value"
              aria-label="Tip: buy before the price rises"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 18, height: 18, borderRadius: "50%", background: T.buy,
                color: "#0E1F16", fontSize: 11, fontWeight: 900, flexShrink: 0,
              }}
            >
              £
            </span>
          )}
          <span style={{ fontWeight: 700, fontSize: 13 }}>{p.n}</span>
          <span style={{ fontSize: 11, color: T.dim }}>{p.club} · £{p.price.toFixed(1)}m</span>
          {p.owned && <Chip color={T.gold}>In your team</Chip>}
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color }}>
            {dir === "up" ? "▲" : "▼"} £{(p.price + (dir === "up" ? 0.1 : -0.1)).toFixed(1)}m
          </span>
          {tonight && (
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color, marginLeft: 6 }}>
              tonight
            </span>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, height: 6, background: T.surface2, borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: `${Math.min(p.progress, 100)}%`, height: "100%", background: color, borderRadius: 999 }} />
        </div>
        <span style={{ fontSize: 11, color: T.dim, width: 34, textAlign: "right" }}>{Math.min(p.progress, 100)}%</span>
      </div>
      <div style={{ fontSize: 11, color: T.dim, marginTop: 5 }}>
        Net transfers today: {p.net}
        {losesValue && (
          <span style={{ color: T.sell, fontWeight: 700 }}>
            {" "}· You'll lose £0.1m team value{tonight ? " tonight" : " if he drops"}
          </span>
        )}
        {buyNudge && (
          <span style={{ color: T.buy, fontWeight: 700 }}>
            {" "}· Buy {tonight ? "before tonight" : "before he rises"} to bank £0.1m value
          </span>
        )}
      </div>
    </div>
  );
}

function Prices() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontSize: 11, color: T.dim }}>
        Prices move when enough managers transfer a player in or out. The bar shows how close each player is to a change — 95%+ usually moves at the overnight update.
      </div>
      <div style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.buy, borderBottom: `1px solid ${T.line}`, fontWeight: 700 }}>
          ▲ Predicted risers
        </div>
        {priceRisers.map((p) => (
          <PriceRow key={p.n} p={p} dir="up" />
        ))}
      </div>
      <div style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.sell, borderBottom: `1px solid ${T.line}`, fontWeight: 700 }}>
          ▼ Predicted fallers
        </div>
        {priceFallers.map((p) => (
          <PriceRow key={p.n} p={p} dir="down" />
        ))}
      </div>
      <div style={{ fontSize: 11, color: T.dim, textAlign: "center" }}>
        Tip: buy predicted risers before the change to bank the value, and move fallers out before they drop.
      </div>
    </div>
  );
}

function Fixtures() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 11, color: T.dim, marginBottom: 2 }}>
        Next three fixtures · darker red = harder. CAPS = home.
      </div>
      {fixtures.map((f) => (
        <div key={f.club} style={{ display: "flex", alignItems: "center", gap: 10, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: "10px 14px" }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, width: 52 }}>{f.club}</div>
          <div style={{ display: "flex", gap: 6, flex: 1 }}>
            {f.run.map(([opp, d], i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", background: fdrColor(d), color: "#fff", borderRadius: 6, padding: "6px 0", fontSize: 12, fontWeight: 700 }}>
                {opp}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------- Live FPL API ----------------
// The FPL API doesn't allow direct browser calls (no CORS headers),
// so requests go through a proxy. In production, replace with your
// own tiny backend route for reliability.
const FPL = "https://fantasy.premierleague.com/api";
// Tries your own Vercel proxy first (/api/fpl), then falls back to a
// public proxy so the app still works when run outside Vercel.
const getJSON = async (url) => {
  const path = url.replace(`${FPL}/`, "");
  try {
    const r = await fetch(`/api/fpl?path=${encodeURIComponent(path)}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } catch {
    const r = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }
};

async function fetchLiveTeam(id) {
  const boot = await getJSON(`${FPL}/bootstrap-static/`);
  const event =
    boot.events.find((e) => e.is_current) ||
    boot.events.find((e) => e.is_next) ||
    boot.events[boot.events.length - 1];
  const gw = event.id;

  const [entry, picksData] = await Promise.all([
    getJSON(`${FPL}/entry/${id}/`),
    getJSON(`${FPL}/entry/${id}/event/${gw}/picks/`),
  ]);

  const byId = Object.fromEntries(boot.elements.map((e) => [e.id, e]));
  const clubShort = Object.fromEntries(boot.teams.map((t) => [t.id, t.short_name]));
  const posName = { 1: "GK", 2: "DEF", 3: "MID", 4: "FWD" };

  const liveSquad = { GK: [], DEF: [], MID: [], FWD: [] };
  const liveBench = [];

  picksData.picks.forEach((p) => {
    const el = byId[p.element];
    const player = {
      n: el.web_name,
      club: clubShort[el.team],
      price: el.now_cost / 10,
      pts: el.event_points,
      form: parseFloat(el.form),
      cap: p.is_captain,
      pos: posName[el.element_type],
    };
    if (p.position <= 11) liveSquad[player.pos].push(player);
    else liveBench.push(player);
  });

  const h = picksData.entry_history;
  return {
    manager: {
      teamName: entry.name,
      gw,
      gwPoints: h.points,
      total: h.total_points,
      rank: (h.overall_rank ?? entry.summary_overall_rank ?? 0).toLocaleString(),
      bank: h.bank / 10,
      freeTransfers: 1,
      chips: [],
    },
    squad: liveSquad,
    bench: liveBench,
  };
}

export default function App() {
  const [tab, setTab] = useState("Team");
  const [idInput, setIdInput] = useState("");
  const [team, setTeam] = useState({ manager, squad, bench });
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("demo"); // demo | live | fallback

  const loadTeam = async () => {
    const id = idInput.trim();
    if (!id) return;
    setLoading(true);
    try {
      const live = await fetchLiveTeam(id);
      setTeam(live);
      setSource("live");
    } catch (err) {
      console.error("FPL fetch failed, using demo data:", err);
      setTeam(makeTeam(id));
      setSource("fallback");
    }
    setLoading(false);
    setTab("Team");
  };

  const tabs = {
    Team: <PitchView squad={team.squad} bench={team.bench} />,
    Transfers: <Transfers manager={team.manager} />,
    Prices: <Prices />,
    Stats: <Stats />,
    Fixtures: <Fixtures />,
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;600;700;800&display=swap');
        button:focus-visible, input:focus-visible { outline: 2px solid ${T.gold}; outline-offset: 2px; }`}</style>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 40px" }}>
        {/* Team ID loader */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <input
            value={idInput}
            onChange={(e) => setIdInput(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && loadTeam()}
            inputMode="numeric"
            placeholder="Enter your FPL team ID e.g. 4218765"
            aria-label="FPL team ID"
            style={{
              flex: 1, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 10,
              padding: "11px 14px", color: T.text, fontSize: 14, fontFamily: "inherit",
            }}
          />
          <button
            onClick={loadTeam}
            disabled={loading || !idInput.trim()}
            style={{
              background: idInput.trim() ? T.gold : T.surface2,
              color: idInput.trim() ? "#1A1A1A" : T.dim,
              border: "none", borderRadius: 10, padding: "0 18px",
              fontWeight: 800, fontSize: 14, cursor: idInput.trim() ? "pointer" : "default",
            }}
          >
            {loading ? "…" : "Load"}
          </button>
        </div>

        {source === "live" && (
          <div style={{ fontSize: 12, color: T.buy, background: T.buy + "14", border: `1px solid ${T.buy}44`, borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>
            ● Live data from the official FPL API — updated just now.
          </div>
        )}
        {source === "fallback" && (
          <div style={{ fontSize: 12, color: T.gold, background: T.gold + "14", border: `1px solid ${T.gold}44`, borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>
            Couldn't reach the FPL API from this preview, so you're seeing demo data. Once the app is deployed to a real site, this loads your actual current team.
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: T.dim }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: T.text }}>
              Fetching team…
            </div>
            <div style={{ fontSize: 12, marginTop: 6 }}>Pulling squad, bank and transfers from FPL</div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 30, fontWeight: 700, margin: 0, letterSpacing: 0.5 }}>
                  {team.manager.teamName}
                </h1>
                <Chip color={T.gold}>GW {team.manager.gw}</Chip>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 14 }}>
                {[
                  ["GW points", team.manager.gwPoints],
                  ["Total", team.manager.total.toLocaleString()],
                  ["Rank", team.manager.rank],
                  ["Bank", `£${team.manager.bank}m`],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700 }}>{v}</div>
                    <div style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: T.dim }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {Object.keys(tabs).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: 9, fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                    background: tab === t ? T.text : "transparent",
                    color: tab === t ? "#10241A" : T.dim,
                    border: `1px solid ${tab === t ? T.text : T.line}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {tabs[tab]}
          </>
        )}
      </div>
      <SpeedInsights />
    </div>
  );
}
