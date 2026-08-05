// BACKTEST vs 3 seasons of ACTUAL Big East conference records (2023-24 .. 2025-26).
// Tests whether the model reproduces the real DISTRIBUTION of conference outcomes.
const { ratings, volatility } = require('./metrics');
const { BIG_EAST } = require('./bigeast');

const HIST = {
  '2023-24': [18,14,14,13,11,10,10,9,9,2,0],
  '2024-25': [18,15,14,13,13,11,8,6,6,4,2],
  '2025-26': [18,17,15,10,9,8,7,7,7,6,6],
};
const stat = a => {
  const n=a.length, m=a.reduce((x,y)=>x+y,0)/n;
  const sd=Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/n);
  return {mean:m, sd, max:Math.max(...a), min:Math.min(...a), range:Math.max(...a)-Math.min(...a)};
};
console.log('ACTUAL Big East conference-win distributions\n');
console.log('  Season     mean    sd   max   min  range');
console.log('  '+'-'.repeat(45));
const all=[];
for(const [y,a] of Object.entries(HIST)){
  const s=stat(a); all.push(...a);
  console.log(`  ${y}  ${s.mean.toFixed(1).padStart(6)} ${s.sd.toFixed(2).padStart(5)} ${String(s.max).padStart(5)} ${String(s.min).padStart(5)} ${String(s.range).padStart(6)}`);
}
const A=stat(all);
console.log(`  ${'3-yr POOLED'.padEnd(10)} ${A.mean.toFixed(1).padStart(5)} ${A.sd.toFixed(2).padStart(5)} ${String(A.max).padStart(5)} ${String(A.min).padStart(5)} ${String(A.range).padStart(6)}`);
const avgMax=(18+18+18)/3, avgMin=(0+2+6)/3, avgRange=(18+16+12)/3;
console.log(`\n  Season-average champion: ${avgMax.toFixed(1)} wins | cellar: ${avgMin.toFixed(1)} | range: ${avgRange.toFixed(1)}`);

// ---- what does MY model currently produce? ----
function gauss(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();
  return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function simDist(N=4000, slopeMult=1.0, sdMult=1.0){
  const R=new Map(),V=new Map();
  BIG_EAST.forEach(t=>{const r=ratings(t);
    R.set(t.name,{...r, adjEM:r.adjEM*slopeMult});
    V.set(t.name,volatility(t)*sdMult);});
  const names=BIG_EAST.map(t=>t.name);
  const maxes=[],mins=[],sds=[];
  for(let s=0;s<N;s++){
    const w=Object.fromEntries(names.map(n=>[n,0]));
    for(let i=0;i<BIG_EAST.length;i++)for(let j=i+1;j<BIG_EAST.length;j++){
      const A=BIG_EAST[i],B=BIG_EAST[j];
      const ra=R.get(A.name),rb=R.get(B.name);
      const poss=ra.tempo*rb.tempo/67.5;
      const base=(ra.adjEM-rb.adjEM)*poss/100;
      const sd=Math.sqrt(V.get(A.name)**2+V.get(B.name)**2);
      if(base+3.5+gauss()*sd>0)w[A.name]++;else w[B.name]++;
      if(-base+3.5+gauss()*sd>0)w[B.name]++;else w[A.name]++;
    }
    const arr=names.map(n=>w[n]); const st=stat(arr);
    maxes.push(st.max);mins.push(st.min);sds.push(st.sd);
  }
  const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
  return {max:avg(maxes),min:avg(mins),sd:avg(sds),range:avg(maxes)-avg(mins)};
}
console.log('\nMODEL vs HISTORY — tuning sweep (slopeMult widens the AdjEM spread)\n');
console.log('  slopeMult  sdMult |  champ   cellar  range    sd   | error vs history');
console.log('  '+'-'.repeat(74));
let best=null;
for(const sm of [1.0,1.3,1.6,1.9,2.2]) for(const vm of [1.0,0.9]){
  const d=simDist(3000,sm,vm);
  const err=Math.abs(d.max-avgMax)+Math.abs(d.min-avgMin)+Math.abs(d.range-avgRange)+Math.abs(d.sd-A.sd)*2;
  if(!best||err<best.err)best={sm,vm,d,err};
  console.log(`  ${sm.toFixed(1).padStart(8)} ${vm.toFixed(1).padStart(7)} | ${d.max.toFixed(1).padStart(6)} ${d.min.toFixed(1).padStart(7)} ${d.range.toFixed(1).padStart(7)} ${d.sd.toFixed(2).padStart(6)}  | ${err.toFixed(2).padStart(6)}`);
}
console.log(`\n  HISTORY TARGET:            ${avgMax.toFixed(1).padStart(6)} ${avgMin.toFixed(1).padStart(7)} ${avgRange.toFixed(1).padStart(7)} ${A.sd.toFixed(2).padStart(6)}`);
console.log(`  BEST FIT: slopeMult=${best.sm}, sdMult=${best.vm} (error ${best.err.toFixed(2)})`);
