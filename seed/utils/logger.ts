// FILE: seed/utils/logger.ts
export function info(msg: string) {
  console.log('[seed] ' + msg);
}

export function error(msg: string) {
  console.error('[seed] ERROR: ' + msg);
}
