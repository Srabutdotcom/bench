# @aicone/bench

# Bench
A simple and flexible benchmarking utility to measure execution time of synchronous and asynchronous functions with configurable warmup and repeat counts. Built for use in Deno or ESM environments.
@version 0.0.6


## Features
- Support for sync and async functions
- Warmup iterations (to discard JIT ramp-up)
- Accurate timing using `performance.now()`
- Output to console and file via `printBenchmarks`
- Designed to work with `import.meta`

## Usage
```js
import { Bench } from "jsr:@aicone/bench";

const bench = new Bench(import.meta);

await bench.bench("Example Sync Function", () => {
  for (let i = 0; i < 1e6; i++) Math.sqrt(i);
});

await bench.bench("Example Async Function", async () => {
  await new Promise(r => setTimeout(r, 5));
}, { warmup: 5, repeat: 30 });

bench.print(); // Logs and writes results
```

## Output
```txt 
benchmark for file.js
benchmark              time/iter (avg)  iter/s    (min … max)             p75      p99      p995
---------------------- ---------------- --------- ----------------------- -------- -------- --------
split publicKey        27.1 µs          36,865    (16.2 µs … 198.1 µs)     24.1 µs 132.9 µs 165.5 µs
split signature        125.4 µs         7,973     (115.7 µs … 215.3 µs)   123.1 µs 204.6 µs 210.0 µs
hash                   124.4 µs         8,037     (26.8 µs … 1.4 ms)      127.1 µs 838.2 µs   1.1 ms 
```


### Contributing

Contributions to improve the library are welcome. Please open an issue or pull request on the GitHub repository.

### Donation
- https://paypal.me/aiconeid 

### License

This project is licensed under the MIT License.