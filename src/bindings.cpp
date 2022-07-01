#include "add.h"

#ifdef __EMSCRIPTEN__

// write your bindings here
EMSCRIPTEN_BINDINGS(my_class_example) 
{
    class_<MyClass>("MyClass")
        .constructor()
        .class_function("add", &MyClass::add)
        .class_function("someData", &MyClass::someData)
        .class_function("addData", &MyClass::addData);
    register_vector<int>("vector<int>");
}

#endif // __EMSCRIPTEN__