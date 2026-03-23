// Simple 404 checker for the built Astro site
// Usage: npm run build && npm run check:404
// Scans dist/**/*.html, extracts href/src, and checks for missing internal files
// and external URLs that respond with 404. Writes a report file and prints a summary.

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DIST_DIR = path.resolve(__dirname, '..', 'dist')
const REPORT_DIR = path.resolve(__dirname)
const REPORT_JSON = path.join(REPORT_DIR, '404-report.json')
const REPORT_TXT = path.join(REPORT_DIR, '404-report.txt')
// Comma-separated list of base paths to simulate; defaults to both root and /blog
const BASES = (process.env.BASES || '/,/blog').split(',').map(b => b.trim()).filter(Boolean)
// Comma-separated path prefixes to skip for internal links
// These are main-app routes that belong on grantwisdom.com, not this blog origin
const SKIP_PREFIXES = (process.env.SKIP_PREFIXES || '/about,/contact,/dashboard,/features,/grants,/pricing,/privacy,/terms,/avatars/').split(',').filter(Boolean)
// Skip external URL checks for known routes served by the Next.js main app
const SKIP_EXTERNAL_PREFIXES = (process.env.SKIP_EXTERNAL_PREFIXES || 'https://grantwisdom.com/features,https://grantwisdom.com/blog/tag/').split(',').filter(Boolean)

/**
 * Recursively list all files under a directory that match a predicate
 */
async function walk(dir, predicate) {
  const out = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const ent of entries) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      out.push(...(await walk(p, predicate)))
    } else if (!predicate || predicate(p)) {
      out.push(p)
    }
  }
  return out
}

function isHtmlFile(p) {
  return p.toLowerCase().endsWith('.html')
}

/** Extract href/src values from HTML using a light regex */
function extractLinks(html) {
  const links = new Set()
  const re = /(href|src)\s*=\s*("([^"]*)"|'([^']*)')/gi
  let m
  while ((m = re.exec(html))) {
    const v = m[3] ?? m[4] ?? ''
    if (v) links.add(v)
  }
  return [...links]
}

function classify(url) {
  if (!url || url === '#' || url.startsWith('#')) return 'anchor'
  const lower = url.toLowerCase()
  if (lower.startsWith('mailto:') || lower.startsWith('tel:') || lower.startsWith('javascript:')) return 'skip'
  if (lower.startsWith('http://') || lower.startsWith('https://')) return 'external'
  return 'internal'
}

function ensureLeadingSlash(p) {
  return p.startsWith('/') ? p : `/${p}`
}

/** Resolve an internal link to a file candidate in dist */
function resolveInternal(distDir, pageFile, link) {
  const isAbs = link.startsWith('/')
  const asFs = isAbs ? path.join(distDir, link) : path.resolve(path.dirname(pageFile), link)
  const ext = path.extname(asFs)
  const candidates = []
  if (!ext) {
    candidates.push(asFs)
    candidates.push(`${asFs}.html`)
    candidates.push(path.join(asFs, 'index.html'))
  } else {
    candidates.push(asFs)
    if (ext !== '.html') {
      candidates.push(asFs.replace(new RegExp(`${ext}$`), '.html'))
    } else {
      candidates.push(asFs.replace(/\.html$/, '/index.html'))
    }
  }
  const seen = new Set()
  return candidates.filter(c => { if (seen.has(c)) return false; seen.add(c); return true })
}

async function fileExists(p) {
  try {
    const st = await fs.stat(p)
    return st.isFile()
  } catch {
    return false
  }
}

async function checkExternal(url) {
  const ua = 'grantwisdom-404-checker/1.0 (+https://github.com/)'
  const ctrl = new AbortController()
  const timeout = setTimeout(() => ctrl.abort(), 15000)
  try {
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': ua } })
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': ua } })
    }
    return { ok: res.ok, status: res.status }
  } catch (e) {
    return { ok: false, status: -1, error: String(e && e.message ? e.message : e) }
  } finally {
    clearTimeout(timeout)
  }
}

