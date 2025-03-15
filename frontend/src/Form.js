import React, { useState, useEffect } from 'react';

const Form = ({ currentPrice, onSubmitTrade, onCloseTrade, openTrades, initialAction = '', selectedTrade = null }) => {
  const [trade, setTrade] = useState({
    action: initialAction,
    price: currentPrice || '',
    quantity: ''
  });
  
  const [closeTrade, setCloseTrade] = useState({
    tradeIndex: selectedTrade ? selectedTrade.index : '',
    quantity: selectedTrade ? selectedTrade.remainingQuantity : '',
    closePrice: currentPrice || ''
  });
  
  // Update values when props change
  useEffect(() => {
    if (initialAction) {
      setTrade(prev => ({ ...prev, action: initialAction, price: currentPrice || '' }));
    }
    
    if (selectedTrade) {
      setCloseTrade({
        tradeIndex: selectedTrade.index,
        quantity: selectedTrade.remainingQuantity,
        closePrice: currentPrice || ''
      });
    }
  }, [initialAction, selectedTrade, currentPrice]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleInputChange = (key, value) => {
    setTrade({ ...trade, [key]: value });
  };

  const handleCloseInputChange = (key, value) => {
    setCloseTrade({ ...closeTrade, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmitTrade({
        ...trade,
        time: new Date().toISOString().split("T")[0]
      });
      
      alert("Trade placed successfully!");
      setTrade({ action: initialAction || "", price: currentPrice || "", quantity: "" });
    } catch (error) {
      console.error("Error saving trade:", error);
      alert("Failed to save trade. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = async (e) => {
    e.preventDefault();
    if (isClosing) return;

    setIsClosing(true);
    try {
      const response = await onCloseTrade({
        tradeIndex: closeTrade.tradeIndex,
        quantity: closeTrade.quantity,
        closePrice: closeTrade.closePrice || currentPrice
      });
      
      alert(`Trade closed successfully! Realized P/L: $${response.realizedPL}`);
      setCloseTrade({ tradeIndex: '', quantity: '', closePrice: '' });
    } catch (error) {
      console.error("Error closing trade:", error);
      alert("Failed to close trade. Please try again.");
    } finally {
      setIsClosing(false);
    }
  };

  // Selected trade for display in close form
  const selected = selectedTrade || 
    (closeTrade.tradeIndex !== '' ? 
      openTrades.find(t => t.index === parseInt(closeTrade.tradeIndex)) : null);

  // If modalMode is for placing a trade
  if (!selectedTrade) {
    return (
      <div className="form-container">
        <form onSubmit={handleSubmit} className="trade-form">
          {!initialAction && (
            <div className="form-group">
              <label>Action</label>
              <select
                value={trade.action}
                onChange={(e) => handleInputChange('action', e.target.value)}
                required
              >
                <option value="">Select Action</option>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              step="0.0001"
              value={trade.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Enter price"
              required
            />
            {currentPrice && (
              <button 
                type="button" 
                className="use-current-btn"
                onClick={() => handleInputChange('price', currentPrice)}
              >
                Use Current
              </button>
            )}
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              step="0.01"
              value={trade.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="Enter Quantity"
              required
            />
          </div>

          {trade.action && trade.price && trade.quantity && (
            <div className="trade-preview">
              <p>Action: {trade.action.toUpperCase()}</p>
              <p>Price: ${Number(trade.price).toFixed(4)}</p>
              <p>Quantity: {trade.quantity}</p>
              <p>Total Value: ${(Number(trade.price) * Number(trade.quantity)).toFixed(2)}</p>
            </div>
          )}

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Placing...' : `Place ${initialAction ? initialAction.toUpperCase() : ''} Trade`}
          </button>
        </form>
        
        <style>{`
          .form-container { padding: 0; }
          .form-group {
            margin-bottom: 15px;
            position: relative;
          }
          .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          .form-group input, .form-group select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          .use-current-btn {
            position: absolute;
            right: 0;
            top: 30px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            padding: 4px 8px;
            cursor: pointer;
            border-radius: 4px;
          }
          .submit-button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
          }
          .submit-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }
          .trade-preview {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
        `}</style>
      </div>
    );
  }
  
  // If modalMode is for closing a trade
  return (
    <div className="form-container">
      <form onSubmit={handleClose} className="trade-form">
        {selected && (
          <div className="selected-trade-info">
            <p><strong>Action:</strong> {selected.action.toUpperCase()}</p>
            <p><strong>Entry Price:</strong> ${selected.entryPrice}</p>
            <p><strong>Remaining Quantity:</strong> {selected.remainingQuantity}</p>
            <p><strong>Current P/L:</strong> <span className={selected.profitLoss >= 0 ? 'profit' : 'loss'}>${selected.profitLoss}</span></p>
          </div>
        )}

        <div className="form-group">
          <label>Quantity to Close</label>
          <input
            type="number"
            step="0.01"
            value={closeTrade.quantity}
            onChange={(e) => handleCloseInputChange('quantity', e.target.value)}
            placeholder="Enter Quantity to Close"
            required
          />
          {selected && (
            <button 
              type="button" 
              className="use-current-btn"
              onClick={() => handleCloseInputChange('quantity', selected.remainingQuantity)}
            >
              Close All
            </button>
          )}
        </div>

        <div className="form-group">
          <label>Close Price</label>
          <input
            type="number"
            step="0.0001"
            value={closeTrade.closePrice}
            onChange={(e) => handleCloseInputChange('closePrice', e.target.value)}
            placeholder="Enter Close Price"
            required
          />
          {currentPrice && (
            <button 
              type="button" 
              className="use-current-btn"
              onClick={() => handleCloseInputChange('closePrice', currentPrice)}
            >
              Use Current
            </button>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-button close-trade-btn" 
          disabled={isClosing}
        >
          {isClosing ? 'Closing...' : 'Close Trade'}
        </button>
      </form>
      
      <style>{`
        .form-container { padding: 0; }
        .selected-trade-info {
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        .form-group {
          margin-bottom: 15px;
          position: relative;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .form-group input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .use-current-btn {
          position: absolute;
          right: 0;
          top: 30px;
          background: #f0f0f0;
          border: 1px solid #ccc;
          padding: 4px 8px;
          cursor: pointer;
          border-radius: 4px;
        }
        .submit-button {
          width: 100%;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .close-trade-btn {
          background-color: #f44336;
          color: white;
        }
        .submit-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
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

export default Form;