// Hardware layer. This is the ONLY place that talks to the LED driver.
// It uses the WS2812 driver built into the micro:bit and Calliope mini cores.
namespace ledmatrix {
    /**
     * Internal, for tests: when set, frames are passed to this function
     * instead of being sent to the LEDs.
     */
    export let _sendHook: (buf: Buffer, brightness: number) => void = undefined

    /**
     * Internal: sends a chain-ordered byte buffer (3 bytes per LED) to the LEDs.
     * Each byte v is sent as (v * brightness) >> 8, with brightness 0..256.
     */
    export function _send(buf: Buffer, pin: DigitalPin, brightness: number): void {
        if (_sendHook) {
            _sendHook(buf, brightness)
            return
        }
        light.sendWS2812BufferWithBrightness(buf, pin, brightness)
    }
}
