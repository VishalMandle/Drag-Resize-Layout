
import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import {Box} from "@chakra-ui/react";

const ResizableBox = ({ id, color = '#f5f5f5', initialSize, onResize, children }) => {
  const MIN_WIDTH = 300;
  const MIN_HEIGHT = 250;
  const boxRef = useRef(null);
  const [size, setSize] = useState(initialSize);
  const isResizing = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startSize = useRef(initialSize);

  useEffect(() => {
    if (initialSize.width !== size.width || initialSize.height !== size.height) {
      setSize(initialSize);
    }
  }, [initialSize.width, initialSize.height]);

  useEffect(() => {
    if (onResize) {
      onResize(id, size);
    }
  }, [size.width, size.height]);

  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startSize.current = { ...size };
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };

  const handleResize = (e) => {
    if (!isResizing.current) return;
    const dx = e.clientX - startMouse.current.x;
    const dy = e.clientY - startMouse.current.y;
    setSize({
      width: Math.max(startSize.current.width + dx, MIN_WIDTH),
      height: Math.max(startSize.current.height + dy, MIN_HEIGHT),
    });
  };

  const stopResize = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };

  return (
    <div
      ref={boxRef}
      style={{
        width: size.width,
        height: size.height,
        background: "#f7fafc",
        borderRadius: '8px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
        position: 'absolute',
        overflow: 'hidden',
        transition: 'width 0.1s ease, height 0.1s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '1rem', flex: 1 }}>{children}</div>

      {/* <div
        onMouseDown={startResize}
        style={{
          width: 20,
          height: 20,
          position: 'absolute',
          right: 0,
          bottom: 0,
          cursor: 'se-resize',
          background: '#eee',
          borderTop: '1px solid #ccc',
          borderLeft: '1px solid #ccc',
          borderBottomRightRadius: '8px',
        }}
      >
        ⬍
      </div> */}
      <div
        onMouseDown={startResize}
        style={{
          width: 20,
          height: 20,
          position: 'absolute',
          right: 0,
          bottom: 0,
          cursor: 'se-resize',
          borderBottomRightRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          boxSizing: 'border-box',
        }}
      >
        <Box
          transform="rotate(45deg)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          lineHeight={0}
        >
          <ChevronRight boxSize={3.5} />
        </Box>
      </div>
    </div>
  );
};

export default ResizableBox;