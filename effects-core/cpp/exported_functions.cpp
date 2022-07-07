#include "exported_functions.h"

void change_brightness(unsigned char* data, int h, int w, int brightness)
{
    Image* img = new Image(data, h, w);
    ChangeBrightnessEffect effect(brightness);
    
    effect.Apply(img);
    delete img;
}
void change_saturation(unsigned char* data, int h, int w, int saturation)
{
    Image* img = new Image(data, h, w);
    ChangeSaturationEffect effect(saturation);
    
    effect.Apply(img);
    delete img;
}