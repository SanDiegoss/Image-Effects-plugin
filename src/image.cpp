#include "image.h"

unsigned char Pixel::R() const
{
    return raw_[0];
}
unsigned char Pixel::G() const
{
    return raw_[1];
}
unsigned char Pixel::B() const
{
    return raw_[2];
}
unsigned char Pixel::A() const
{
    return raw_[3];
}

void Pixel::setR(unsigned char R)
{
    raw_[0] = R;
}
void Pixel::setG(unsigned char G)
{
    raw_[1] = G;
}
void Pixel::setB(unsigned char B)
{
    raw_[2] = B;
}
void Pixel::setA(unsigned char A)
{
    raw_[3] = A;
}

Pixel::Pixel(unsigned char* raw) : raw_(raw)
{
}

PixelRGB Pixel::RGB()
{
    return PixelRGB(*this);
}
void Pixel::setRGB(const PixelRGB& rgb)
{
    this->setR(rgb.R * 255);
    this->setG(rgb.G * 255);
    this->setB(rgb.B * 255);
}

PixelHSV Pixel::HSV()
{
    return PixelHSV(*this);
}
void Pixel::setHSV(const PixelHSV& hsv)
{
    PixelRGB rgb = PixelRGB(hsv);
    this->setRGB(rgb);
}

PixelRGB::PixelRGB(const Pixel& pixel)
{
    R = (float)pixel.R() / 255;
    G = (float)pixel.G() / 255;
    B = (float)pixel.B() / 255;
}
PixelRGB::PixelRGB(const PixelHSV& pixelHSV)
{
    // HSV -> RGB
}

PixelHSV::PixelHSV(const PixelRGB& pixelRGB) : H(0), S(0), V(0)
{
    // RGB -> HSV
    float max = std::max({pixelRGB.R, pixelRGB.G, pixelRGB.B});
    float min = std::min({pixelRGB.R, pixelRGB.G, pixelRGB.B});
}

Image::Image(const Image& other) : pixels_(other.pixels_), height_(other.height_), width_(other.width_)
{
}

Image::Image(unsigned char* raw, int height, int width) :  height_(height), width_(width)
{
    // needs memory for pointers
    pixels_ = new Pixel*[height];
    for(int i = 0; i < height; i++) pixels_[i] = new Pixel[width];

    for(int i = 0; i < height; i++)
        for(int j = 0; j < width; j++)
        {
            // maths magic
            int offset = i * width * 4;
            pixels_[i][j] = Pixel(&raw[offset + j * 4]);
        }
}
Image::~Image()
{
    for(int i = 0; i < height_; i++) delete[] pixels_[i];
    delete[] pixels_;
}
Pixel& Image::at(int i, int j)
{
    return pixels_[i][j];
}
int Image::height() const
{
    return height_;
}
int Image::width() const
{
    return width_;
}