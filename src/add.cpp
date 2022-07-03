#include "add.h"

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif // __EMSCRIPTEN__
void print(int* data, int n)
{
    std::cout << "print" << std::endl;
    for(int i = 0; i < n; i++)
            std::cout << data[i] << std::endl;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif // __EMSCRIPTEN__
void foo(action func)
{
    func();
}

int main()
{
}