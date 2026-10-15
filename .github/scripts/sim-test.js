// Runs test.ts in the MakeCode simulator (headless Chrome) and fails unless all
// checks pass. This covers everything the simulator can run; behavior that only
// shows on the real LEDs still needs a check on a board.
//
//   node .github/scripts/sim-test.js                     # Calliope mini simulator
//   node .github/scripts/sim-test.js mkc-microbit.json   # micro:bit simulator
//
// Needs Node 22 or newer (fetch, WebSocket) and Chrome or Chromium; set CHROME
// to choose the browser. Run it from the repository root.
"use strict"
const { spawn, spawnSync } = require("child_process")
const fs = require("fs")
const os = require("os")
const path = require("path")

const config = process.argv[2] || "mkc.json"
const mkc = ["npx", "--yes", "makecode@1.3.6"]
const simPort = 7011
const debugPort = 9233
const timeoutMs = 180000
const PASSED = "ledmatrix tests passed"   // printed at the end of test.ts
const FAILED = "ASSERTION FAILED"         // printed by control.assert, followed by the message

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const children = []
let profile = null       // temporary Chrome profile

function findChrome() {
    if (process.env.CHROME) return process.env.CHROME
    for (const name of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
        if (spawnSync("which", [name]).status === 0) return name
    }
    throw new Error("Chrome or Chromium not found; set CHROME")
}

// starts a process in its own group, so it can be stopped with everything it started
function start(cmd, args, stdio) {
    const child = spawn(cmd, args, { detached: true, stdio })
    children.push(child)
    return child
}

function stopAll() {
    for (const child of children) {
        try { process.kill(-child.pid, "SIGTERM") } catch (e) { }
    }
    if (profile) {
        try { fs.rmSync(profile, { recursive: true, force: true }) } catch (e) { }
    }
}

async function waitFor(url, what) {
    const end = Date.now() + timeoutMs
    while (Date.now() < end) {
        try {
            const res = await fetch(url)
            if (res.ok) return res
        } catch (e) { }
        await sleep(500)
    }
    throw new Error(`timed out waiting for ${what}`)
}

async function main() {
    console.log(`== building the simulator program (${config})`)
    const build = spawnSync(mkc[0], [...mkc.slice(1), "build", "-j", "-c", config], { stdio: "inherit" })
    if (build.status !== 0) throw new Error("build failed")

    console.log("== starting the simulator server")
    start(mkc[0], [...mkc.slice(1), "serve", "--no-watch", "-p", String(simPort), "-c", config], ["ignore", "ignore", "inherit"])
    await waitFor(`http://127.0.0.1:${simPort}/binary.js`, "the simulator server")

    console.log("== running the tests in headless Chrome")
    profile = fs.mkdtempSync(path.join(os.tmpdir(), "sim-test-"))
    start(findChrome(), ["--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${debugPort}`,
        `--user-data-dir=${profile}`, "about:blank"], "ignore")
    const targets = await (await waitFor(`http://127.0.0.1:${debugPort}/json/list`, "Chrome")).json()
    const page = targets.find(t => t.type === "page")

    const ws = new WebSocket(page.webSocketDebuggerUrl)
    await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject })
    let result = null      // "passed" or "failed"
    let id = 0
    ws.onmessage = event => {
        const msg = JSON.parse(event.data)
        let text = null
        if (msg.method === "Runtime.consoleAPICalled")
            text = msg.params.args.map(a => a.value !== undefined ? a.value : a.description).join(" ")
        else if (msg.method === "Runtime.exceptionThrown")
            text = msg.params.exceptionDetails.exception ? msg.params.exceptionDetails.exception.description : msg.params.exceptionDetails.text
        if (text === null) return
        text = text.replace(/^l>/, "").trim()
        if (text) console.log("  sim: " + text.split("\n").slice(0, 6).join("\n       "))
        if (text.includes(PASSED) && !result) result = "passed"
        if ((text.includes(FAILED) || text.includes("PANIC")) && result !== "failed") result = "failed"
    }
    const send = (method, params = {}) => ws.send(JSON.stringify({ id: ++id, method, params }))
    send("Runtime.enable")
    send("Page.navigate", { url: `http://127.0.0.1:${simPort}/` })

    const end = Date.now() + timeoutMs
    while (!result && Date.now() < end) await sleep(250)
    if (result === "failed") await sleep(1000)   // let the message and stack trace arrive
    ws.close()
    if (result !== "passed") throw new Error(result === "failed" ? "tests failed" : "no test result (timed out)")
    console.log("== all tests passed in the simulator")
}

main()
    .then(() => { stopAll(); process.exit(0) })
    .catch(err => { console.error("error: " + err.message); stopAll(); process.exit(1) })
