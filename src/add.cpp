#include "add.h"

int MyClass::add(int a, int b)
{
    return a + b;
}
std::vector<int> MyClass::someData()
{
    return std::vector<int>();
}
std::vector<int> MyClass::addData(std::vector<int> vec)
{
    vec.push_back(4); 
    return vec;
}

static int value = 1;

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif // __EMSCRIPTEN__
void foo(action func)
{
    std::cout << value++ << '\n';
    func();
}