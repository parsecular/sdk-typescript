/**
 * Order Lifecycle: Place, Check, Cancel
 *
 * Places a $0.01 limit order that won't fill, retrieves it, then cancels it.
 * Requires exchange credentials configured on your Parsec account.
 *
 * Run:
 *   PARSEC_API_KEY=pk_live_xxx PARSEC_ENABLE_TRADING=1 npx tsx examples/order-lifecycle.ts
 */

import ParsecAPI from 'parsec-api';

if (!process.env['PARSEC_ENABLE_TRADING']) {
  console.log('Set PARSEC_ENABLE_TRADING=1 to run this example (places a real order).');
  process.exit(0);
}

const client = new ParsecAPI(); // reads PARSEC_API_KEY from env
const EXCHANGE = 'kalshi'; // or "polymarket"

async function main() {
  // 1. Find an active market with orderbook depth
  const { markets } = await client.markets.list({
    exchanges: [EXCHANGE],
    status: 'active',
    min_volume: 10_000,
    limit: 10,
  });

  let target: (typeof markets)[0] | undefined;
  for (const m of markets) {
    const ob = await client.orderbook.retrieve({ parsec_id: m.parsec_id });
    if (ob.bids && ob.bids.length > 0) {
      target = m;
      break;
    }
  }
  if (!target) throw new Error('No tradeable market found');
  console.log(`Market: ${target.parsec_id} — ${target.question}\n`);

  // 2. Place a limit buy at $0.01 (won't fill)
  const order = await client.orders.create({
    exchange: EXCHANGE,
    market_id: target.exchange_market_id,
    outcome: 'yes',
    side: 'buy',
    price: 0.01,
    size: 1,
  });
  console.log(`Created order: ${order.id}  status=${order.status}`);

  // 3. Retrieve order status
  const fetched = await client.orders.retrieve(order.id, { exchange: EXCHANGE });
  console.log(`Fetched order: ${fetched.id}  status=${fetched.status}`);

  // 4. Cancel the order
  const cancelled = await client.orders.cancel(order.id, { exchange: EXCHANGE });
  console.log(`Cancelled:     ${cancelled.id}  status=${cancelled.status}`);
}

main().catch(console.error);
