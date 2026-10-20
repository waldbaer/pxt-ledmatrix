#!/usr/bin/env bash
# Builds every example and every course solution for the boards it runs on,
# without flashing, and fails if any build fails. CI runs it; it runs locally too:
#
#   docs/examples/build-all.sh
#
# Boards:
#   docs/examples/*.js           Calliope mini 3 and micro:bit, and also the
#                                Calliope mini 1 and 2 when the program's first
#                                comment says "Runs on the Calliope mini 1, 2 and 3"
#   docs/courses/solutions/*.js  Calliope mini 1, 2 and 3
#
# Each build uses build-and-flash.sh -b. A failed build prints
# "FAIL <program> <board>" and the end of its build output.
set -uo pipefail
shopt -s nullglob

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo="$(cd "$here/../.." && pwd)"
mini12="Runs on the Calliope mini 1, 2 and 3"
log="$(mktemp)"
trap 'rm -f "$log"' EXIT

# the program's first comment, its lines joined without the // and indents
first_comment() {
    awk '/^\/\//{ sub(/^\/\/ *(DE:|EN:)? */, ""); printf "%s ", $0; next } { exit }' "$1"
}

# the boards a program is built for
boards() {
    case "$1" in
        "$repo"/docs/courses/solutions/*) echo "v1 v2 v3" ;;
        *)
            if first_comment "$1" | grep -qF "$mini12"; then
                echo "v1 v2 v3 microbit"
            else
                echo "v3 microbit"
            fi
            ;;
    esac
}

builds=0
failed=()
for prog in "$repo"/docs/examples/*.js "$repo"/docs/courses/solutions/*.js; do
    name="${prog#"$repo"/}"
    hws="$(boards "$prog")"
    echo "== $name: $hws"
    for hw in $hws; do
        builds=$((builds + 1))
        if ! "$here/build-and-flash.sh" -b "$prog" "$hw" > "$log" 2>&1; then
            failed+=("$name $hw")
            echo "FAIL $name $hw"
            tail -n 20 "$log"
        fi
    done
done

if [ ${#failed[@]} -gt 0 ]; then
    echo "${#failed[@]} of $builds builds failed:"
    printf '  FAIL %s\n' "${failed[@]}"
    exit 1
fi
echo "all $builds builds OK"
