#include "image.h"

// интерфейс для эффекта
class IEffect
{
public:
    virtual bool Apply(Image* img);
};

// добавляет яркость (V в HSV)
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