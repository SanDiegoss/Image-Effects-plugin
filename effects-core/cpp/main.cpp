#include "exported_functions.h"

// emcc image.cpp effect.cpp exported_functions.cpp main.cpp -o ../deploy/effects.js -sEXPORTED_FUNCTIONS='_malloc','_free','_main','_change_brightness','_change_saturation'

int main(int argc, char** argv)
{
}