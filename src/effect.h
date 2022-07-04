#include "image.h"

class IEffect
{
public:
    virtual bool Apply(Image* img);
};

class ConcreteEffect : public IEffect
{
};