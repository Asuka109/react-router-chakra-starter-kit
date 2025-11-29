export function invariant(
  condition: unknown,
  msg: string | Error = 'Invariant failed',
): asserts condition {
  const error = msg instanceof Error ? msg : new Error(msg);
  if (!condition) throw error;
}
