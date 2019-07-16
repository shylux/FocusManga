// Get Orientation
// https://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side/32490603#32490603
function getOrientation(base64Data) {
    let view = new DataView(base64Data);
    if (view.getUint16(0, false) != 0xFFD8)
    {
        return -2;
    }
    let length = view.byteLength, offset = 2;
    while (offset < length)
    {
        if (view.getUint16(offset+2, false) <= 8) return -1;
        let marker = view.getUint16(offset, false);
        offset += 2;
        if (marker == 0xFFE1)
        {
            if (view.getUint32(offset += 2, false) != 0x45786966)
            {
                return -1;
            }

            let little = view.getUint16(offset += 6, false) == 0x4949;
            offset += view.getUint32(offset + 4, little);
            let tags = view.getUint16(offset, little);
            offset += 2;
            for (let i = 0; i < tags; i++)
            {
                if (view.getUint16(offset + (i * 12), little) == 0x0112)
                {
                    return view.getUint16(offset + (i * 12) + 8, little);
                }
            }
        }
        else if ((marker & 0xFF00) != 0xFF00)
        {
            break;
        }
        else
        {
            offset += view.getUint16(offset, false);
        }
    }
    return -1;
}

// Rotate Image
// https://stackoverflow.com/questions/20600800/js-client-side-exif-orientation-rotate-and-mirror-jpeg-images
function resetOrientation(srcBase64, srcOrientation, callback) {
    let img = new Image();

    img.onload = function() {
        let width = img.width,
            height = img.height,
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext("2d");

        // set proper canvas dimensions before transform & export
        if (4 < srcOrientation && srcOrientation < 9) {
            canvas.width = height;
            canvas.height = width;
        } else {
            canvas.width = width;
            canvas.height = height;
        }

        // transform context before drawing image
        switch (srcOrientation) {
            case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
            case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
            case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
            case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
            case 7: ctx.transform(0, -1, -1, 0, height, width); break;
            case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
            default: break;
        }

        // draw image
        ctx.drawImage(img, 0, 0);

        // export base64
        callback(canvas.toDataURL());
    };

    img.src = srcBase64;
}

// Helper to convert an ArrayBuffer to Base64
function _arrayBufferToBase64( buffer ) {
    let binary = '';
    let bytes = new Uint8Array( buffer );
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}