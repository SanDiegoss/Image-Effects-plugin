#include "image.h"

class IEffect
{
public:
    virtual bool Apply(Image* img);
};

class AddBrightnessEffect : public IEffect
{
private:
    int brightness_;
public:
    virtual bool Apply(Image *img);

    AddBrightnessEffect();
    AddBrightnessEffect(int brightness);

    int brightness();
    void setBrightness(int brightness);
};