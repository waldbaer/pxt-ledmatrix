namespace ledmatrix {
    /**
     * Internal: a bitmap font. Each glyph has one byte per row, top to bottom;
     * bit (width - 1 - col) is column col. Characters are drawn with one empty
     * column between them.
     */
    export class _Font {
        w: number
        h: number
        chars: string
        glyphs: Buffer

        constructor(w: number, h: number, chars: string, glyphs: Buffer) {
            this.w = w
            this.h = h
            this.chars = chars
            this.glyphs = glyphs
        }
    }

    // 3x5 digits and minus sign
    export const _DIGITS = new _Font(3, 5, "0123456789-", hex`
        0705050507 0206020207 0701070407 0701030107 0505070101
        0704070107 0704070507 0701010101 0705070507 0705070107
        0000070000`)

    // Plots the lit pixels of the text's glyphs with the top left at x, y.
    // Characters the font doesn't have stay empty but take their space.
    export function _renderText(m: Matrix, target: number, text: string, x: number, y: number, color: number, font: _Font): void {
        for (let i = 0; i < text.length; i++) {
            const g = font.chars.indexOf(text.charAt(i))
            if (g >= 0) {
                for (let row = 0; row < font.h; row++) {
                    const bits = font.glyphs[g * font.h + row]
                    for (let col = 0; col < font.w; col++)
                        if (bits & (1 << (font.w - 1 - col))) m._plot(target, x + col, y + row, color)
                }
            }
            x += font.w + 1
        }
    }

    // Width of the text in pixels, gaps included.
    export function _textWidth(text: string, font: _Font): number {
        return text.length * (font.w + 1) - 1
    }

    // The value truncated toward zero, as text: "-" for negatives, "0" for zero.
    export function _numberText(value: number): string {
        const v = Math.trunc(value)
        if (v == 0) return "0"
        return "" + v
    }
}
