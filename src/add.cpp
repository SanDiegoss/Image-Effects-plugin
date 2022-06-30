#include <cstdlib>
#include <cstring>

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
#include <emscripten.h>
using namespace emscripten;
#endif // __EMSCRIPTEN__


#ifdef __cplusplus
extern "C"
{
#endif // __cplusplus

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif // __EMSCRIPTEN__
int add(int a, int b) 
{
    return a + b;
}

#ifdef __cplusplus
}
#endif // __cplusplus