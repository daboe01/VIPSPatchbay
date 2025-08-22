gcc -arch arm64 -v -o hdomes hdomes.c -I$(brew --prefix)/include/leptonica -L$(brew --prefix)/lib -lleptonica
