#include "exported_functions.h"

// emcc image.cpp effect.cpp exported_functions.cpp main.cpp -o effects.js -sMODULARIZE -sEXPORTED_RUNTIME_METHODS='ccall' -sEXPORTED_FUNCTIONS='_malloc','_free','_main'

int main(int argc, char** argv)
{
}