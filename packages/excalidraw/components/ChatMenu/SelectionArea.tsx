import { useState, useEffect, useCallback } from "react";
import type { Options } from "dom-to-image";
import domtoimage from "dom-to-image";

function calculateSelectionArea() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const width = viewportWidth * 1; // 85vw
  const height = viewportHeight * 1; // 80vh
  const x = 0;
  const y = 20;
  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(width),
    height: Math.round(height) + 100,
  };
}

const CHATMENU_WIDTH = 490;

function SelectionArea(props: {
  isDistinguish: boolean;
  showSelectionArea: boolean;
  onScreenshot: (file: string) => void;
}) {
  const { isDistinguish, showSelectionArea, onScreenshot } = props;
  const [area, setArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  useEffect(() => {
    function updateArea() {
      setArea(calculateSelectionArea());
    }
    updateArea();
    window.addEventListener("resize", updateArea);
    return () => window.removeEventListener("resize", updateArea);
  }, []);

  const captureArea = useCallback(() => {
    const node = document.body;
    const options: Options = {
      width: area.width - CHATMENU_WIDTH,
      height: area.height,
      style: {
        transform: `translate(${-area.x}px, ${-area.y}px)`,
        "transform-origin": "top left",
      },
      filter: (node) => {
        // @ts-ignore
        return (
          !(node instanceof Element) ||
          (!node.classList.contains("App-menu_top") &&
            !node.classList.contains("App-menu_bottom"))
        );
      },
    };

    domtoimage
      .toPng(node, options)
      .then((dataUrl: string) => {
        onScreenshot(dataUrl);
      })
      .catch((error: Error) => {
        console.error("截图失败:", error);
      });
  }, [area, onScreenshot]);

  useEffect(() => {
    if (showSelectionArea) {
      setTimeout(() => {
        captureArea();
      }, 100);
    }
  }, [showSelectionArea]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: 2,
          top: 88,
          width: `${area.width - CHATMENU_WIDTH}px`,
          height: `${area.height}px`,
          border: "2px solid red",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: Number(isDistinguish),
        }}
      />
    </>
  );
}

export default SelectionArea;
