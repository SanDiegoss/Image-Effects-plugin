#include "exported_functions.h"

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif // __EMSCRIPTEN__
void print(unsigned char* data, int n, int m)
{
    Image* img = new Image(data, n, m);
    img->at(0, 0).R() = 100;
    img->at(1, 1).G() = 101;

    std::cout << "print wasm raw" << std::endl;
    for(int i = 0; i < n * m * 4; i++) std::cout << (int)data[i] << std::endl;
    
    std::cout << "print" << std::endl;
    for(int i = 0; i < img->height(); i++)
        for(int j = 0; j < img->width(); j++)
            {
                std::cout << (int)img->at(i, j).R() << ' ';
                std::cout << (int)img->at(i, j).G() << ' ';
                std::cout << (int)img->at(i, j).B() << ' ';
                std::cout << (int)img->at(i, j).A() << std::endl;
            }
    
    delete img;
}