#include "exported_functions.h"

void print(unsigned char* data, int n, int m)
{
    Image* img = new Image(data, n, m);

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

void add_brightness(unsigned char* data, int h, int w, int brightness)
{
    Image* img = new Image(data, h, w);
    AddBrightnessEffect effect(brightness);
    
    effect.Apply(img);
    delete img;
}