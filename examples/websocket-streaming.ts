/**
 * WebSocket Streaming
 *
 * Connects to the Parsec real-time feed, subscribes to a market,
 * and prints orderbook snapshots and trade activity as they arrive.
 *
 * Run:  PARSEC_API_KEY=pk_live_xxx npx tsx examples/websocket-streaming.ts
 */

import ParsecAPI from 'parsec-api';

const client = new ParsecAPI(); // reads PARSEC_API_KEY from env

async function main() {
  // Pick an active market with depth
  const { markets } = await client.markets.list({
    exchanges: ['kalshi'],
    status: 'active',
    min_volume: 50_000,
    limit: 1,
  });
  const market = markets[0];
  if (!market) {
    throw new Error('No markets returned from API.');
  }
  const outcome = market.outcomes[0]?.name ?? 'yes';
  console.log(`Streaming: ${market.parsec_id} — ${market.question}\n`);

  // Create the WebSocket client and wire up event handlers
  const ws = client.ws();

  ws.on('connected', () => {
    console.log('Connected — subscribing...');
    ws.subscribe({ parsecId: market.parsec_id, outcome });
  });

  ws.on('orderbook', (book) => {
    console.log(
      `[orderbook] ${book.parsecId}/${book.outcome}  ` +
        `mid=${book.midPrice}  spread=${book.spread}  ` +
        `bids=${book.bids.length}  asks=${book.asks.length}`,
    );
  });

  ws.on('activity', (trade) => {
    console.log(
      `[activity]  ${trade.parsecId}  ${trade.kind}  ` +
        `price=${trade.price}  size=${trade.size}  side=${trade.side ?? '—'}`,
    );
  });

  ws.on('error', (err) => console.error('[error]', err.message));
  ws.on('disconnected', (reason) => console.log('[disconnected]', reason));

  // Connect and keep alive until Ctrl-C
  await ws.connect();
  console.log('Press Ctrl-C to stop.\n');
  await ws.waitForClose(); // resolves when permanently closed
}

main().catch(console.error);
