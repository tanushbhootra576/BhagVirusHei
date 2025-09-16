// Simple logger with verbosity toggle via env LOG_VERBOSE (default true)
const VERBOSE = process.env.LOG_VERBOSE !== 'false';
function log(...args){ if(VERBOSE) console.log(...prefix(args)); }
function warn(...args){ if(VERBOSE) console.warn(...prefix(args)); }
function error(...args){ console.error(...prefix(args)); }
function prefix(parts){
  const ts = new Date().toISOString();
  if(!parts || !parts.length) return [ts];
  return [`[${ts}]`, ...parts];
}
module.exports = { log, warn, error, VERBOSE };
