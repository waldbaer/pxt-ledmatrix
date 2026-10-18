#!/usr/bin/env bash
# Builds one of the examples against this checkout of the extension and flashes
# it onto a connected board.
#
#   cd examples
#   ./build-and-flash.sh feature-tour-2.js              # Calliope mini 3
#   ./build-and-flash.sh wiring-check.js v1             # Calliope mini 1 (v2: mini 2)
#   ./build-and-flash.sh wiring-check.js microbit       # micro:bit
#
# The build project goes to examples/built/<example>/ (ignored by git). The
# MakeCode CLI is run with npx (set MKC to use another one). Flashing copies the
# hex onto the board's USB drive (label MINI or MICROBIT), mounting it with
# udisksctl if needed.
set -euo pipefail

usage() {
    echo "usage: $0 <example.js> [v3|v2|v1|microbit]" >&2
    exit 2
}
[ $# -ge 1 ] && [ $# -le 2 ] || usage

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo="$(dirname "$here")"
hw="${2:-v3}"
mkc="${MKC:-npx --yes makecode@1.3.6}"

# the example: as given, or by name in the examples folder
if [ -f "$1" ]; then
    example="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
elif [ -f "$here/$1" ]; then
    example="$here/$1"
else
    echo "error: example not found: $1" >&2
    exit 1
fi
name="$(basename "$example")"
name="${name%.*}"

case "$hw" in
    v1 | v2 | v3)
        website="https://makecode.calliope.cc/"
        variant="\"hwVariant\": \"$hw\","
        hex="built/$hw/binary.hex"
        label="MINI"
        ;;
    microbit)
        website="https://makecode.microbit.org/"
        variant=""
        hex="built/binary.hex"
        label="MICROBIT"
        ;;
    *) usage ;;
esac

# ---- build
project="$here/built/$name"
mkdir -p "$project"
cp "$example" "$project/main.ts"
cat > "$project/pxt.json" <<EOF
{
    "name": "$name",
    "dependencies": {
        "core": "*",
        "ledmatrix": "file:$repo"
    },
    "files": ["main.ts"]
}
EOF
cat > "$project/mkc.json" <<EOF
{
    "targetWebsite": "$website",
    $variant
    "links": {
        "ledmatrix": "$repo"
    }
}
EOF

echo "== building $name for $hw"
rm -rf "$project/built"
(cd "$project" && $mkc build 2>&1 | grep -v "^write \|^npm ") || true
if [ ! -f "$project/$hex" ]; then
    echo "error: build failed, see the messages above" >&2
    exit 1
fi
echo "hex: $project/$hex"

# ---- flash
# prints the mount point of the board's drive, mounting it if needed
board_dir() {
    for d in "/Volumes/$label" "/run/media/$USER/$label" "/media/$USER/$label"; do
        if [ -d "$d" ]; then echo "$d"; return; fi
    done
    local dev="/dev/disk/by-label/$label"
    [ -e "$dev" ] || return 0
    local mp
    mp="$(lsblk -no MOUNTPOINT "$dev" 2>/dev/null | head -n 1)"
    if [ -z "$mp" ] && command -v udisksctl > /dev/null; then
        udisksctl mount -b "$dev" > /dev/null 2>&1 || true
        mp="$(lsblk -no MOUNTPOINT "$dev" 2>/dev/null | head -n 1)"
    fi
    echo "$mp"
}

drive="$(board_dir)"
if [ -z "$drive" ]; then
    echo "error: no board found (no drive labelled $label); connect it via USB" >&2
    echo "       or copy the hex above onto the board's drive yourself" >&2
    exit 1
fi
echo "== flashing $drive"
cp "$project/$hex" "$drive/"
sync

# The drive disappears while the board flashes and comes back afterwards,
# with FAIL.TXT if the board rejected the file.
sleep 3
for _ in $(seq 1 20); do
    drive="$(board_dir)"
    [ -n "$drive" ] && break
    sleep 1
done
if [ -n "$drive" ] && [ -f "$drive/FAIL.TXT" ]; then
    echo "error: the board rejected the file:" >&2
    cat "$drive/FAIL.TXT" >&2
    exit 1
fi
echo "done: $name runs on the board"
