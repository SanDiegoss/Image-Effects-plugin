#include "image.h"

unsigned char& Pixel::R()
{
    return raw_[0];
}
unsigned char& Pixel::G()
{
    return raw_[1];
}
unsigned char& Pixel::B()
{
    return raw_[2];
}
unsigned char& Pixel::A()
{
    return raw_[3];
}

Pixel::Pixel(unsigned char* raw) : raw_(raw)
{
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