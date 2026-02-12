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

# Orderbook

Types:

- <code><a href="./src/resources/orderbook.ts">OrderbookRetrieveResponse</a></code>

Methods:

- <code title="get /api/v1/orderbook">client.orderbook.<a href="./src/resources/orderbook.ts">retrieve</a>({ ...params }) -> OrderbookRetrieveResponse</code>

# PriceHistory

Types:

- <code><a href="./src/resources/price-history.ts">PriceHistoryRetrieveResponse</a></code>

Methods:

- <code title="get /api/v1/price-history">client.priceHistory.<a href="./src/resources/price-history.ts">retrieve</a>({ ...params }) -> PriceHistoryRetrieveResponse</code>

# Trades

Types:

- <code><a href="./src/resources/trades.ts">TradeListResponse</a></code>

Methods:

- <code title="get /api/v1/trades">client.trades.<a href="./src/resources/trades.ts">list</a>({ ...params }) -> TradeListResponse</code>

# Websocket

Types:

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
- <code title="put /api/v1/credentials">client.account.<a href="./src/resources/account.ts">updateCredentials</a>({ ...params }) -> void</code>
- <code title="get /api/v1/user-activity">client.account.<a href="./src/resources/account.ts">userActivity</a>({ ...params }) -> AccountUserActivityResponse</code>

# Approvals

Types:

- <code><a href="./src/resources/approvals.ts">ApprovalListResponse</a></code>
- <code><a href="./src/resources/approvals.ts">ApprovalSetResponse</a></code>

Methods:

- <code title="get /api/v1/approvals">client.approvals.<a href="./src/resources/approvals.ts">list</a>({ ...params }) -> ApprovalListResponse</code>
- <code title="post /api/v1/approvals">client.approvals.<a href="./src/resources/approvals.ts">set</a>({ ...params }) -> ApprovalSetResponse</code>
