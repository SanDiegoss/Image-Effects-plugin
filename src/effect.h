#include "image.h"

class IEffect
{
public:
    virtual bool Apply(const Image& img);
};

class ConcreteEffect : public IEffect
{
};