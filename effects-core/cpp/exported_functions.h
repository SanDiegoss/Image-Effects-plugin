#include <iostream>
#include "effect.h"

#ifdef __cplusplus
extern "C"
{
#endif // __cplusplus

void brightness(unsigned char* data, int h, int w, int brightness);
void saturation(unsigned char* data, int h, int w, int saturation);

#ifdef __cplusplus
}
#endif // __cplusplus

