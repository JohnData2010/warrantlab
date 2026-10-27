// Accepts a response only if it belongs to the most recent request AND its inputs still match the current inputs.
// Either condition alone is not enough: an older request can resolve after a newer one, and an edit can happen
// while the newest request is still in flight.
export interface RequestGate<K> {
  begin(): number;
  invalidate(): void;
  accepts(token: number, sent: K, current: K): boolean;
}

export function createRequestGate<K>(isSame: (sent: K, current: K) => boolean): RequestGate<K> {
  let latest = 0;
  return {
    begin: () => ++latest,
    invalidate: () => {
      latest++;
    },
    accepts: (token, sent, current) => token === latest && isSame(sent, current),
  };
}
