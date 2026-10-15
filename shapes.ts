namespace ledmatrix {
    export const _SHAPE_DOT = 0
    export const _SHAPE_LINE = 1
    export const _SHAPE_RECT = 2
    export const _SHAPE_CIRCLE = 3
    export const _SHAPE_SPRITE = 4
    export const _SHAPE_NUMBER = 5

    /**
     * A shape that stays on the matrix and can be moved. Shapes are redrawn
     * on top of the drawing layer every time the matrix is shown.
     */
    export class Shape {
        _m: Matrix
        _kind: number
        _x: number
        _y: number
        _a: number   // rect: width, circle: radius, line: dx to end
        _b: number   // rect: height, line: dy to end
        _color: number
        _brightness: number  // 0..255, scales all its colors (255 = unchanged)
        _filled: boolean
        _visible: boolean
        _pat: Pattern  // sprites only
        _text: string  // number shapes only: the formatted value
        _removed: boolean

        constructor(m: Matrix, kind: number, x: number, y: number, a: number, b: number, color: number, filled: boolean) {
            this._m = m
            this._kind = kind
            this._x = x | 0
            this._y = y | 0
            this._a = a | 0
            this._b = b | 0
            this._color = color
            this._brightness = 255
            this._filled = filled
            this._visible = true
            this._pat = null
            this._text = null
            this._removed = false
        }

        // ------------------------------------------------------------- position

        /**
         * Move the shape relative to where it is.
         * @param dx pixels to the right (negative = left), eg: 1
         * @param dy pixels down (negative = up), eg: 0
         */
        //% blockId=ledmatrix_shape_move block="%shape|move by x %dx|y %dy"
        //% shape.defl=shape
        //% group="Shapes" weight=80 blockGap=8
        moveBy(dx: number, dy: number): void {
            this._x += dx | 0
            this._y += dy | 0
            this._m._changed()
        }

        /**
         * Put the shape at a position (top left for rectangles and sprites, center
         * for circles, start point for lines).
         * @param x column, eg: 0
         * @param y row, eg: 0
         */
        //% blockId=ledmatrix_shape_set_pos block="%shape|set position x %x|y %y"
        //% shape.defl=shape
        //% group="Shapes" weight=75 blockGap=8
        setPosition(x: number, y: number): void {
            this._x = x | 0
            this._y = y | 0
            this._m._changed()
        }

        /**
         * Horizontal position of the shape.
         */
        //% blockId=ledmatrix_shape_x block="%shape|x"
        //% shape.defl=shape
        //% group="Shapes" weight=70 blockGap=8
        x(): number {
            return this._x
        }

        /**
         * Vertical position of the shape.
         */
        //% blockId=ledmatrix_shape_y block="%shape|y"
        //% shape.defl=shape
        //% group="Shapes" weight=69
        y(): number {
            return this._y
        }

        /**
         * Change the color of the shape. Pixels of a sprite that have their own
         * color letter keep it.
         */
        //% blockId=ledmatrix_shape_set_color block="%shape|set color %color=ledmatrix_colors"
        //% shape.defl=shape
        //% group="Shapes" weight=60 blockGap=8
        setColor(color: number): void {
            this._color = color
            this._m._changed()
        }

        /**
         * Set the brightness of the shape (0-255), on top of the matrix brightness.
         * 255 shows its colors unchanged and lower values dim them, also the color
         * letters of a sprite. Stamping copies the dimmed colors. At 0 the shape is
         * black but still covers what is below it and still collides: use "visible"
         * to hide it.
         * @param brightness brightness from 0 to 255, eg: 128
         */
        //% blockId=ledmatrix_shape_set_brightness block="%shape|set brightness %brightness"
        //% shape.defl=shape brightness.min=0 brightness.max=255
        //% group="Shapes" weight=58 blockGap=8
        setBrightness(brightness: number): void {
            this._brightness = Math.clamp(0, 255, brightness | 0)
            this._m._changed()
        }

        /**
         * Show or hide the shape. Hidden shapes do not collide.
         * @param on visible if true
         */
        //% blockId=ledmatrix_shape_set_visible block="%shape|visible %on"
        //% shape.defl=shape on.shadow=toggleOnOff
        //% group="Shapes" weight=55
        setVisible(on: boolean): void {
            this._visible = on
            this._m._changed()
        }

        /**
         * Draw this shape above all others.
         */
        //% blockId=ledmatrix_shape_front block="%shape|bring to front"
        //% shape.defl=shape
        //% group="Shapes" weight=40 advanced=true
        bringToFront(): void {
            const list = this._m._shapes
            if (list.removeElement(this)) list.push(this)
            this._m._changed()
        }

        /**
         * Delete the shape: it disappears on the next show and no longer collides.
         * Pixels it already stamped into the drawing stay.
         */
        //% blockId=ledmatrix_shape_remove block="%shape|delete"
        //% shape.defl=shape
        //% group="Shapes" weight=50 blockGap=8
        remove(): void {
            this._removed = true
            this._m._shapes.removeElement(this)
            this._m._changed()
        }

        // -------------------------------------------------------------- sprites

        /**
         * Rotate a sprite by a quarter turn around its center. Other shapes don't change.
         * @param direction right = clockwise, left = counter-clockwise
         */
        //% blockId=ledmatrix_sprite_rotate block="%sprite|rotate %direction"
        //% sprite.defl=sprite
        //% group="Shapes" weight=66 blockGap=8
        rotate(direction: LedMatrixRotation): void {
            if (this._kind != _SHAPE_SPRITE) return
            const p = this._pat
            const r = p._rotated(direction == LedMatrixRotation.Right)
            this._x += Math.idiv(p._w - r._w, 2)
            this._y += Math.idiv(p._h - r._h, 2)
            this._pat = r
            this._m._changed()
        }

        /**
         * Mirror a sprite. Its position stays. Other shapes don't change.
         * @param axis horizontally = left and right swap, vertically = top and bottom swap
         */
        //% blockId=ledmatrix_sprite_flip block="%sprite|flip %axis"
        //% sprite.defl=sprite
        //% group="Shapes" weight=65
        flip(axis: LedMatrixFlip): void {
            if (this._kind != _SHAPE_SPRITE) return
            this._pat = this._pat._flipped(axis == LedMatrixFlip.Horizontal)
            this._m._changed()
        }

        /**
         * Replace the pattern of a sprite (e.g. for animation). The position stays.
         * Other shapes don't change.
         */
        //% blockId=ledmatrix_sprite_set_pattern block="%sprite|set pattern %pattern=ledmatrix_grid"
        //% sprite.defl=sprite
        //% group="Shapes" weight=64 advanced=true
        setPattern(pattern: Pattern): void {
            if (this._kind != _SHAPE_SPRITE || !pattern) return
            this._pat = pattern
            this._m._changed()
        }

        /**
         * Change the number a number shape shows. Its top left stays. Other shapes
         * don't change.
         * @param value the new number, eg: 0
         */
        //% blockId=ledmatrix_shape_set_number block="%number|set number to %value"
        //% number.defl=number
        //% group="Text" weight=80
        setNumber(value: number): void {
            if (this._kind != _SHAPE_NUMBER) return
            this._text = _numberText(value)
            this._m._changed()
        }

        /**
         * Width of the shape in pixels.
         */
        //% blockId=ledmatrix_shape_width block="%shape|width"
        //% shape.defl=shape
        //% group="Shapes" weight=68 blockGap=8 advanced=true
        width(): number {
            return this._right() - this._left() + 1
        }

        /**
         * Height of the shape in pixels.
         */
        //% blockId=ledmatrix_shape_height block="%shape|height"
        //% shape.defl=shape
        //% group="Shapes" weight=67 advanced=true
        height(): number {
            return this._bottom() - this._top() + 1
        }

        // ----------------------------------------------------------- collisions

        /**
         * True if a lit pixel of this shape is on the same LED as a lit pixel
         * of the other shape. Hidden and deleted shapes never overlap.
         */
        //% blockId=ledmatrix_shape_overlaps block="%shape|overlaps %other"
        //% shape.defl=shape
        //% group="Collisions" weight=100 blockGap=8
        overlaps(other: Shape): boolean {
            if (!other || other == this || !this._live() || !other._live() || other._m != this._m) return false
            const m = this._m
            if (!m._wrap && (this._left() > other._right() || other._left() > this._right()
                || this._top() > other._bottom() || other._top() > this._bottom())) return false
            m._mask()
            this._render(_MASK, 1)
            m._hit = false
            other._render(_HIT_MK, 0)
            const hit = m._hit
            this._render(_MASK, 0)
            return hit
        }

        /**
         * True if a lit pixel of this shape is on a lit pixel of the drawing layer
         * (e.g. pieces that were stamped).
         */
        //% blockId=ledmatrix_shape_touches_drawing block="%shape|touches drawing"
        //% shape.defl=shape
        //% group="Collisions" weight=95 blockGap=8
        touchesDrawing(): boolean {
            if (!this._live()) return false
            const m = this._m
            m._hit = false
            this._render(_HIT_BG, 0)
            return m._hit
        }

        /**
         * True if the shape could move by dx, dy without leaving the matrix
         * or touching the drawing layer. The shape does not move.
         * @param dx pixels to the right (negative = left), eg: 0
         * @param dy pixels down (negative = up), eg: 1
         */
        //% blockId=ledmatrix_shape_can_move block="%shape|can move by x %dx|y %dy"
        //% shape.defl=shape
        //% group="Collisions" weight=90 blockGap=8
        canMoveBy(dx: number, dy: number): boolean {
            dx = dx | 0
            dy = dy | 0
            this._x += dx
            this._y += dy
            const ok = (this._m._wrap || this.isInside()) && !this.touchesDrawing()
            this._x -= dx
            this._y -= dy
            return ok
        }

        /**
         * True if a lit pixel of this shape would be on the same LED as a lit pixel
         * of the other shape after moving by dx, dy. The shape does not move.
         * Hidden and deleted shapes never overlap.
         * @param other the shape to check against
         * @param dx pixels to the right (negative = left), eg: 0
         * @param dy pixels down (negative = up), eg: 1
         */
        //% blockId=ledmatrix_shape_would_overlap block="%shape|would overlap %other|if moved by x %dx|y %dy"
        //% shape.defl=shape
        //% group="Collisions" weight=89 blockGap=8
        wouldOverlap(other: Shape, dx: number, dy: number): boolean {
            if (!other) return false
            dx = dx | 0
            dy = dy | 0
            this._x += dx
            this._y += dy
            const hit = this.overlaps(other)
            this._x -= dx
            this._y -= dy
            return hit
        }

        /**
         * True if the whole shape is inside the matrix.
         */
        //% blockId=ledmatrix_shape_inside block="%shape|is inside"
        //% shape.defl=shape
        //% group="Collisions" weight=85 blockGap=8
        isInside(): boolean {
            return this._left() >= 0 && this._top() >= 0
                && this._right() < this._m._w && this._bottom() < this._m._h
        }

        /**
         * True if any part of the shape touches or crosses the edge of the matrix.
         */
        //% blockId=ledmatrix_shape_on_edge block="%shape|is on edge"
        //% shape.defl=shape
        //% group="Collisions" weight=80 blockGap=8
        isOnEdge(): boolean {
            return this._left() <= 0 || this._top() <= 0
                || this._right() >= this._m._w - 1 || this._bottom() >= this._m._h - 1
        }

        /**
         * Copy the shape's lit pixels into the drawing where it is now, e.g. for a
         * landed Tetris piece. This flattens the shape into plain pixels: the drawing
         * does not remember the shape or what was underneath, so a stamp cannot be
         * undone. Only clearing or painting over the drawing removes it. The copy
         * stays when the shape moves and is an obstacle for "can move by" and
         * "touches drawing". Hidden shapes are not stamped.
         */
        //% blockId=ledmatrix_shape_stamp block="%shape|stamp into drawing"
        //% shape.defl=shape
        //% group="Collisions" weight=75
        stamp(): void {
            if (!this._live()) return
            this._render(_BG, this._color)
            this._m._changed()
        }

        // ------------------------------------------------------------ internals

        _live(): boolean {
            return this._visible && !this._removed
        }

        _left(): number {
            if (this._kind == _SHAPE_CIRCLE) return this._x - this._a
            if (this._kind == _SHAPE_LINE) return Math.min(this._x, this._x + this._a)
            return this._x
        }

        _right(): number {
            if (this._kind == _SHAPE_CIRCLE) return this._x + this._a
            if (this._kind == _SHAPE_LINE) return Math.max(this._x, this._x + this._a)
            if (this._kind == _SHAPE_RECT) return this._x + this._a - 1
            if (this._kind == _SHAPE_SPRITE) return this._x + this._pat._w - 1
            if (this._kind == _SHAPE_NUMBER) return this._x + _textWidth(this._text, _DIGITS) - 1
            return this._x
        }

        _top(): number {
            if (this._kind == _SHAPE_CIRCLE) return this._y - this._a
            if (this._kind == _SHAPE_LINE) return Math.min(this._y, this._y + this._b)
            return this._y
        }

        _bottom(): number {
            if (this._kind == _SHAPE_CIRCLE) return this._y + this._a
            if (this._kind == _SHAPE_LINE) return Math.max(this._y, this._y + this._b)
            if (this._kind == _SHAPE_RECT) return this._y + this._b - 1
            if (this._kind == _SHAPE_SPRITE) return this._y + this._pat._h - 1
            if (this._kind == _SHAPE_NUMBER) return this._y + _DIGITS.h - 1
            return this._y
        }

        // The one render routine per kind: drawing, stamping and collisions all use it.
        // The shape's brightness applies while it renders (to colors only, see _plot).
        _render(target: number, color: number): void {
            const m = this._m
            m._level = this._brightness
            switch (this._kind) {
                case _SHAPE_DOT:
                    m._plot(target, this._x, this._y, color)
                    break
                case _SHAPE_LINE:
                    m._line(target, this._x, this._y, this._x + this._a, this._y + this._b, color)
                    break
                case _SHAPE_RECT:
                    m._rect(target, this._x, this._y, this._a, this._b, color, this._filled)
                    break
                case _SHAPE_CIRCLE:
                    m._circle(target, this._x, this._y, this._a, color, this._filled)
                    break
                case _SHAPE_SPRITE:
                    this._pat._drawAt(m, target, this._x, this._y, color)
                    break
                case _SHAPE_NUMBER:
                    _renderText(m, target, this._text, this._x, this._y, color, _DIGITS)
                    break
            }
            m._level = 255
        }
    }
}
