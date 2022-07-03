#include <vector>
#include <iostream>

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
#include <emscripten.h>
using namespace emscripten;
#endif // __EMSCRIPTEN__

#ifdef __cplusplus
extern "C"
{
#endif // __cplusplus

void print(unsigned char* data, int n);

#ifdef __cplusplus
}
#endif // __cplusplus

// emcc add.cpp -o add.js -sMODULARIZE -sEXPORTED_RUNTIME_METHODS='ccall' -sEXPORTED_FUNCTIONS='_malloc','_free','_main'