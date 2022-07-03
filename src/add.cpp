#include "add.h"

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif // __EMSCRIPTEN__
void print(unsigned char* data, int n)
{
    data[0] = 5;
    std::cout << "print" << std::endl;
    for(int i = 0; i < n; i++)
        std::cout << (int)data[i] << std::endl;
}

int main()
{
}