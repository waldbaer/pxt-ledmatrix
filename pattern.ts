namespace ledmatrix {
    // Pixel codes inside a pattern
    const _OFF = 0
    const _OWN = 1          // uses the pattern color
    const _LETTERS = "roygcbpw"
    const _LETTER_COLORS = [0xFF0000, 0xFFA500, 0xFFFF00, 0x00FF00, 0x00FFFF, 0x0000FF, 0xFF00FF, 0xFFFFFF]

    /**
     * A small picture made of pixels, e.g. a Tetris piece.
     */
    export class Pattern {
        _w: number
        _h: number
        _px: Buffer         // one code per pixel, row-major

        constructor(w: number, h: number) {
            this._w = w
            this._h = h
            this._px = pins.createBuffer(w * h)
        }

        /**
         * Width of the pattern in pixels.
         */
        width(): number {
            return this._w
        }

        /**
         * Height of the pattern in pixels.
         */
        height(): number {
            return this._h
        }

        _get(x: number, y: number): number {
            return this._px[y * this._w + x]
        }

        _set(x: number, y: number, code: number): void {
            this._px[y * this._w + x] = code
        }

        // clockwise = rotate right
        _rotated(clockwise: boolean): Pattern {
            const w = this._w
            const h = this._h
            const r = new Pattern(h, w)
            for (let y = 0; y < w; y++)
                for (let x = 0; x < h; x++)
                    r._set(x, y, clockwise ? this._get(y, h - 1 - x) : this._get(w - 1 - y, x))
            return r
        }

        _flipped(horizontal: boolean): Pattern {
            const w = this._w
            const h = this._h
            const r = new Pattern(w, h)
            for (let y = 0; y < h; y++)
                for (let x = 0; x < w; x++)
                    r._set(x, y, horizontal ? this._get(w - 1 - x, y) : this._get(x, h - 1 - y))
            return r
        }

        // Plots the lit pixels with the top left at px, py. Letter colors are used
        // when drawing (_BG, _OUT); the other targets get `color` for every pixel.
        _drawAt(m: Matrix, target: number, px: number, py: number, color: number): void {
            const letters = target == _BG || target == _OUT
            for (let y = 0; y < this._h; y++) {
                for (let x = 0; x < this._w; x++) {
                    const code = this._get(x, y)
                    if (code == _OFF) continue
                    m._plot(target, px + x, py + y, letters && code > _OWN ? _LETTER_COLORS[code - 2] : color)
                }
            }
        }
    }

    function _codeOf(ch: string): number {
        if (ch == "." || ch == "0" || ch == "_") return _OFF
        const i = _LETTERS.indexOf(ch.toLowerCase())
        if (i >= 0) return i + 2
        return _OWN
    }

    // Removes empty border rows and columns so the position is the top left lit pixel.
    function _trim(p: Pattern): Pattern {
        let minX = p._w, minY = p._h, maxX = -1, maxY = -1
        for (let y = 0; y < p._h; y++) {
            for (let x = 0; x < p._w; x++) {
                if (p._get(x, y) != _OFF) {
                    minX = Math.min(minX, x)
                    maxX = Math.max(maxX, x)
                    minY = Math.min(minY, y)
                    maxY = Math.max(maxY, y)
                }
            }
        }
        if (maxX < 0) return new Pattern(1, 1)   // nothing lit
        if (minX == 0 && minY == 0 && maxX == p._w - 1 && maxY == p._h - 1) return p
        const r = new Pattern(maxX - minX + 1, maxY - minY + 1)
        for (let y = minY; y <= maxY; y++)
            for (let x = minX; x <= maxX; x++)
                r._set(x - minX, y - minY, p._get(x, y))
        return r
    }

    // Rows are separated by line breaks or "|"; spaces, tabs and CRs are ignored.
    function _parse(text: string): Pattern {
        const rows: string[] = []
        let row = ""
        let w = 0
        for (let i = 0; i <= text.length; i++) {
            const ch = i < text.length ? text.charAt(i) : "\n"
            if (ch == "\n" || ch == "|") {
                if (row.length > 0) {
                    rows.push(row)
                    w = Math.max(w, row.length)
                }
                row = ""
            } else if (ch != " " && ch != "\t" && ch != "\r") {
                row += ch
            }
        }
        if (rows.length == 0) return new Pattern(1, 1)
        const p = new Pattern(w, rows.length)
        for (let y = 0; y < rows.length; y++)
            for (let x = 0; x < rows[y].length; x++)
                p._set(x, y, _codeOf(rows[y].charAt(x)))
        return _trim(p)
    }

    // For functions marked imageLiteral, the compiler passes the grid as static literal
    // data, not as an Image. The core's images::createImage turns that into an Image.
    //% shim=images::createImage
    function _literalImage(leds: string): Image {
        return <Image><any>leds   // the simulator already passes an Image
    }

    /**
     * A pattern drawn by clicking pixels in a grid. Empty rows and columns at the
     * edges are removed.
     */
    //% blockId=ledmatrix_grid block="pattern"
    //% imageLiteral=1
    //% group="Shapes" weight=90
    export function grid(leds: string): Pattern {
        const img = _literalImage(leds)
        const p = new Pattern(img.width(), img.height())
        for (let y = 0; y < p._h; y++)
            for (let x = 0; x < p._w; x++)
                if (img.pixel(x, y)) p._set(x, y, _OWN)
        return _trim(p)
    }

    /**
     * A pattern from text of any size: one line per row (or rows separated by "|"),
     * "." = off, "#" = pattern color,
     * letters r o y g c b p w = red, orange, yellow, green, cyan, blue, purple, white.
     * Empty rows and columns at the edges are removed.
     * @param text the rows of the pattern, eg: ".#.|###"
     */
    //% blockId=ledmatrix_pattern block="pattern from text %text"
    //% group="Shapes" weight=88 advanced=true
    export function pattern(text: string): Pattern {
        return _parse(text)
    }
}
