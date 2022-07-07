#include "image.h"

// интерфейс для эффекта
class IEffect
{
public:
    virtual bool Apply(Image* img) = 0;
};

// добавляет яркость (V в HSV)
class ChangeBrightnessEffect : public IEffect
{
private:
    int brightness_;
    
public:
    virtual bool Apply(Image *img);

    ChangeBrightnessEffect();
    ChangeBrightnessEffect(int brightness);

    int brightness();
    void setBrightness(int brightness);
};

// добавляет насыщенность (S в HSV)
class ChangeSaturationEffect : public IEffect
{
private:
    int saturation_;
    
public:
    virtual bool Apply(Image *img);

    ChangeSaturationEffect();
    ChangeSaturationEffect(int saturation);

    int saturation();
    void setSaturation(int saturation);
};