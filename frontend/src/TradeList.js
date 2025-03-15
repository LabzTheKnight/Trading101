import React from 'react';

const TradeList = ({ trades, summary, onTradeClick }) => {
  return (
    <div className="trades-container">
      <h3>Current Trades</h3>
      <div className="pnl-summary">
        <p><strong>Unrealized P/L:</strong> <span className={summary.unrealized >= 0 ? 'profit' : 'loss'}>${summary.unrealized.toFixed(2)}</span></p>
        <p><strong>Realized P/L:</strong> <span className={summary.realized >= 0 ? 'profit' : 'loss'}>${summary.realized.toFixed(2)}</span></p>
        <p><strong>Total P/L:</strong> <span className={summary.total >= 0 ? 'profit' : 'loss'}>${summary.total.toFixed(2)}</span></p>
      </div>

      {trades.length > 0 ? (
        <div className="trades-list">
          {trades.map((trade) => (
            <div 
              key={trade.index} 
              className={`trade-item ${trade.isOpen ? 'open-trade' : 'closed-trade'}`}
              onClick={() => trade.isOpen && onTradeClick(trade)}
              style={{ cursor: trade.isOpen ? 'pointer' : 'default' }}
            >
              <div className="trade-header">
                <span className="trade-action">{trade.action.toUpperCase()}</span>
                <span className="trade-status">{trade.isOpen ? 'OPEN' : 'CLOSED'}</span>
              </div>
              <div className="trade-details">
                <p>Entry: ${trade.entryPrice} ({trade.entryTime})</p>
                {trade.closePrice && <p>Close: ${trade.closePrice} ({trade.closeTime})</p>}
                <p>Quantity: {trade.quantity} {trade.isOpen && trade.remainingQuantity !== trade.quantity && `(${trade.remainingQuantity} remaining)`}</p>
                {trade.isOpen ? (
                  <p>Unrealized P/L: <span className={trade.profitLoss >= 0 ? 'profit' : 'loss'}>${trade.profitLoss}</span></p>
                ) : (
                  <p>Realized P/L: <span className={trade.realizedProfitLoss >= 0 ? 'profit' : 'loss'}>${trade.realizedProfitLoss}</span></p>
                )}
                {trade.isOpen && (<p>Trade Index: {trade.index}</p>)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No trades available.</p>
      )}
      
      <style>{`
        .trades-container {
          margin-top: 0;
        }
        .pnl-summary {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .pnl-summary p {
          margin-right: 20px;
        }
        .trades-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
          gap: 15px;
        }
        .trade-item {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
          transition: all 0.2s;
        }
        .open-trade {
          border-left: 4px solid #4CAF50;
        }
        .open-trade:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          background-color: #f9f9f9;
        }
        .closed-trade {
          border-left: 4px solid #999;
          opacity: 0.8;
        }
        .trade-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid #eee;
        }
        .trade-action {
          font-weight: bold;
        }
        .trade-status {
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.8em;
        }
        .open-trade .trade-status {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        .closed-trade .trade-status {
          background-color: #f5f5f5;
          color: #757575;
        }
        .trade-details p {
          margin: 5px 0;
        }
        .profit {
          color: #4CAF50;
        }
        .loss {
          color: #f44336;
        }
      `}</style>
    </div>
  );
};

export default TradeList;