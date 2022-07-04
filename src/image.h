#include <algorithm>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif // __EMSCRIPTEN__

struct PixelRGB;
struct PixelHSV;
class Pixel;

class Pixel
{
private:

    // 4 bytes
    unsigned char* raw_;

public:
    Pixel() = default;
    Pixel(unsigned char* raw);

    PixelRGB RGB();
    void setRGB(const PixelRGB& rgb);

    unsigned char R() const; // 0
    unsigned char G() const; // 1
    unsigned char B() const; // 2
    unsigned char A() const; // 3

    void setR(unsigned char R);
    void setG(unsigned char G);
    void setB(unsigned char B);
    void setA(unsigned char A);
};

struct PixelRGB
{
    double R;
    double G;
    double B;

    PixelRGB() = default;
    PixelRGB(const Pixel& pixel);

    void fromPixel(const Pixel& pixel);
};

struct PixelHSV
{
    short H;
    double S;
    double V;

    PixelHSV() = default;
    PixelHSV(const PixelRGB& rgb);

    void fromRGB(const PixelRGB& rgb);
    PixelRGB RGB();
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