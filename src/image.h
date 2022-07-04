#include <vector>
#include <iostream>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif // __EMSCRIPTEN__

class Pixel
{
private:

    // 4 bytes
    unsigned char* raw_;

public:
    Pixel() = default;
    Pixel(unsigned char* raw);

    unsigned char& R(); // 0
    unsigned char& G(); // 1
    unsigned char& B(); // 2
    unsigned char& A(); // 3
};

class Image
{
private:
    Pixel** pixels_;
    int height_;
    int width_;

public:
    Image() = delete;
    Image(const Image& other);
    Image(unsigned char* raw, int height, int width);

    ~Image();

    Pixel& at(int i, int j);

    int height() const;
    int width() const;
};