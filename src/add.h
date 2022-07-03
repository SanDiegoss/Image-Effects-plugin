#include <vector>
#include <iostream>

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
#include <emscripten.h>
using namespace emscripten;
#endif // __EMSCRIPTEN__

typedef void(*action)(void);


#ifdef __cplusplus
extern "C"
{
#endif // __cplusplus

void foo(action func);
void print(int* data, int n);

#ifdef __cplusplus
}
#endif // __cplusplus

// emcc -lembind add.cpp -o add.js -sMODULARIZE -sEXPORTED_RUNTIME_METHODS='addFunction','removeFunction','ccall' -sRESERVED_FUNCTION_POINTERS=1 -sEXPORTED_FUNCTIONS='_malloc','_free','_main'