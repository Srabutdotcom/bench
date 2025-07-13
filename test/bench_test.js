import { Bench } from "../src/bench.js";

const ben = new Bench(import.meta);

await ben.bench(
   "test",
   ()=>new Array(32).fill(0)
)

ben.print();
Deno.exit();