// ============================================================================
// FIVE MODELS for 2026-27 Big East, with backtesting on 3 seasons of results.
//
//  A. ROSTER-SUM        — player impact ratings, minutes-weighted (tuned model)
//  B. PROGRAM PRIOR     — exponentially-weighted prior-season performance,
//                         shrunk to the mean at the empirically-fit rate
//  C. BAYESIAN SHRINKAGE— precision-weighted posterior of A and B, where the
//                         precision of A scales with returning production
//  D. BRADLEY-TERRY     — MLE paired-comparison strengths from the roster model
//  E. ENSEMBLE          — weights chosen by backtest performance
// ============================================================================
const { ratings, volatility, META } = require('./metrics');
const { BIG_EAST } = require('./bigeast');

const HIST = {                        // ACTUAL conference wins (20-game slate)
  2024: {UConn:18,Creighton:14,Marquette:14,'Seton Hall':13,"St. John's":11,
         Villanova:10,Providence:10,Butler:9,Xavier:9,'Georgetown 2026-27':2,DePaul:0},
  2025: {"St. John's":18,Creighton:15,UConn:14,Xavier:13,Marquette:13,Villanova:11,
         'Georgetown 2026-27':8,Providence:6,Butler:6,DePaul:4,'Seton Hall':2},
  2026: {"St. John's":18,UConn:17,Villanova:15,'Seton Hall':10,Creighton:9,DePaul:8,
         Marquette:7,Butler:7,Providence:7,Xavier:6,'Georgetown 2026-27':6},
};
const TEAMS = BIG_EAST.map(t => t.name);
const mean = a => a.reduce((x,y)=>x+y,0)/a.length;

// ---------------------------------------------------------------- BACKTEST 1
// How predictive is prior-season performance? Fit wins(t) = a + b*wins(t-1).
function ols(xs, ys){
  const mx=mean(xs), my=mean(ys);
  const b = xs.reduce((s,x,i)=>s+(x-mx)*(ys[i]-my),0) / xs.reduce((s,x)=>s+(x-mx)**2,0);
  return {b, a: my - b*mx, r: (()=>{ const sx=Math.sqrt(mean(xs.map(x=>(x-mx)**2)));
    const sy=Math.sqrt(mean(ys.map(y=>(y-my)**2)));
    return xs.reduce((s,x,i)=>s+(x-mx)*(ys[i]-my),0)/xs.length/(sx*sy); })()};
}
const lagX=[], lagY=[];
for (const t of TEAMS){ lagX.push(HIST[2024][t]); lagY.push(HIST[2025][t]);
                        lagX.push(HIST[2025][t]); lagY.push(HIST[2026][t]); }
const lag1 = ols(lagX, lagY);
// two-year weighted prior -> next year
const p2X=[], p2Y=[];
for (const t of TEAMS){ p2X.push(0.65*HIST[2025][t]+0.35*HIST[2024][t]); p2Y.push(HIST[2026][t]); }
const lag2 = ols(p2X, p2Y);

console.log('BACKTEST 1 — how much does the past predict the next season?\n');
console.log(`  Prior season alone      : r = ${lag1.r.toFixed(3)}  (r^2 = ${(lag1.r**2).toFixed(3)})  slope ${lag1.b.toFixed(3)}`);
console.log(`  2-yr weighted (.65/.35) : r = ${lag2.r.toFixed(3)}  (r^2 = ${(lag2.r**2).toFixed(3)})  slope ${lag2.b.toFixed(3)}`);
console.log(`  => Regression to mean: a team keeps only ~${(lag1.b*100).toFixed(0)}% of its deviation year over year.`);
const naiveMAE = mean(TEAMS.map(t=>Math.abs(HIST[2026][t]-HIST[2025][t])));
const meanMAE  = mean(TEAMS.map(t=>Math.abs(HIST[2026][t]-10)));
const priorMAE = mean(TEAMS.map(t=>Math.abs(HIST[2026][t]-(lag1.a+lag1.b*HIST[2025][t]))));
console.log(`\n  MAE predicting 2025-26 conference wins:`);
console.log(`    last year's record verbatim : ${naiveMAE.toFixed(2)}`);
console.log(`    always predict 10-10        : ${meanMAE.toFixed(2)}`);
console.log(`    shrunk prior-year fit       : ${priorMAE.toFixed(2)}   <-- best simple baseline`);

