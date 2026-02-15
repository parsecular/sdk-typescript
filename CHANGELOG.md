# Changelog

## 0.4.1 (2026-02-15)

Full Changelog: [v0.4.0...v0.4.1](https://github.com/parsecular/sdk-typescript/compare/v0.4.0...v0.4.1)

## 0.4.0 (2026-02-15)

Full Changelog: [v0.3.0...v0.4.0](https://github.com/parsecular/sdk-typescript/compare/v0.3.0...v0.4.0)

### Features

* **api:** api update ([ccbaac2](https://github.com/parsecular/sdk-typescript/commit/ccbaac2a74b40b06e69380ebd0231542f555ec58))
* v0.4.0 streaming fixes, docs, and contract test updates ([0c2f18c](https://github.com/parsecular/sdk-typescript/commit/0c2f18cbf6423d79ca60d4c63da317edafa77a73))

## 0.4.0 (2026-02-15)

Full Changelog: [v0.3.0...v0.4.0](https://github.com/parsecular/sdk-typescript/compare/v0.3.0...v0.4.0)

### ⚠ BREAKING CHANGES

This release migrates the `Market` type to the new Silver layer schema. All field names have changed. See the **Migration Guide** below.

**Market field renames:**
* `id` has been renamed to `exchange_market_id`
* `title` has been renamed to `question`
* `volume` (integer) has been replaced by `volume_total` (number/float)
* `group_id` has been renamed to `exchange_group_id`
* `event_id` has been renamed to `parsec_group_id`
* `close_time` has been renamed to `end_date`
* `open_time` has been renamed to `event_start_time`
* `status` changed from enum (`active | closed | resolved`) to plain string

**Market field type changes:**
* `outcomes` changed from `string[]` to `Outcome[]` objects with `{ name, price?, token_id? }`

**Removed Market fields:**
* `meta` (`ResponseMeta`) — removed from responses
* `outcome_tokens` — removed
* `token_id_yes` / `token_id_no` — removed (token IDs now inside `Outcome` objects)
* `outcome_prices` — removed
* `volume_1wk` / `volume_1mo` — removed

### Features

* **api:** add Events resource — `client.events.list()` for querying aggregated market groups
* **api:** new Market fields: `parsec_group_id`, `best_bid`, `best_ask`, `last_price`, `volume_24h`, `open_interest`, `created_at`, `updated_at`, `url`, `rules`, `group_title`, `outcome_count`, `xref`, `collection_date`, `last_collected`
* **ws:** add `getBook()` method to read current local orderbook state
* **ws:** add `waitForClose()` for async waiting on connection close

### Bug Fixes

* **ws:** fix mutation leak in emitted orderbook snapshots — listeners no longer share mutable state
* **ws:** add reconnect jitter to prevent thundering herd on mass reconnection
* **ws:** fix concurrent `connect()` race condition

### Migration Guide

**Accessing market identity:**

```typescript
// v0.3.0
const marketId = market.id;
const title = market.title;

// v0.4.0
const marketId = market.exchange_market_id;
const title = market.question;
```

**Working with outcomes (most impactful change):**

```typescript
// v0.3.0
const outcomes: string[] = market.outcomes;         // ["Yes", "No"]
const yesToken = market.token_id_yes;
const noToken = market.token_id_no;
const prices = market.outcome_prices;

// v0.4.0
const outcomes: Outcome[] = market.outcomes;         // [{ name: "Yes", price: 0.65, token_id: "abc" }, ...]
const yesOutcome = outcomes.find(o => o.name === 'Yes');
const yesToken = yesOutcome?.token_id;
const yesPrice = yesOutcome?.price;
```

**Volume and timing fields:**

```typescript
// v0.3.0
const vol = market.volume;        // integer
const close = market.close_time;
const open = market.open_time;

// v0.4.0
const vol = market.volume_total;  // float
const close = market.end_date;
const open = market.event_start_time;
// New volume field:
const vol24h = market.volume_24h;
```

**Group and event references:**

```typescript
// v0.3.0
const groupId = market.group_id;
const eventId = market.event_id;

// v0.4.0
const groupId = market.exchange_group_id;
const eventId = market.parsec_group_id;
```

**Events (new resource):**

```typescript
const events = await client.events.list({ exchange: 'polymarket' });
for (const event of events.data) {
  console.log(event.title, event.markets.length);
}
```

**WebSocket orderbook reading:**

```typescript
const ws = client.ws({ exchange: 'kalshi' });
ws.subscribe('orderbook', parsecId);

ws.on('orderbook', (book) => {
  // Emitted snapshots are now safe to store — no mutation leak
});

// Read current book state at any time
const book = ws.getBook(parsecId);

// Wait for graceful close
await ws.waitForClose();
```

## 0.3.0 (2026-02-12)

Full Changelog: [v0.2.0...v0.3.0](https://github.com/parsecular/sdk-typescript/compare/v0.2.0...v0.3.0)

### Features

* **api:** api update ([9e8ac76](https://github.com/parsecular/sdk-typescript/commit/9e8ac7647ca0eac759b1b71e05509b5ac6d869f7))

## 0.2.0 (2026-02-12)

Full Changelog: [v0.1.0...v0.2.0](https://github.com/parsecular/sdk-typescript/compare/v0.1.0...v0.2.0)

### Features

* add npm publish workflow + release doctor NPM_TOKEN check ([90e0fff](https://github.com/parsecular/sdk-typescript/commit/90e0fff414c4d5659f3b059319353cc9409dafd9))
* **api:** api update ([fb19529](https://github.com/parsecular/sdk-typescript/commit/fb19529903596b6570c07af21c94e2f812d99783))
* **api:** api update ([6715cc2](https://github.com/parsecular/sdk-typescript/commit/6715cc2d44c5f8093089c2cc6e556f457deecc9c))


### Bug Fixes

* use correct candle.timestamp field in contract test ([4263623](https://github.com/parsecular/sdk-typescript/commit/4263623dde4f34966d10e9efa3b808b9baf0d89c))
* **ws:** add missing needs_refresh book state + fill activity tests ([8d99697](https://github.com/parsecular/sdk-typescript/commit/8d99697055e101745dd33a6be6ea85d61ab93fe6))


### Chores

* **internal:** avoid type checking errors with ts-reset ([e1f84d9](https://github.com/parsecular/sdk-typescript/commit/e1f84d91e9514f390bb55741885b9c8c8aa5b463))


### Styles

* fix prettier formatting and unused import in contract tests ([072ae33](https://github.com/parsecular/sdk-typescript/commit/072ae3305c56870994faf79159144056d87fe07c))

## 0.1.0 (2026-02-12)

Full Changelog: [v0.0.1...v0.1.0](https://github.com/parsecular/sdk-typescript/compare/v0.0.1...v0.1.0)

### Features

* **api:** api update ([216bf43](https://github.com/parsecular/sdk-typescript/commit/216bf43cb72153aa3e28400ad3b79d3f68101a35))
* **api:** api update ([d5a755d](https://github.com/parsecular/sdk-typescript/commit/d5a755d4639498cf213bdb3c0506be7c665be06a))
* **api:** api update ([a5e3f97](https://github.com/parsecular/sdk-typescript/commit/a5e3f97be77603e4c47bda111d459e37e42064d1))
* **api:** api update ([db3ccc4](https://github.com/parsecular/sdk-typescript/commit/db3ccc45b53e26e483a89084f359ae47e5728c0f))
* **api:** api update ([b87c0fa](https://github.com/parsecular/sdk-typescript/commit/b87c0fa7a5dfe8f425740604a53c4189ac85227a))
* **ws:** add WebSocket streaming client with stateful orderbook ([2915910](https://github.com/parsecular/sdk-typescript/commit/291591010cc89d683cc36fb36c95338eeaa1774c))


### Bug Fixes

* resolve strict type errors in test files ([8a4d438](https://github.com/parsecular/sdk-typescript/commit/8a4d4385fafd476cdb6c255fe44ffa098fcca567))


### Chores

* configure new SDK language ([a768fbc](https://github.com/parsecular/sdk-typescript/commit/a768fbc43e0ad758acb93762cf76c89d82872867))
* update pnpm lockfile for ws dependencies ([48ee492](https://github.com/parsecular/sdk-typescript/commit/48ee4921cdf4b813b5e4f6c0205695c2fb956dd1))


### Styles

* fix prettier formatting ([3273f33](https://github.com/parsecular/sdk-typescript/commit/3273f33bdc9c7ad4ef1ea24b015fb18971937b0e))
