#include "exported_functions.h"

// emcc image.cpp effect.cpp exported_functions.cpp main.cpp -o effects.js -sMODULARIZE -sEXPORTED_RUNTIME_METHODS='ccall' -sEXPORTED_FUNCTIONS='_malloc','_free','_main'

int main(int argc, char** argv)
{
    PixelRGB rgb;
    rgb.R = 0.1;
    rgb.G = 0.2;
    rgb.B = 0.3;
    PixelHSV hsv(rgb);
    std::cout << hsv.H << ' ' << hsv.S << ' ' << hsv.V << std::endl;
    rgb = hsv.RGB();
    std::cout << rgb.R << ' ' << rgb.G << ' ' << rgb.B << std::endl;
}