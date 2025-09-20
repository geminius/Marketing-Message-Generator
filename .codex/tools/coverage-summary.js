#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function readJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function rangeLen(r) { return Math.max(0, (r.endOffset || 0) - (r.startOffset || 0)); }

function summarizeFile(fileCov) {
  // fileCov: { url, functions: [ { ranges: [{ startOffset, endOffset, count }] } ] }
  let total = 0, covered = 0;
  for (const fn of fileCov.functions || []) {
    for (const r of fn.ranges || []) {
      const len = rangeLen(r);
      total += len;
      if (r.count > 0) covered += len;
    }
  }
  return { total, covered };
}

function main() {
  const covDir = process.argv[2] || '.cov';
  const includeDir = process.argv[3] || 'src';
  let total = 0, covered = 0;
  for (const f of fs.readdirSync(covDir)) {
    if (!f.endsWith('.json')) continue;
    const data = readJSON(path.join(covDir, f));
    const results = data.result || [];
    for (const fileCov of results) {
      const url = fileCov.url || '';
      if (!url.includes(`/${includeDir}/`)) continue;
      const s = summarizeFile(fileCov);
      total += s.total; covered += s.covered;
    }
  }
  const pct = total > 0 ? Math.round((covered / total) * 100) : 0;
  console.log(JSON.stringify({ totalBytes: total, coveredBytes: covered, coveragePct: pct }));
}

if (require.main === module) main();

