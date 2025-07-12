import React from 'react';

const Toolbar = ({ tool, setTool, color, setColor, strokeWidth, setStrokeWidth }) => {
  return (
    <div className="toolbar">
      <h2>CloudSketch</h2>
      
      <div>
        <label>Tool: </label>
        <select value={tool} onChange={(e) => setTool(e.target.value)}>
          <option value="pen">Pen</option>
          <option value="eraser">Eraser</option>
        </select>
      </div>

      <div>
        <label>Color: </label>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      <div>
        <label>Size: </label>
        <input 
          type="range" 
          min="1" 
          max="20" 
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
        />
        <span>{strokeWidth}px</span>
      </div>

      <button onClick={() => window.location.reload()}>Clear</button>
    </div>
  );
};

export default Toolbar;
