#include "effect.h"

bool ChangeBrightnessEffect::Apply(Image *img)
{
    int h = img->height();
    int w = img->width();
    PixelHSV hsv;

    for(int i = 0; i < h; i++)
        for(int j = 0; j < w; j++)
        {
            hsv.fromRGB(img->at(i, j).RGB());
            hsv.V += (double)brightness_ / 100;

            // проверяем границы
            if(hsv.V > 1.0) hsv.V = 1;
            if(hsv.V < 0.0) hsv.V = 0;

            img->at(i, j).setRGB(hsv.RGB());
        }
    return true;
}
ChangeBrightnessEffect::ChangeBrightnessEffect() : brightness_(0)
{
}
ChangeBrightnessEffect::ChangeBrightnessEffect(int brightness) : brightness_(brightness)
{
}
int ChangeBrightnessEffect::brightness()
{
    return brightness_;
}
void ChangeBrightnessEffect::setBrightness(int brightness)
{
    brightness_ = brightness;
}

bool ChangeSaturationEffect::Apply(Image *img)
{
    int h = img->height();
    int w = img->width();
    PixelHSV hsv;

    for(int i = 0; i < h; i++)
        for(int j = 0; j < w; j++)
        {
            hsv.fromRGB(img->at(i, j).RGB());
            hsv.S += (double)saturation_ / 100;

            // проверяем границы
            if(hsv.S > 1.0) hsv.S = 1;
            if(hsv.S < 0.0) hsv.S = 0;

            img->at(i, j).setRGB(hsv.RGB());
        }
    return true;
}
ChangeSaturationEffect::ChangeSaturationEffect() : saturation_(0)
{
}
ChangeSaturationEffect::ChangeSaturationEffect(int saturation) : saturation_(saturation)
{
}
int ChangeSaturationEffect::saturation()
{
    return saturation_;
}
void ChangeSaturationEffect::setSaturation(int saturation)
{
    saturation_ = saturation;
}