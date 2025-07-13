import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUtils, boardAPI } from '../services/api';
import websocketService from '../services/websocket';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [username, setUsername] = useState('');
  const [connectedUsers, setConnectedUsers] = useState(new Set());
  const [wsConnected, setWsConnected] = useState(false);
  const navigate = useNavigate();

  const drawingRef = useRef({
    lastX: 0,
    lastY: 0,
    isDrawing: false
  });


  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && storedUsername.startsWith('Guest-')) {
      localStorage.removeItem('username');
    }

    if (!authUtils.isAuthenticated()) {
      navigate('/login');
      return;
    }
    const validUsername = localStorage.getItem('username');
    setUsername(validUsername);

    initializeCanvas();

    connectWebSocket();

    const handleResize = () => {
      const canvas = canvasRef.current;
      let imageData = null;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }
      
      initializeCanvas();
      
      if (imageData) {
        const ctx = canvas.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
      } else {
        loadBoardState();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      websocketService.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const availableWidth = window.innerWidth - 120; 
    const availableHeight = window.innerHeight - 350; 
    
    const newWidth = Math.min(1200, Math.max(800, availableWidth));
    const newHeight = Math.min(700, Math.max(500, availableHeight));
    
    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;
    }
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    console.log(`Canvas initialized: ${canvas.width}x${canvas.height}`);
    
    setTimeout(() => {
      const rect = canvas.getBoundingClientRect();
      console.log(`Canvas rect: ${rect.width}x${rect.height} at (${rect.left}, ${rect.top})`);
    }, 50);
  };

  const connectWebSocket = () => {
    websocketService.connect(
      () => {
        console.log('Connected to drawing WebSocket');
        setWsConnected(true);
        
        websocketService.subscribeToDrawing((drawingData) => {
          handleRemoteDrawing(drawingData);
        });
        
        loadBoardState();
      },
      (error) => {
        console.error('WebSocket connection failed:', error);
        setWsConnected(false);
      }
    );
  };

  const loadBoardState = async () => {
    try {
      const operations = await boardAPI.getBoardState();
      console.log(`Loading ${operations.length} drawing operations`);
      
      setTimeout(() => {
        operations.forEach(operation => {
          drawRemoteOperation(operation, false); // false = don't add to connected users
        });
      }, 100);
    } catch (error) {
      console.error('Failed to load board state:', error);
    }
  };

  const handleRemoteDrawing = (drawingData) => {
    if (drawingData.username === username) return;

    drawRemoteOperation(drawingData, true);
  };

  const drawRemoteOperation = (drawingData, addUser = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    console.log('Drawing remote operation:', drawingData);

    const ctx = canvas.getContext('2d');
    
    if (addUser) {
      setConnectedUsers(prev => new Set([...prev, drawingData.username]));
    }

    if (drawingData.type === 'draw') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = drawingData.color;
      ctx.lineWidth = drawingData.thickness;
      
      if (drawingData.prevX !== undefined && drawingData.prevY !== undefined) {
        console.log('Drawing remote line from', { x: drawingData.prevX, y: drawingData.prevY }, 'to', { x: drawingData.x, y: drawingData.y });
        ctx.beginPath();
        ctx.moveTo(drawingData.prevX, drawingData.prevY);
        ctx.lineTo(drawingData.x, drawingData.y);
        ctx.stroke();
      } else {
        console.log('Drawing remote point at', { x: drawingData.x, y: drawingData.y });
        ctx.beginPath();
        ctx.arc(drawingData.x, drawingData.y, drawingData.thickness / 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('Canvas not available');
      return { x: 0, y: 0 };
    }
    
    const rect = canvas.getBoundingClientRect();
    console.log('Canvas rect:', rect);
    
    if (rect.width === 0 || rect.height === 0) {
      console.warn('Canvas rect has zero dimensions:', rect);
      return { x: 0, y: 0 };
    }
    
    const clientX = e.clientX || 0;
    const clientY = e.clientY || 0;
    
    console.log('Mouse client position:', { clientX, clientY });
    console.log('Canvas dimensions:', { width: canvas.width, height: canvas.height });
    console.log('Canvas display size:', { width: rect.width, height: rect.height });
    
    const rawX = clientX - rect.left;
    const rawY = clientY - rect.top;
    
    console.log('Raw coordinates (before scaling):', { rawX, rawY });
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    console.log('Scale factors:', { scaleX, scaleY });
    
    const scaledX = rawX * scaleX;
    const scaledY = rawY * scaleY;
    
    console.log('Scaled coordinates:', { scaledX, scaledY });
    
    const pos = {
      x: Math.max(0, Math.min(canvas.width - 1, Math.round(scaledX))),
      y: Math.max(0, Math.min(canvas.height - 1, Math.round(scaledY)))
    };
    
    console.log('Final position:', pos);
    
    return pos;
  };

  const getEventPos = (e) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      return getMousePos({
        clientX: touch.clientX,
        clientY: touch.clientY
      });
    }
    if (e.clientX !== undefined && e.clientY !== undefined) {
      return getMousePos(e);
    }
    
    console.warn('Invalid event object for position calculation:', e);
    return { x: 0, y: 0 };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const pos = getEventPos(e);
    
    console.log('Start drawing event:', {
      type: e.type,
      clientX: e.clientX,
      clientY: e.clientY,
      calculatedPos: pos
    });
    
    if (!pos || pos.x < 0 || pos.y < 0) {
      console.warn('Invalid start position, skipping draw start:', pos);
      return;
    }
    
    setIsDrawing(true);
    
    drawingRef.current = {
      lastX: pos.x,
      lastY: pos.y,
      isDrawing: true
    };

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();

    if (websocketService.isConnected()) {
      websocketService.sendDrawingData({
        x: pos.x,
        y: pos.y,
        color: currentColor,
        thickness: brushSize,
        username: username,
        type: 'draw'
      });
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault(); 
    const pos = getEventPos(e);
    
    console.log('Draw move event:', {
      type: e.type,
      clientX: e.clientX,
      clientY: e.clientY,
      calculatedPos: pos,
      lastPos: drawingRef.current
    });
    
    if (!pos || pos.x < 0 || pos.y < 0) {
      console.warn('Invalid position in draw move:', pos);
      return;
    }
    
    const lastPos = drawingRef.current;
    if (!lastPos) {
      console.warn('No last position available');
      return;
    }
    
    const deltaX = Math.abs(lastPos.lastX - pos.x);
    const deltaY = Math.abs(lastPos.lastY - pos.y);
    if (deltaX < 1 && deltaY < 1) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    
    ctx.beginPath();
    ctx.moveTo(lastPos.lastX, lastPos.lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    console.log('Drawing line from', { x: lastPos.lastX, y: lastPos.lastY }, 'to', { x: pos.x, y: pos.y });

    if (websocketService.isConnected()) {
      websocketService.sendDrawingData({
        x: pos.x,
        y: pos.y,
        prevX: lastPos.lastX,
        prevY: lastPos.lastY,
        color: currentColor,
        thickness: brushSize,
        username: username,
        type: 'draw'
      });
    }

    drawingRef.current.lastX = pos.x;
    drawingRef.current.lastY = pos.y;
  };


  const stopDrawing = () => {
    setIsDrawing(false);
    drawingRef.current.isDrawing = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const clearBoard = async () => {
    try {
      await boardAPI.clearBoard();
      clearCanvas();
      console.log('Board cleared successfully');
    } catch (error) {
      console.error('Failed to clear board:', error);
      alert('Failed to clear board. Please try again.');
    }
  };

  const handleLogout = () => {
    authUtils.removeToken();
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">CloudSketch</h1>
              <span className="text-sm text-gray-600">Welcome, {username}</span>
              {wsConnected ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Disconnected
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {connectedUsers.size > 0 && (
                <span className="text-sm text-gray-600">
                  {connectedUsers.size} user(s) online
                </span>
              )}
              {authUtils.isAuthenticated() && (
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Drawing Tools */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center space-x-6">
            {/* Color Picker */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Color:</label>
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer"
              />
            </div>

            {/* Brush Size */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Brush Size:</label>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-32"
              />
              <span className="text-sm text-gray-600 min-w-[2rem]">{brushSize}px</span>
            </div>

            {/* Clear Button */}
            <button
              onClick={clearBoard}
              className="btn-secondary text-sm"
            >
              Clear Board
            </button>

            {/* Color Presets */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Quick Colors:</span>
              {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map(color => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`w-8 h-8 rounded-md border-2 ${
                    currentColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex justify-center">
          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Click and drag to draw. Your drawings are shared in real-time with other users.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Canvas size adapts to your screen for the best drawing experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
