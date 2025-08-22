#include "allheaders.h"

int main(int argc, char **argv) {
    PIX *pixs, *pixInverted, *pixd;
    l_int32 h;
    char *filein, *fileout;

    if (argc != 4) {
        L_ERROR("Syntax: hdomes filein fileout h", "main", 1);
        return 1;
    }

    filein = argv[1];
    fileout = argv[2];
    h = atoi(argv[3]);

    if ((pixs = pixRead(filein)) == NULL) {
        L_ERROR("pixRead failed for input file", "main", 1);
        return 1;
    }

    if (pixGetDepth(pixs) != 8) {
        L_ERROR("Input image is not 8 bpp grayscale", "main", 1);
        pixDestroy(&pixs);
        return 1;
    }

    // Invert the image to turn dark guttae into bright peaks
    pixInverted = pixInvert(NULL, pixs);
    if (!pixInverted) {
        L_ERROR("pixInvert failed", "main", 1);
        pixDestroy(&pixs);
        return 1;
    }

    // Apply the h-dome transform on the INVERTED image
    pixd = pixHDome(pixInverted, h, 4); // Using 4-connectivity
    if (!pixd) {
        L_ERROR("pixHDome failed", "main", 1);
        pixDestroy(&pixs);
        pixDestroy(&pixInverted);
        return 1;
    }

    if (pixWrite(fileout, pixd, IFF_PNG)) {
        L_ERROR("pixWrite failed for output file", "main", 1);
        pixDestroy(&pixs);
        pixDestroy(&pixInverted);
        pixDestroy(&pixd);
        return 1;
    }

    // Clean up all allocated PIX objects
    pixDestroy(&pixs);
    pixDestroy(&pixInverted);
    pixDestroy(&pixd);

    return 0; // Success
}