#include "exported_functions.h"

// emcc image.cpp effect.cpp exported_functions.cpp main.cpp -o ../deploy/effects.js -sMODULARIZE -sEXPORTED_FUNCTIONS='_malloc','_free','_main','_print','_add_brightness'

int main(int argc, char** argv)
{
}