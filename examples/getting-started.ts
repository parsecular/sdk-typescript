/**
 * Getting Started with the Parsec API
 *
 * Demonstrates: listing markets, fetching an orderbook, and reading price history.
 * Run:  PARSEC_API_KEY=pk_live_xxx npx tsx examples/getting-started.ts
 */

import ParsecAPI from 'parsec-api';

const client = new ParsecAPI(); // reads PARSEC_API_KEY from env

async function main() {
  // 1. List active, high-volume Kalshi markets
  const { markets, pagination } = await client.markets.list({
    exchanges: ['kalshi'],
    status: 'active',
    min_volume: 50_000,
    limit: 5,
  });
  console.log(`Found ${pagination.total} markets (showing ${markets.length}):\n`);
  for (const m of markets) {
    console.log(`  ${m.parsec_id}  ${m.question}`);
    console.log(`    volume: $${m.volume_total?.toLocaleString()}  last: ${m.last_price ?? 'n/a'}\n`);
  }

  // 2. Fetch the orderbook for the first market
  const market = markets[0];
  if (!market) {
    throw new Error('No markets returned from API.');
  }
  const outcome = market.outcomes[0]?.name ?? 'yes';
  const book = await client.orderbook.retrieve({ parsec_id: market.parsec_id, outcome });
  console.log(`Orderbook for ${market.parsec_id} (${outcome.toUpperCase()}):`);
  console.log(`  Best bid: ${book.bids?.[0]?.[0] ?? '—'}  Best ask: ${book.asks?.[0]?.[0] ?? '—'}`);
  console.log(`  Depth: ${book.bids?.length ?? 0} bids, ${book.asks?.length ?? 0} asks\n`);

  // 3. Get hourly price history (OHLCV candles)
  const { candles } = await client.priceHistory.retrieve({
    parsec_id: market.parsec_id,
    outcome,
    interval: '1h',
  });
  console.log(`Loaded ${candles.length} hourly candles:`);
  for (const c of candles) {
    console.log(`  ${c.timestamp}  O=${c.open} H=${c.high} L=${c.low} C=${c.close} V=${c.volume}`);
  }
}

main().catch(console.error);
