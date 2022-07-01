#include <vector>

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
#include <emscripten.h>
using namespace emscripten;
#endif // __EMSCRIPTEN__

class MyClass
{
public:
    static int add(int a, int b) { return a + b;}
    static std::vector<int> someData() { return {1, 2, 3};}
    static std::vector<int> addData(std::vector<int> vec) { vec.push_back(4); return vec; }
    MyClass() = default;
};

#ifdef __EMSCRIPTEN__
// Binding code 
EMSCRIPTEN_BINDINGS(my_class_example) {
    class_<MyClass>("MyClass")
        .constructor()
        .class_function("add", &MyClass::add)
        .class_function("someData", &MyClass::someData)
        .class_function("addData", &MyClass::addData);

    register_vector<int>("vector<int>");
}
#endif // __EMSCRIPTEN__