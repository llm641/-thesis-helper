"""Generate PNG icons from SVG for PWA manifest.
Falls back to creating simple colored squares if Pillow is unavailable."""
import os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def create_simple_icon(size, path):
    """Create a simple icon with pure Python (no deps)."""
    # Write a minimal valid PNG file
    # This creates a solid dark-bg with gold accent PNG
    import struct, zlib

    def write_png(width, height, pixels):
        """Write a minimal PNG file from RGBA pixel data."""
        def chunk(ctype, data):
            c = ctype + data
            return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

        header = b'\x89PNG\r\n\x1a\n'
        ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))

        raw = b''
        for y in range(height):
            raw += b'\x00'  # filter byte
            for x in range(width):
                idx = (y * width + x) * 4
                raw += bytes(pixels[idx:idx+4])

        idat = chunk(b'IDAT', zlib.compress(raw))
        iend = chunk(b'IEND', b'')

        with open(path, 'wb') as f:
            f.write(header + ihdr + idat + iend)

    # Create a rounded-rect style icon
    pixels = []
    margin = size // 12
    radius = size // 5

    for y in range(size):
        for x in range(size):
            # Check if inside rounded rect
            cx, cy = x, y
            in_rect = True

            # Simple rounded corner check
            if x < margin:
                if y < margin and ((x-margin)**2 + (y-margin)**2) > (radius)**2:
                    in_rect = False
                elif y >= size - margin and ((x-margin)**2 + (y-(size-margin))**2) > (radius)**2:
                    in_rect = False
            elif x >= size - margin:
                if y < margin and ((x-(size-margin))**2 + (y-margin)**2) > (radius)**2:
                    in_rect = False
                elif y >= size - margin and ((x-(size-margin))**2 + (y-(size-margin))**2) > (radius)**2:
                    in_rect = False

            if x < margin or x >= size - margin or y < margin or y >= size - margin:
                if not in_rect:
                    pixels.extend([0, 0, 0, 0])  # transparent
                    continue

            # Background color (#1a1a2e)
            r, g, b, a = 26, 26, 46, 255

            # Gold accent stripe on the left
            if margin <= x < margin + size // 15:
                r, g, b = 201, 169, 110

            # Simple "book" shape in center
            center_x, center_y = size // 2, size // 2
            book_w, book_h = size // 4, size // 3

            if abs(x - center_x) < book_w // 2 and abs(y - center_y) < book_h // 2:
                # Spine line
                if abs(x - center_x) < 2:
                    r, g, b = 201, 169, 110
                # Pages
                elif abs(y - center_y) < book_h // 2 - 4:
                    r, g, b = 50, 50, 70
                # Center mark
                if abs(x - center_x) < book_w // 4 and abs(y - center_y) < 3:
                    r, g, b = 201, 169, 110

            pixels.extend([r, g, b, a])

    write_png(size, size, pixels)

try:
    create_simple_icon(192, 'assets/icon-192.png')
    print('Created icon-192.png')
    create_simple_icon(512, 'assets/icon-512.png')
    print('Created icon-512.png')
    print('Done!')
except Exception as e:
    print(f'Error: {e}')
    sys.exit(1)
