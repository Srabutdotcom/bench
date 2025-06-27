# @aicone/bench

# Bench
A simple and flexible benchmarking utility to measure execution time of synchronous and asynchronous functions with configurable warmup and repeat counts. Built for use in Deno or ESM environments.
@version undefined


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

### Contributing

Contributions to improve the library are welcome. Please open an issue or pull request on the GitHub repository.

### Donation
- https://paypal.me/aiconeid 

### License

This project is licensed under the MIT License.