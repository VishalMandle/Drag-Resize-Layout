
import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import ResizableBox from './ResizableBox.jsx';
import { Button } from '@chakra-ui/react';
import { Demo } from './Chart.jsx';

const chartComponentMap = {
  'chart-1': <Demo />,
  'chart-2': <Demo />,
  'chart-3': <Demo />,
  'chart-4': <Demo />,
  'chart-5': <Demo />,
  'chart-6': <Demo />,
  'chart-7': <Demo />,
};

const CHART_IDS = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5', 'chart-6', 'chart-7'];
const LAYOUT_KEY = 'dashboardLayout';

const getSavedLayout = () => {
  try {
    const saved = localStorage.getItem(LAYOUT_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error('Failed to parse localStorage layout:', e);
    return {};
  }
};

const Container = () => {
  const [layout, setLayout] = useState({});
  const [parentHeight, setParentHeight] = useState(window.innerHeight - 100);
  const [parentWidth, setParentWidth] = useState(0);

  const containerRef = useRef(null);
  const nodeRefs = useRef({});

  useEffect(() => {
    // Measure parent width
    const updateWidth = () => {
      if (containerRef.current) {
        setParentWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const storedLayout = getSavedLayout();
    if (!storedLayout || Object.keys(storedLayout).length === 0) {
      const defaultLayout = {};
      CHART_IDS.forEach((id, i) => {
        defaultLayout[id] = {
          width: 300,
          height: 250,
          x: (i % 2) * 320,
          y: Math.floor(i / 2) * 320,
        };
      });
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(defaultLayout));
      setLayout(defaultLayout);
    } else {
      setLayout(storedLayout);
    }
  }, []);

  const updateParentHeight = (newLayout) => {
    let maxBottom = 0;
    Object.values(newLayout).forEach(({ y, height }) => {
      maxBottom = Math.max(maxBottom, y + height);
    });
    setParentHeight(Math.max(window.innerHeight - 100, maxBottom + 200)); 
  };

  const handleResize = (id, newSize) => {
    setLayout((prev) => {
      const updated = { ...prev, [id]: { ...prev[id], ...newSize } };
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(updated));
      updateParentHeight(updated);
      return updated;
    });
  };

  const handleDragStop = (id, data) => {
    const { x, y } = data;
    const boundedX = Math.max(0, x);
    const boundedY = Math.max(0, y);

    setLayout((prev) => {
      const updated = { ...prev, [id]: { ...prev[id], x: boundedX, y: boundedY } };
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(updated));
      updateParentHeight(updated);
      return updated;
    });
  };

  const handleReset = () => {
    localStorage.removeItem(LAYOUT_KEY);
    window.location.reload();
  };

  return (
    <div
      ref={containerRef}
      style={{
        border: "1px solid",
        borderWidth: "1px", borderRadius: "md", 
        padding: '2rem',
        height: parentHeight+200,
        position: 'relative',
    
      }}
    >
      <Button onClick={handleReset} mb={4}>Reset</Button>
      {Object.keys(layout).length > 0 && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: `${parentHeight}px`,
            overflow: 'hidden',
          }}
        >
          {CHART_IDS.map((id) => {
            if (!nodeRefs.current[id]) {
              nodeRefs.current[id] = React.createRef();
            }
            return (
              <Draggable
                key={id}
                nodeRef={nodeRefs.current[id]}
                bounds={{
                  left: 0,
                  top: 0,
                  right: parentWidth - layout[id].width - 70, 
                  bottom: parentHeight - layout[id].height,
                }}
                position={{ x: layout[id].x, y: layout[id].y }}
                onStop={(e, data) => handleDragStop(id, data)}
              >
                <div ref={nodeRefs.current[id]} style={{ position: 'absolute' }}>
                  <ResizableBox
                    id={id}
                    color="#e3f2fd"
                    initialSize={{ width: layout[id].width, height: layout[id].height }}
                    onResize={handleResize}
                    maxWidth={parentWidth - layout[id].x - 40} 
                    minWidth={100}
                    minHeight={100}
                  >
                    {chartComponentMap[id] || <div>Chart Placeholder</div>}
                  </ResizableBox>
                </div>
              </Draggable>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Container;