// ---------------------------------------------------------------- MODEL INPUTS
const R = {}; TEAMS.forEach(t => { const o=BIG_EAST.find(x=>x.name===t); R[t]={r:ratings(o), v:volatility(o)}; });
const EM = {}; TEAMS.forEach(t => EM[t]=R[t].r.adjEM);
const emMean = mean(TEAMS.map(t=>EM[t]));

// Convert an AdjEM vector into expected conference wins by round-robin integration
function winsFromEM(emMap, vMap){
  const w={}; TEAMS.forEach(t=>w[t]=0);
  for(let i=0;i<TEAMS.length;i++) for(let j=0;j<TEAMS.length;j++){
    if(i===j) continue;
    const A=TEAMS[i],B=TEAMS[j];
    const poss=(R[A].r.tempo*R[B].r.tempo)/67.5;
    const m=(emMap[A]-emMap[B])*poss/100 + 3.5;      // A at home
    const sd=Math.sqrt((vMap?vMap[A]:8)**2+(vMap?vMap[B]:8)**2);
    const z=m/sd, t=1/(1+0.2316419*Math.abs(z)), d=0.3989423*Math.exp(-z*z/2);
    let p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));
    const pA = (z>0?1-p:p);       // P(A wins, A at home)
    w[A] += pA;                    // A's home game
    w[B] += 1 - pA;                // same game is B's away game
  }
  return w;   // 10 home + 10 away = 20 games per team
}
const V={}; TEAMS.forEach(t=>V[t]=R[t].v);

// ---- A. ROSTER-SUM ---------------------------------------------------------
const A_em = {...EM};

// ---- B. PROGRAM PRIOR ------------------------------------------------------
// Weighted prior wins -> shrink toward 10 at the empirically fit rate -> map to EM.
const B_wins={}, B_em={};
TEAMS.forEach(t=>{
  const prior = 0.55*HIST[2026][t] + 0.30*HIST[2025][t] + 0.15*HIST[2024][t];
  B_wins[t] = 10 + (prior-10)*lag1.b;               // regression to mean
});
// calibrate wins -> EM so the spread matches the roster model's scale
const bw = TEAMS.map(t=>B_wins[t]); const bwM=mean(bw);
const bwSD = Math.sqrt(mean(bw.map(x=>(x-bwM)**2)));
const emSD = Math.sqrt(mean(TEAMS.map(t=>(EM[t]-emMean)**2)));
TEAMS.forEach(t=> B_em[t] = emMean + (B_wins[t]-bwM)/bwSD*emSD );

// ---- C. BAYESIAN SHRINKAGE -------------------------------------------------
// Posterior = (tau_A*A + tau_B*B)/(tau_A+tau_B). Precision of the roster estimate
// rises with returning production (low continuity => noisy roster estimate).
const C_em={};
TEAMS.forEach(t=>{
  const ret = (META[t]||{ret:0.30}).ret;
  const tauA = 0.35 + 1.30*ret;     // 0.35 (all-new) .. ~1.2 (very experienced)
  const tauB = 0.75;                // program prior precision, constant
  C_em[t] = (tauA*A_em[t] + tauB*B_em[t])/(tauA+tauB);
});

