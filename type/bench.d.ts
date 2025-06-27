interface BenchmarkOptions {
   warmup?: number;
   repeat?: number;
}
interface BenchmarkResult {
   name: string;
   avg: number;
   min: number;
   max: number;
   p75: number;
   p99: number;
   p995: number;
   iterPerSec: number;
}
export declare class Bench {
   results: BenchmarkResult[];
   meta: ImportMeta;

   constructor(meta: ImportMeta);

   bench(
      name: string,
      fn: () => any | Promise<any>,
      options?: BenchmarkOptions
   ): Promise<void>;

   print(): void;
}