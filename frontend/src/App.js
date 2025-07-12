import React, { useState } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';

function App() {
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  return (
    <div className="app">
      <Toolbar 
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
      />
      <div className="canvas-container">
        <Canvas 
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
        />
      </div>
    </div>
  );
}

export default App;
