#include <cstdlib>
#include <cstring>

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
#include <emscripten.h>
using namespace emscripten;
#endif // __EMSCRIPTEN__

class MyClass
{
public:
    static int add(int a, int b) { return a + b;}
    MyClass() = default;
};

#ifdef __EMSCRIPTEN__
// Binding code
EMSCRIPTEN_BINDINGS(my_class_example) {
  class_<MyClass>("MyClass")
    .constructor()
    .class_function("add", &MyClass::add);
}
#endif // __EMSCRIPTEN__