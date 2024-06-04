import { expect, test } from "vitest"
import { desktopUserAgents, iOSUserAgents, iPadOSUserAgents, androidUserAgents, otherPhoneUserAgents } from "./ua"
import {
  sleep,
  noop,
  asyncNoop,
  getRandomString,
  getFileSizeDescription,
  getEmptySVG,
  copyText,
  getOSPlatform,
} from "../functions/base"
import { describe } from "vitest"

describe.concurrent("sleep", () => {
  test("sleep", async () => {
    const start = Date.now()
    await sleep(100)
    expect(Date.now() - start).toBeGreaterThanOrEqual(100)
  })

  test("sleep(0)", async () => {
    const start = Date.now()
    await sleep(0)
    expect(Date.now() - start).toBeGreaterThanOrEqual(1)
  })

  test("sleep(-1)", async () => {
    const start = Date.now()
    await sleep(-1)
    expect(Date.now() - start).toBeGreaterThanOrEqual(1)
  })
})

describe.concurrent("noop function", () => {
  test("noop", async () => {
    const start = Date.now()
    const result = noop()
    expect(Date.now() - start).toBeLessThanOrEqual(1)
    expect(result).toBeTypeOf("undefined")
  })
  test("asyncNoop", async () => {
    const start = Date.now()
    const promise = asyncNoop()
    expect(Date.now() - start).toBeLessThanOrEqual(1)
    expect(promise).toBeTypeOf("object")
    expect(promise.then).toBeTypeOf("function")
    const result = await promise
    expect(result).toBeTypeOf("undefined")
  })
})

describe.concurrent("getRandomString", () => {
  test("base", () => {
    const s1 = getRandomString()
    const s2 = getRandomString()
    expect(s1).toMatch(/^\w{12,}$/)
    expect(s2).toMatch(/^\w{12,}$/)
    expect(s1).not.toEqual(s2)
  })

  test("repeat", () => {
    const arr: string[] = []
    for (let i = 0; i < 1000; i++) {
      const s = getRandomString()
      expect(s).toMatch(/^\w{12,}$/)
      expect(arr.includes(s)).toBe(false)
      arr.push(s)
    }
  })
})

describe.concurrent("getFileSizeDescription", () => {
  test("empty", () => {
    expect(getFileSizeDescription()).toBe("--")
  })

  test("unknown", () => {
    expect(getFileSizeDescription(-1)).toBe("unknown")
  })

  test("zero", () => {
    expect(getFileSizeDescription(0)).toBe("unknown")
  })

  test("base", () => {
    expect(getFileSizeDescription(512)).toBe("~1K")
    expect(getFileSizeDescription(1025)).toBe("1 K")
    expect(getFileSizeDescription(1513)).toBe("1.48 K")
    expect(getFileSizeDescription(1024 * 1024)).toBe("1 M")
    expect(getFileSizeDescription(1024 * 1024 + 90000)).toBe("1.09 M")
    expect(getFileSizeDescription(1024 * 1024 * 1024 + 1024 * 1024 * 8)).toBe("1.01 G")
  })
})

describe.concurrent("getEmptySVG", () => {
  test("base", () => {
    expect(getEmptySVG(100, 200)).toBe(
      'data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 100 200" width="100" height="200" xmlns="http://www.w3.org/2000/svg"></svg>'
    )
    expect(getEmptySVG(1, 2)).toBe(
      'data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 1 2" width="1" height="2" xmlns="http://www.w3.org/2000/svg"></svg>'
    )
  })
})

describe.concurrent("copyText", () => {
  test("base", async () => {
    const s = getRandomString() + Date.now()
    const ok = await copyText(s)
    if (!navigator || !navigator.clipboard) {
      expect(ok).toBe(false)
    } else {
      expect(ok).toBe(true)
      const text = await navigator.clipboard.readText()
      expect(text).toBe(s)
    }
  })

  test("copy error", async () => {
    // 模拟抛错
    const rawFn = navigator.clipboard.writeText
    let throwError = false
    navigator.clipboard.writeText = async function (data: string): Promise<void> {
      data
      throwError = true
      throw Error("")
    }
    const result = await copyText("test")
    navigator.clipboard.writeText = rawFn
    expect(result).toBe(false)
    expect(throwError).toBe(true)
  })
})

describe.concurrent("getOSPlatform", () => {
  test("detect default mock env", () => {
    expect(getOSPlatform()).toBe("pc")
  })

  test("desktop", () => {
    for (const ua of desktopUserAgents) {
      expect(getOSPlatform(false, ua)).toBe("pc")
    }
  })

  test("ios", () => {
    for (const ua of iOSUserAgents) {
      expect(getOSPlatform(false, ua)).toBe("ios")
    }
  })

  test("old ipad", () => {
    const oldIPadUAs = iOSUserAgents.filter((ua) => ua.includes("iPad"))
    for (const ua of oldIPadUAs) {
      expect(getOSPlatform(true, ua)).toBe("pc")
      expect(getOSPlatform(undefined, ua)).toBe("ios")
    }
  })

  test("iPadOS", () => {
    for (const ua of iPadOSUserAgents) {
      expect(getOSPlatform(true, ua)).toBe("pc")
    }
  })

  test("android", () => {
    for (const ua of androidUserAgents) {
      expect(getOSPlatform(false, ua)).toBe("android")
    }
  })

  test("other", () => {
    for (const ua of otherPhoneUserAgents) {
      expect(getOSPlatform(false, ua)).toBe("other")
    }
  })
})