async function main() {
  try {
    const st = await fs.stat(DIST_DIR)
    if (!st.isDirectory()) throw new Error('dist exists but is not a directory')
  } catch {
    console.error('dist/ not found. Build the site first: npm run build')
    process.exitCode = 1
    return
  }

  const htmlFiles = await walk(DIST_DIR, isHtmlFile)
  const pages = []
  for (const file of htmlFiles) {
    const html = await fs.readFile(file, 'utf8')
    const links = extractLinks(html)
    pages.push({ file, links })
  }

  const results = { per_base: {}, external_404: [], other_failures: [], checked_links: 0 }
  for (const b of BASES) results.per_base[b] = { broken_404: [], checked_links: 0 }

  const extQueue = []
  const extLimit = 10

  async function runExternal(url, source) {
    if (SKIP_EXTERNAL_PREFIXES.some(p => url.startsWith(p))) return
    const r = await checkExternal(url)
    if (r.status === 404) {
      results.external_404.push({ url, source })
    } else if (!r.ok) {
      results.other_failures.push({ type: 'external', url, status: r.status, error: r.error, source })
    }
  }

  for (const { file, links } of pages) {
    for (const link of links) {
      const kind = classify(link)
      if (kind === 'skip' || kind === 'anchor') continue
      if (SKIP_PREFIXES.some(p => link === p || link.startsWith(p))) continue
      results.checked_links += 1
      if (kind === 'external') {
        const task = runExternal(link, file)
        extQueue.push(task)
        if (extQueue.length >= extLimit) {
          await Promise.race(extQueue).catch(() => {})
          for (let i = extQueue.length - 1; i >= 0; i--) {
            if (extQueue[i].settled) extQueue.splice(i, 1)
          }
        }
      } else {
        if (!link.startsWith('/')) {
          const candidates = resolveInternal(DIST_DIR, file, link)
          let ok = false
          for (const cand of candidates) { if (await fileExists(cand)) { ok = true; break } }
          if (!ok) {
            const rel = path.relative(DIST_DIR, path.resolve(path.dirname(file), link)).replace(/\\/g, '/').replace(/^\.\//, '')
            for (const b of BASES) {
              results.per_base[b].broken_404.push({ type: 'internal', path: ensureLeadingSlash(rel), source: file })
              results.per_base[b].checked_links += 1
            }
          } else {
            for (const b of BASES) results.per_base[b].checked_links += 1
          }
        } else {
          for (const b of BASES) {
            results.per_base[b].checked_links += 1
            let fsPath
            if (b === '/' || b === '') {
              fsPath = link
            } else if (link.startsWith(b)) {
              fsPath = link.slice(b.length - (b.endsWith('/') ? 1 : 0))
            } else {
              results.per_base[b].broken_404.push({ type: 'internal', path: link, source: file })
              continue
            }
            const candidates = resolveInternal(DIST_DIR, file, fsPath.startsWith('/') ? fsPath : `/${fsPath}`)
            let ok = false
            for (const cand of candidates) { if (await fileExists(cand)) { ok = true; break } }
            if (!ok) {
              results.per_base[b].broken_404.push({ type: 'internal', path: link, source: file })
            }
          }
        }
      }
    }
  }

  await Promise.allSettled(extQueue)

  for (const b of BASES) {
    const seen = new Set()
    const arr = results.per_base[b].broken_404
    results.per_base[b].broken_404 = arr.filter(item => {
      const key = item.type === 'external' ? `ext:${item.url}` : `int:${item.path}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).sort((a, b) => {
      const aa = a.type === 'external' ? a.url : a.path
      const bb = b.type === 'external' ? b.url : b.path
      return aa.localeCompare(bb)
    })
  }

  const jsonOut = {
    generatedAt: new Date().toISOString(),
    dist: DIST_DIR,
    totals: {
      pages: pages.length,
      links_checked: results.checked_links,
      per_base: Object.fromEntries(BASES.map(b => [b, {
        links_checked: results.per_base[b].checked_links,
        broken_404: results.per_base[b].broken_404.length,
      }]))
    },
    per_base: Object.fromEntries(BASES.map(b => [b, results.per_base[b]])),
    external_404: results.external_404,
    other_failures: results.other_failures,
  }
  await fs.writeFile(REPORT_JSON, JSON.stringify(jsonOut, null, 2) + '\n', 'utf8')

  const lines = []
  lines.push(`# 404 Report`)
  lines.push(`Generated: ${jsonOut.generatedAt}`)
  lines.push(`Dist: ${jsonOut.dist}`)
  lines.push('')
  lines.push(`Pages scanned: ${pages.length}`)
  lines.push(`Links checked: ${results.checked_links}`)
  for (const b of BASES) {
    lines.push('')
    lines.push(`Base: ${b}`)
    lines.push(`404s found: ${results.per_base[b].broken_404.length}`)
    if (results.per_base[b].broken_404.length) {
      for (const item of results.per_base[b].broken_404) {
        if (item.type === 'external') {
          lines.push(`- external: ${item.url}`)
        } else {
          lines.push(`- internal: ${item.path}`)
        }
      }
    } else {
      lines.push('No 404s found for this base.')
    }
  }

  if (results.external_404.length) {
    lines.push('')
    lines.push(`External 404s: ${results.external_404.length}`)
    for (const e of results.external_404) lines.push(`- ${e.url}`)
  }
  if (results.other_failures.length) {
    lines.push('')
    lines.push('Other failures (non-404 or network):')
    for (const f of results.other_failures) {
      lines.push(`- ${f.type}: ${f.url || f.path || 'unknown'} [status=${f.status}${f.error ? `, error=${f.error}` : ''}]`)
    }
  }
  lines.push('')
  await fs.writeFile(REPORT_TXT, lines.join('\n'), 'utf8')

  console.log('Checked', results.checked_links, 'links across', pages.length, 'pages')
  for (const b of BASES) {
    console.log(`Base ${b}: 404s = ${results.per_base[b].broken_404.length}`)
  }
  console.log(`Full report: ${REPORT_TXT}`)
}

main().catch(err => {
  console.error(err)
  process.exitCode = 1
})
