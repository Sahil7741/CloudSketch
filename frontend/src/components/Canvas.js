import React, { useRef, useEffect, useState } from 'react';
import WebSocketService from '../services/WebSocketService';

const Canvas = ({ tool, color, strokeWidth }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [currentPath, setCurrentPath] = useState([]);
  const [roomId] = useState('room1');
  const [userId] = useState('user' + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    WebSocketService.connect(
      handleDrawingReceived,
      handleUserJoined,
      handleCanvasCleared
    );

    WebSocketService.joinRoom({ userId, roomId });

    return () => {
      WebSocketService.disconnect();
    };
  }, [roomId, userId]);

  const handleDrawingReceived = (drawingData) => {
    if (drawingData.userId !== userId) {
      drawReceivedPath(drawingData.points);
    }
  };

  const handleUserJoined = (userData) => {
    console.log('User joined:', userData);
  };

  const handleCanvasCleared = (receivedRoomId) => {
    if (receivedRoomId === roomId) {
      clearCanvas();
    }
  };

  const drawReceivedPath = (points) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    
    ctx.strokeStyle = points[0].color;
    ctx.lineWidth = points[0].strokeWidth;
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = points[0].tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setLastPos(pos);
    setCurrentPath([{
      x: pos.x,
      y: pos.y,
      color,
      strokeWidth,
      tool,
      roomId,
      userId
    }]);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const currentPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = strokeWidth * 2;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
    }
    
    ctx.lineCap = 'round';
    ctx.stroke();

    const newPoint = {
      x: currentPos.x,
      y: currentPos.y,
      color,
      strokeWidth,
      tool,
      roomId,
      userId
    };

    setCurrentPath(prev => [...prev, newPoint]);
    setLastPos(currentPos);
  };

  const stopDrawing = () => {
    if (isDrawing && currentPath.length > 1) {
      const drawingData = {
        type: 'draw',
        points: currentPath,
        roomId,
        userId,
        action: 'draw'
      };
      
      WebSocketService.sendDrawingData(drawingData);
    }
    
    setIsDrawing(false);
    setCurrentPath([]);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{ border: '1px solid #ccc', cursor: 'crosshair' }}
    />
  );
};

export default Canvas;