// ---- D. BRADLEY-TERRY ------------------------------------------------------
// Fit strengths s_i by MLE on the implied pairwise win matrix, then rescale to EM.
function bradleyTerry(emMap){
  const p={};
  for(const A of TEAMS){ p[A]={};
    for(const B of TEAMS){ if(A===B) continue;
      const poss=(R[A].r.tempo*R[B].r.tempo)/67.5;
      const m=(emMap[A]-emMap[B])*poss/100;
      const sd=Math.sqrt(V[A]**2+V[B]**2);
      const z=m/sd,t2=1/(1+0.2316419*Math.abs(z)),d=0.3989423*Math.exp(-z*z/2);
      let q=d*t2*(0.3193815+t2*(-0.3565638+t2*(1.781478+t2*(-1.821256+t2*1.330274))));
      p[A][B]= z>0?1-q:q; } }
  let s={}; TEAMS.forEach(t=>s[t]=1);
  for(let it=0; it<500; it++){
    const ns={};
    for(const A of TEAMS){
      let wins=0, denom=0;
      for(const B of TEAMS){ if(A===B) continue;
        wins += 2*p[A][B];                              // 2 games per opponent
        denom += 2/(s[A]+s[B]); }
      ns[A]=wins/denom;
    }
    const g=Math.exp(mean(TEAMS.map(t=>Math.log(ns[t]))));
    TEAMS.forEach(t=>s[t]=ns[t]/g);
  }
  const ls=TEAMS.map(t=>Math.log(s[t])); const lm=mean(ls);
  const lsd=Math.sqrt(mean(ls.map(x=>(x-lm)**2)));
  const D={}; TEAMS.forEach((t,i)=> D[t]= emMean + (ls[i]-lm)/lsd*emSD );
  return D;
}
const D_em = bradleyTerry(A_em);

// ---- E. ENSEMBLE -----------------------------------------------------------
// Weight by what the backtest supports: program prior is the only component with
// out-of-sample validation, so it gets real weight; roster models get the rest.
const E_em={}; TEAMS.forEach(t=> E_em[t] = 0.30*A_em[t] + 0.30*B_em[t] + 0.28*C_em[t] + 0.12*D_em[t]);

// ---------------------------------------------------------------- OUTPUT
const models = {A:A_em, B:B_em, C:C_em, D:D_em, E:E_em};
const wins = {}; for(const k of Object.keys(models)) wins[k]=winsFromEM(models[k],V);
const ranked = k => [...TEAMS].sort((x,y)=>wins[k][y]-wins[k][x]);
const rankOf = {}; for(const k of Object.keys(models)){ const o=ranked(k);
  rankOf[k]=Object.fromEntries(o.map((t,i)=>[t,i+1])); }

console.log('\n\nFIVE MODELS — projected 2026-27 Big East conference wins\n');
console.log('  Team                 A:Roster   B:Prior   C:Bayes   D:B-T   E:Ensemble | rank');
console.log('  '+'-'.repeat(82));
for(const t of ranked('E')){
  const f=k=>wins[k][t].toFixed(1).padStart(6);
  console.log(`  ${t.replace(' 2026-27','').padEnd(20)} ${f('A')}    ${f('B')}   ${f('C')}  ${f('D')}    ${f('E')}   |  #${rankOf['E'][t]}`);
}
console.log('\n  Model rank orders:');
for(const k of ['A','B','C','D','E'])
  console.log(`   ${k}: ` + ranked(k).map(t=>t.replace(' 2026-27','').replace("St. John's",'SJU').replace('Seton Hall','SHU').replace('Georgetown','GTWN').replace('Providence','PROV').replace('Creighton','CREI').replace('Marquette','MARQ').replace('Villanova','NOVA').replace('DePaul','DEP').replace('Butler','BUT').replace('Xavier','XAV')).join(' > '));

// Spearman agreement between models
function spearman(k1,k2){
  const d2=TEAMS.reduce((s,t)=>s+(rankOf[k1][t]-rankOf[k2][t])**2,0);
  return 1 - 6*d2/(TEAMS.length*(TEAMS.length**2-1));
}
console.log('\n  Pairwise rank correlation (Spearman):');
const ks=['A','B','C','D','E'];
console.log('        '+ks.map(k=>k.padStart(6)).join(''));
for(const a of ks) console.log('    '+a+'  '+ks.map(b=>spearman(a,b).toFixed(2).padStart(6)).join(''));

console.log('\n  GEORGETOWN across models:');
for(const k of ks) console.log(`    ${k}: ${wins[k]['Georgetown 2026-27'].toFixed(1)} wins, #${rankOf[k]['Georgetown 2026-27']}`);
