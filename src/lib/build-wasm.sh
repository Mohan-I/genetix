# build-wasm.sh - Compile C to WebAssembly
#!/bin/bash
emcc genetic-core.c \
  -O3 \
  -s WASM=1 \
  -s EXPORTED_FUNCTIONS='["_compute_polygenic_risk", "_monte_carlo_cross", "_bayesian_update", "_matrix_multiply", "_malloc", "_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s TOTAL_MEMORY=134217728 \
  -o public/genetic-core.wasm