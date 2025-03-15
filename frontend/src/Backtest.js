import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ChartAndControls from './ChartAndControls';
import Form from './Form';
import TradeList from './TradeList';
import StartForm from './StartForm';
import Modal from './Modal';

const Backtest = () => {
  // State management
  const [currentPrice, setCurrentPrice] = useState(null);
  const [candleData, setCandleData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [timeInterval, setTimeInterval] = useState('1');
  const [hasStarted, setHasStarted] = useState(false);
  const [clickedPoint, setClickedPoint] = useState(null);
  const [trades, setTrades] = useState([]);
  const [candlestickSeries, setCandlestickSeries] = useState(null);
  const [summary, setSummary] = useState({
    unrealized: 0,
    realized: 0,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [projectionMode, setProjectionMode] = useState('long');
  const chartContainerRef = useRef(null);

    // New state for modals
    const [tradeModal, setTradeModal] = useState({
      isOpen: false,
      action: ''
    });
    
    const [closeTradeModal, setCloseTradeModal] = useState({
      isOpen: false,
      trade: null
    });
  
  // Add new candle - this function fetches all updated data
  const addNewCandle = async () => {
    if (!hasStarted) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/backtest', { 
        currentIndex, 
        timeInterval 
      });
      
      if (response.data.nextCandlestick) {
        const newCandle = {
          time: new Date(response.data.nextCandlestick.time).getTime() / 1000,
          open: response.data.nextCandlestick.open,
          high: response.data.nextCandlestick.high,
          low: response.data.nextCandlestick.low,
          close: response.data.nextCandlestick.close,
        };
        
        // Update candleData state with new candle
        setCandleData(prevData => [...prevData, newCandle]);
        
        // Update candlestick series directly if available
        if (candlestickSeries) {
          candlestickSeries.update(newCandle);
        }
        
        setCurrentIndex(response.data.nextIndex);
        setCurrentPrice(newCandle.close);
        
        // Update trades data
        setTrades(response.data.trades || []);
        
        // Calculate summary
        updatePnLSummary(response.data.trades || []);
      }
    } catch (error) {
      console.error('Error fetching new candlestick:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate PnL summary from trades
  const updatePnLSummary = (tradesData) => {
    const unrealized = tradesData
      .filter(t => t.isOpen)
      .reduce((sum, t) => sum + (Number(t.profitLoss) || 0), 0);
      
    const realized = tradesData
      .filter(t => !t.isOpen)
      .reduce((sum, t) => sum + (Number(t.realizedProfitLoss) || 0), 0);
      
    setSummary({
      unrealized,
      realized,
      total: unrealized + realized
    });
  };
  
  // Handle trade submission
  const handleSubmitTrade = async (tradeData) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/account', {
        ...tradeData,
        price: tradeData.price || currentPrice
      });
      
      // Update trades data
      setTrades(response.data.trades || []);
      
      // Update PnL summary
      updatePnLSummary(response.data.trades || []);

       // Close the modal after successful submission
       setTradeModal({ isOpen: false, action: '' });
      
      return response.data;
    } catch (error) {
      console.error('Error placing trade:', error);
      throw error;
    }
  };
  
  // Handle trade closing
  const handleCloseTrade = async (closeData) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/close_trade', {
        ...closeData,
        closePrice: closeData.closePrice || currentPrice
      });
      
      // Update trades data
      setTrades(response.data.trades || []);
      
      // Update PnL summary
      updatePnLSummary(response.data.trades || []);

      // Close the modal after successful submission
      setCloseTradeModal({ isOpen: false, trade: null });
      
      return response.data;
    } catch (error) {
      console.error('Error closing trade:', error);
      throw error;
    }
  };
  
  const handleTradeClick = (action) => {
    setTradeModal({
      isOpen: true,
      action: action
    });
  };
  
  // Open close trade modal when a trade is clicked in TradeList
  const handleTradeItemClick = (trade) => {
    if (trade.isOpen) {
      setCloseTradeModal({
        isOpen: true,
        trade: trade
      });
    }
  };
  
  // Filter open trades for the form component
  const openTrades = trades.filter(trade => trade.isOpen);
  
  return (
    <div className="backtest-container" style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {!hasStarted ? (
        <StartForm 
          setStartDate={setStartDate} 
          setTimeInterval={setTimeInterval} 
          setHasStarted={setHasStarted} 
        />
      ) : (
        <>
          <div style={{ 
            display: 'flex', 
            flexDirection: window.matchMedia('(min-width: 992px)').matches ? 'row' : 'column',
            gap: '20px',
            marginBottom: '20px' 
          }}>
            {/* Chart area - left side */}
            <div style={{ flex: '2' }}>
              <ChartAndControls 
                chartContainerRef={chartContainerRef}
                candlestickSeries={candlestickSeries}
                setCandlestickSeries={setCandlestickSeries}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                startDate={startDate}
                timeInterval={timeInterval}
                setClickedPoint={setClickedPoint}
                setTotalPnL={(pnl) => setSummary(prev => ({...prev, total: pnl}))}
                setTrades={setTrades}
                handleTrade={handleTradeClick}
                addNewCandle={addNewCandle}
              />
              
              {clickedPoint && (
                <div className="clicked-point-info" style={{
                  margin: '10px 0',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                }}>
                  <p><strong>Selected Point:</strong> {clickedPoint.time} | Price: ${clickedPoint.price?.toFixed(5)}</p>
                </div>
              )}
            </div>
            
            {/* Trade list - right side */}
            <div style={{ 
              flex: '1',
              minWidth: window.matchMedia('(min-width: 992px)').matches ? '300px' : 'auto',
              maxHeight: '600px',
              overflowY: 'auto',
              padding: '10px',
              border: '1px solid #e0e0e0',
              borderRadius: '5px',
              backgroundColor: '#f9f9f9'
            }}>
              <TradeList 
                trades={trades} 
                summary={summary} 
                onTradeClick={handleTradeItemClick} 
              />
            </div>
          </div>
          
 {/* Trade Modals */}
 <Modal 
            isOpen={tradeModal.isOpen} 
            onClose={() => setTradeModal({ isOpen: false, action: '' })}
            title={`Place ${tradeModal.action.toUpperCase()} Trade`}
          >
            <Form
              currentPrice={currentPrice}
              onSubmitTrade={handleSubmitTrade}
              onCloseTrade={handleCloseTrade}
              openTrades={openTrades}
              initialAction={tradeModal.action}
            />
          </Modal>
          
          <Modal 
            isOpen={closeTradeModal.isOpen} 
            onClose={() => setCloseTradeModal({ isOpen: false, trade: null })}
            title="Close Trade"
          >
            <Form
              currentPrice={currentPrice}
              onSubmitTrade={handleSubmitTrade}
              onCloseTrade={handleCloseTrade}
              openTrades={openTrades}
              selectedTrade={closeTradeModal.trade}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default Backtest;