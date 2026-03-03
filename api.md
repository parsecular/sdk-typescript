# Exchanges

Types:

- <code><a href="./src/resources/exchanges.ts">ExchangeListResponse</a></code>

Methods:

- <code title="get /api/v1/exchanges">client.exchanges.<a href="./src/resources/exchanges.ts">list</a>() -> ExchangeListResponse</code>

# Markets

Types:

- <code><a href="./src/resources/markets.ts">MarketListResponse</a></code>

Methods:

- <code title="get /api/v1/markets">client.markets.<a href="./src/resources/markets.ts">list</a>({ ...params }) -> MarketListResponse</code>

# ExecutionPrice

Types:

- <code><a href="./src/resources/execution-price.ts">ExecutionPriceRetrieveResponse</a></code>

Methods:

- <code title="get /api/v1/execution-price">client.executionPrice.<a href="./src/resources/execution-price.ts">retrieve</a>({ ...params }) -> ExecutionPriceRetrieveResponse</code>

# Orderbook

Types:

- <code><a href="./src/resources/orderbook.ts">OrderbookRetrieveResponse</a></code>

Methods:

- <code title="get /api/v1/orderbook">client.orderbook.<a href="./src/resources/orderbook.ts">retrieve</a>({ ...params }) -> OrderbookRetrieveResponse</code>

# Price

Types:

- <code><a href="./src/resources/price.ts">PriceRetrieveResponse</a></code>

Methods:

- <code title="get /api/v1/price">client.price.<a href="./src/resources/price.ts">retrieve</a>({ ...params }) -> PriceRetrieveResponse</code>

# Trades

Types:

- <code><a href="./src/resources/trades.ts">TradeListResponse</a></code>

Methods:

- <code title="get /api/v1/trades">client.trades.<a href="./src/resources/trades.ts">list</a>({ ...params }) -> TradeListResponse</code>

# Events

Types:

- <code><a href="./src/resources/events.ts">EventListResponse</a></code>

Methods:

- <code title="get /api/v1/events">client.events.<a href="./src/resources/events.ts">list</a>({ ...params }) -> EventListResponse</code>

# Websocket

Types:

- <code><a href="./src/resources/websocket.ts">CustomerUsage</a></code>
- <code><a href="./src/resources/websocket.ts">WebsocketUsageResponse</a></code>

Methods:

- <code title="get /api/v1/ws/usage">client.websocket.<a href="./src/resources/websocket.ts">usage</a>({ ...params }) -> WebsocketUsageResponse</code>

# Orders

Types:

- <code><a href="./src/resources/orders.ts">Order</a></code>
- <code><a href="./src/resources/orders.ts">OrderListResponse</a></code>

Methods:

- <code title="post /api/v1/orders">client.orders.<a href="./src/resources/orders.ts">create</a>({ ...params }) -> Order</code>
- <code title="get /api/v1/orders/{order_id}">client.orders.<a href="./src/resources/orders.ts">retrieve</a>(orderID, { ...params }) -> Order</code>
- <code title="get /api/v1/orders">client.orders.<a href="./src/resources/orders.ts">list</a>({ ...params }) -> OrderListResponse</code>
- <code title="delete /api/v1/orders/{order_id}">client.orders.<a href="./src/resources/orders.ts">cancel</a>(orderID, { ...params }) -> Order</code>

# Positions

Types:

- <code><a href="./src/resources/positions.ts">PositionListResponse</a></code>

Methods:

- <code title="get /api/v1/positions">client.positions.<a href="./src/resources/positions.ts">list</a>({ ...params }) -> PositionListResponse</code>

# Account

Types:

- <code><a href="./src/resources/account.ts">AccountBalanceResponse</a></code>
- <code><a href="./src/resources/account.ts">AccountPingResponse</a></code>
- <code><a href="./src/resources/account.ts">AccountUserActivityResponse</a></code>

Methods:

- <code title="get /api/v1/balance">client.account.<a href="./src/resources/account.ts">balance</a>({ ...params }) -> AccountBalanceResponse</code>
- <code title="get /api/v1/ping">client.account.<a href="./src/resources/account.ts">ping</a>({ ...params }) -> AccountPingResponse</code>
- <code title="get /api/v1/user-activity">client.account.<a href="./src/resources/account.ts">userActivity</a>({ ...params }) -> AccountUserActivityResponse</code>

# Onboard

Types:

- <code><a href="./src/resources/onboard.ts">OnboardCreateResponse</a></code>

Methods:

- <code title="post /api/v1/onboard">client.onboard.<a href="./src/resources/onboard.ts">create</a>({ ...params }) -> OnboardCreateResponse</code>

# Wallet

Types:

- <code><a href="./src/resources/wallet.ts">WalletRetrieveResponse</a></code>
- <code><a href="./src/resources/wallet.ts">WalletExportKeyResponse</a></code>

Methods:

- <code title="get /api/v1/wallet">client.wallet.<a href="./src/resources/wallet.ts">retrieve</a>() -> WalletRetrieveResponse</code>
- <code title="post /api/v1/wallet/export-key">client.wallet.<a href="./src/resources/wallet.ts">exportKey</a>({ ...params }) -> WalletExportKeyResponse</code>

# PolymarketAuth

Types:

- <code><a href="./src/resources/polymarket-auth.ts">PolymarketAuthCredentialsResponse</a></code>
- <code><a href="./src/resources/polymarket-auth.ts">PolymarketAuthMessageResponse</a></code>

Methods:

- <code title="post /api/v1/exchange/polymarket/auth-credentials">client.polymarketAuth.<a href="./src/resources/polymarket-auth.ts">credentials</a>({ ...params }) -> PolymarketAuthCredentialsResponse</code>
- <code title="get /api/v1/exchange/polymarket/auth-message">client.polymarketAuth.<a href="./src/resources/polymarket-auth.ts">message</a>({ ...params }) -> PolymarketAuthMessageResponse</code>

# Ctf

Types:

- <code><a href="./src/resources/ctf.ts">CtfResponse</a></code>

Methods:

- <code title="post /api/v1/polymarket/ctf/merge">client.ctf.<a href="./src/resources/ctf.ts">merge</a>({ ...params }) -> CtfResponse</code>
- <code title="post /api/v1/polymarket/ctf/redeem">client.ctf.<a href="./src/resources/ctf.ts">redeem</a>({ ...params }) -> CtfResponse</code>
- <code title="post /api/v1/polymarket/ctf/split">client.ctf.<a href="./src/resources/ctf.ts">split</a>({ ...params }) -> CtfResponse</code>

# Builder

Types:

- <code><a href="./src/resources/builder.ts">BuilderPoolResponse</a></code>

Methods:

- <code title="get /api/v1/builder/pool">client.builder.<a href="./src/resources/builder.ts">pool</a>() -> BuilderPoolResponse</code>
