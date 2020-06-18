# image zoom 0.1.0
Basic image zoom functionality as a user-script for your web browser.

This is a [user-script](https://en.wikipedia.org/wiki/Userscript) for your web browser, you need either [Greasemonkey](https://www.greasespot.net/), [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/) to install and use it, the later two might be preferred since [Greasemonkey v4+ does not support frames yet](https://github.com/greasemonkey/greasemonkey/issues/2574).

This script allows you to easily zoom an image in a web page with your mouse buttons and wheel.

## Installation
Once you have installed either [Greasemonkey](https://www.greasespot.net/), [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/) for your web browser, you just click on [the raw link to this script](https://raw.githubusercontent.com/roger21/image-zoom/master/image_zoom.user.js) to install it and your user-script manager extension will ask you to confirm the installation.

## Features
Currently two zoom features:
* **Max the image size** to the size of the web page window by pressing **right mouse button and left mouse button on an image** (one after the other), pressing right mouse button and left mouse button again restores the original size of the image in the web page.
* **Incrementally zoom or unzoom an image** by pressing and holding **left mouse button on an image and then moving the mouse wheel up or down** to unzoom or zoom the image, pressing right mouse button and left mouse button after an incremental zoom restores the original size of the image in the web page.

## Tweaking the script
Four settings might be tweaked in the script (you may edit the script from your user-script manager extension):
* The **`zoom_factor`**, a double that must be more than `1` and that specifies the amount of zoom or unzoom at each wheel input for the incremental zoom feature (default to `1.25` a.k.a 125%).
* The **`zoom_direction`**, the wheel direction to zoom (as opposed to unzoom) for the incremental zoom feature, change to whatever you want to reverse (default to `"down"`).
* **`zoom_follows_cursor_x`** and **`zoom_follows_cursor_y`**, booleans that make the incremental zoom feature follows the mouse cursor (default both to `true`).
