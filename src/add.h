#include <vector>

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
#include <emscripten.h>
using namespace emscripten;
#endif // __EMSCRIPTEN__

typedef void(*action)(void);

class MyClass
{
public:
    MyClass() = default;
    static int add(int a, int b);

    static std::vector<int> someData();
    static std::vector<int> addData(std::vector<int> vec);
};

#ifdef __cplusplus
extern "C"
{
#endif // __cplusplus
void foo(action func);
#ifdef __cplusplus
}
#endif // __cplusplus

// emcc -lembind add.cpp bindings.cpp -o add.js -sMODULARIZE -sEXPORTED_RUNTIME_METHODS='addFunction','removeFunction','ccall' -sRESERVED_FUNCTION_POINTERS=1 -sEXPORTED_FUNCTIONS='_malloc','_free'