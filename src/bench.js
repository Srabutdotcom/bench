//@ts-self-types="../type/bench.d.ts"
import * as path from "jsr:@std/path@1.1.0"

function formatTime(ms) {
   return ms < 1
      ? `${(ms * 1000).toFixed(1)} µs`
      : `${ms.toFixed(1)} ms`;
}

function percentile(sorted, p) {
   const rank = (p / 100) * (sorted.length - 1);
   const low = Math.floor(rank);
   const high = Math.ceil(rank);
   const weight = rank - low;
   return sorted[low] * (1 - weight) + sorted[high] * weight;
}

async function benchmark(name, fn, { warmup = 0, repeat = 50 } = {}) {
   const timings = [];

   // Warm-up run(s)
   for (let i = 0; i < warmup; i++) await fn();

   // Actual benchmark runs
   for (let i = 0; i < repeat; i++) {
      const t0 = performance.now();
      await Promise.resolve(fn());
      const t1 = performance.now();
      timings.push(t1 - t0);
   }

   timings.sort((a, b) => a - b);

   const avg = timings.reduce((a, b) => a + b, 0) / timings.length;
   const min = timings[0];
   const max = timings[timings.length - 1];
   const iterPerSec = 1000 / avg;

   const p75 = percentile(timings, 75);
   const p99 = percentile(timings, 99);
   const p995 = percentile(timings, 99.5);

   return {
      name,
      avg,
      iterPerSec,
      min,
      max,
      p75,
      p99,
      p995,
   };
}

function printBenchmarks(results, meta) {
   const parsed = path.parse(meta.filename);
   const folder = new URL('./bench/', meta.url)
   const filePath = new URL(`./bench/${parsed.name}.txt`, meta.url)
   const lines = [];
   lines.push(`benchmark for ${parsed.base}`)
   lines.push(
      `benchmark              time/iter (avg)  iter/s    (min … max)             p75      p99      p995`
   );
   lines.push(
      `---------------------- ---------------- --------- ----------------------- -------- -------- --------`
   );

   for (const r of results) {
      const line = [
         shortenName(r.name, 22),
         String(formatTime(r.avg)).padEnd(16),
         formatNumber(r.iterPerSec.toFixed(0)).padEnd(9),
         `(${formatTime(r.min)} … ${formatTime(r.max)})`.padEnd(23),
         formatTime(r.p75).padStart(8),
         formatTime(r.p99).padStart(8),
         formatTime(r.p995).padStart(8),
      ].join(" ");
      lines.push(line);
   }

   const output = lines.join("\n");

   console.log(output); // Still print to console
   ensureDirSync(folder)
   Deno.writeTextFileSync(filePath, output); // Save to file
}

var formatNumber = (num) => new Intl.NumberFormat("en-US").format(num);

function shortenName(name, max = 22) {
   if (name.length <= max) return name.padEnd(max);

   const suffix = name.slice(-4);        // last 4 characters
   const prefixLen = max - 3 - 4;        // space for "..." and suffix
   const prefix = name.slice(0, prefixLen);
   return (prefix + "..." + suffix).padEnd(max);
}

class Bench {
   results = []
   constructor(meta){
      this.meta = meta
   }
   async bench(name, fn, { warmup = 0, repeat = 50 } = {}){
      const o = await benchmark(name, fn, { warmup , repeat })
      this.results.push(o)
   }
   print(){
      printBenchmarks(this.results, this.meta)
   }
}

function ensureDirSync(path) {
   try {
     Deno.mkdirSync(path, { recursive: true });
   } catch (err) {
     if (!(err instanceof Deno.errors.AlreadyExists)) {
       throw err;
     }
   }
 }

export { Bench }