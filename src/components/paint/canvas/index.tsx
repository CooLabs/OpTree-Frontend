import React, { useMemo } from "react";
import "./index.less";
import { useEffect } from "react";
import { useRef } from "react";
import {
  LineWidthType,
  ShapeOutlineType,
  ShapeToolType,
  ToolType,
} from "../util/toolType";
import { FC } from "react";
import { useState } from "react";
import { Pen, Tool, Eraser, ColorFill, Text } from "../util/tool";
import Shape from "../util/tool/shape";
import { useContext } from "react";
import { DispatcherContext } from "../context";
import { CLEAR_EVENT, REDO_EVENT, UNDO_EVENT } from "../util/dispatcher/event";
import SnapShot from "../util/snapshot";
import { Input } from "antd";
import cursorPen from "@/assets/icon/cursorPen.jpg";
import cursorErase from "@/assets/icon/cursorErase.jpg";
import straw from "@/assets/icon/straw.jpg";
import { getScale } from "./utils";

interface CanvasProps {
  toolType: ToolType;
  shapeType: ShapeToolType;
  shapeOutlineType: ShapeOutlineType;
  lineWidthType: LineWidthType;
  strawType?: boolean;
  mainColor: string;
  subColor: string;
  lineSize?: number;
  fillColor: string;
  fontStyle: any;
  imgSrc?: string;
  CanvasSize: {
    width: number;
    height: number;
  };
  id: string;
  background?: string;
  onSize?: (value: any) => void;
  setColor: (value: string) => void;
}

let show_scale = 1;

let translatex = 0;
let translatey = 0;

const maxScale = 6;
const minScale = 0.1;
const scaleStep = 0.1;

const Canvas: FC<CanvasProps> = (props) => {
  const {
    id,
    toolType,
    lineWidthType,
    mainColor,
    subColor,
    setColor,
    CanvasSize,
    fillColor,
    shapeType,
    shapeOutlineType,
    fontStyle,
    imgSrc,
    background,
    strawType,
    lineSize = 1,
  } = props;
  const [tool, setTool] = useState<Tool>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const allCanvasRef = useRef<HTMLDivElement>(null);
  const canvasTextRef = useRef<HTMLDivElement>(null);
  const textBoxRef = useRef<HTMLTextAreaElement>(null);
  const dispatcherContext = useContext(DispatcherContext);
  const [snapshot] = useState<SnapShot>(new SnapShot());

  useEffect(() => {
    showCanvasCursor();
    switch (toolType) {
      case ToolType.PEN:
        setTool(new Pen());
        break;
      case ToolType.ERASER:
        setTool(new Eraser(lineSize));
        break;
      // case ToolType.COLOR_EXTRACT:
      //   setTool(new ColorExtract(setColor));
      //   break;
      case ToolType.COLOR_FILL:
        setTool(new ColorFill());
        break;
      case ToolType.TEXT:
        setTool(new Text(fontStyle));
        break;
      case ToolType.SHAPE:
        setTool(
          new Shape(shapeType, shapeOutlineType === ShapeOutlineType.DOTTED)
        );
        break;
      default:
        break;
    }
  }, [toolType, shapeType, fontStyle, lineSize]);

  useEffect(() => {
    if (tool instanceof Shape) {
      tool.isDashed = shapeOutlineType === ShapeOutlineType.DOTTED;
    }
  }, [shapeOutlineType]);

  useEffect(() => {
    switch (lineWidthType) {
      case LineWidthType.THIN:
        Tool.lineWidthFactor = 1;
        break;
      case LineWidthType.MIDDLE:
        Tool.lineWidthFactor = 2;
        break;
      case LineWidthType.BOLD:
        Tool.lineWidthFactor = 3;
        break;
      case LineWidthType.MAXBOLD:
        Tool.lineWidthFactor = 4;
        break;
      case LineWidthType.LINESIZE:
        Tool.lineWidthFactor = lineSize;
        break;
      default:
        break;
    }
  }, [lineWidthType, lineSize]);

  useEffect(() => {
    Tool.mainColor = mainColor;
  }, [mainColor]);

  useEffect(() => {
    Tool.fillColor = fillColor;
  }, [fillColor]);

  useEffect(() => {
    Tool.subColor = subColor;
  }, [subColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      showCanvasCursor();
      drawCanvas();
      Tool.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      // 注册清空画布事件
      const dispatcher = dispatcherContext.dispatcher;
      const callback = () => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (imgSrc) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = imgSrc;
            img.onload = function () {
              const { width, height } = img;
              /*1.在canvas 中绘制图像*/
              ctx.drawImage(img, 0, 0);
              /*2.从canvas 中获取图像的ImageData*/
              const imgData = ctx.getImageData(0, 0, width, height);
              /*3.在canvas 中显示ImageData*/
              ctx.putImageData(
                imgData,
                //位置
                0,
                height
              );
              snapshot.add(imgData);
            };
          } else {
            ctx.fillStyle = "#2d2d2d";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      };
      dispatcher.on(CLEAR_EVENT, callback);

      // 注册画布前进事件
      const forward = () => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const imageData = snapshot.forward();
          if (imageData) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.putImageData(imageData, 0, 0);
          }
        }
      };
      dispatcher.on(REDO_EVENT, forward);

      // 注册画布后退事件
      const back = () => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const imageData = snapshot.back();
          if (imageData) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.putImageData(imageData, 0, 0);
          }
        }
      };
      dispatcher.on(UNDO_EVENT, back);

      return () => {
        dispatcher.off(CLEAR_EVENT, callback);
      };
    }
  }, [canvasRef]);

  useEffect(() => {
    showCanvasCursor();
  }, [strawType]);

  //鼠标icon
  const showCanvasCursor = () => {
    const canvas = canvasRef.current;
    const textBox = textBoxRef.current;
    if (canvas) {
      if (strawType) {
        //吸色
        return (canvas.style.cursor = `url(${straw}),auto`);
      }
      if (toolType === 0) {
        canvas.style.cursor = `url(${cursorPen}) 12 16,auto`;
      } else if (toolType === 4) {
        canvas.style.cursor = `url(${cursorErase}),auto`;
      } else {
        canvas.style.cursor = `auto`;
      }
      if (toolType !== 2) {
        textBox!.setAttribute("style", `z-index:-1;display:none`);
      }
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const container = allCanvasRef!.current;
    const textRef = canvasTextRef.current;
    if (canvas && container && textRef) {
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      if (imgSrc) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imgSrc;
        img.onload = function () {
          canvas.height = img.height;
          canvas.width = img.width;
          /*1.在canvas 中绘制图像*/
          // ctx.scale(showScale, showScale);
          textRef.setAttribute(
            "style",
            `width:${canvas.width};height:${canvas.height}`
          );
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          snapshot.add(ctx.getImageData(0, 0, canvas.width, canvas.height));
        };
      } else if (CanvasSize) {
        canvas.height = CanvasSize.height;
        canvas.width = CanvasSize.width;
        ctx.fillStyle = background || "#2d2d2d";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        snapshot.add(ctx.getImageData(0, 0, canvas.width, canvas.height));
      }
    }
  };

  useEffect(() => {
    const container = allCanvasRef!.current;
    const canvas = canvasRef.current;

    if (CanvasSize && container && canvas) {
      if (Tool.ctx) {
        Tool.ctx.clearRect(0, 0, canvas.width, canvas?.height);
      }
      drawCanvas();
      const height = container!.clientHeight;
      const width = container!.clientWidth;
      show_scale = getScale({ width, height }, CanvasSize);
      Tool.currentScale = show_scale;
      translatex = (width - CanvasSize.width * show_scale) / 2;
      translatey = (height - CanvasSize.height * show_scale) / 2;
      console.log("===345", width, translatex, CanvasSize, show_scale);
      canvas!.style.transform = `translate3d(${translatex}px, ${translatey}px, 0px) scale(${show_scale})`;
      //canvas.style.transform = `scale(${show_scale}) translate3d(${translatex}px,${translatey}px, 0px)`;
    }
  }, [CanvasSize]);

  const onMouseDown = (event: MouseEvent) => {
    if (tool) {
      tool.onMouseDown(event);
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    if (tool) {
      tool.onMouseMove(event);
    }
  };

  const onMouseUp = (event: MouseEvent) => {
    if (tool) {
      tool.onMouseUp(event);
      // 存储canvas剪影
      snapshot.add(
        Tool.ctx.getImageData(
          0,
          0,
          Tool.ctx.canvas.width,
          Tool.ctx.canvas.height
        )
      );
    }
  };

  const onTouchStart = (event: TouchEvent) => {
    if (tool) {
      tool.onTouchStart(event);
    }
  };

  const onTouchMove = (event: TouchEvent) => {
    if (tool) {
      tool.onTouchMove(event);
    }
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (tool) {
      tool.onTouchEnd(event);
    }
    // 存储canvas剪影
    snapshot.add(
      Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height)
    );
  };

  const getTrans = (
    client: number,
    newScale: number,
    direction: string,
    img: any,
    boxdom: any,
    scale: number
  ) => {
    const lastTrans = direction === "width" ? translatex : translatey;
    // console.log("已经偏移的距离:", lastTrans);

    const sizeChanage = img[direction] * newScale - img[direction] * scale;
    // console.log(`img ${direction}放大了:`, sizeChanage);

    // 整体已经移动过了，需要弥补回来
    const pre = client - lastTrans - boxdom[direction === "width" ? "x" : "y"];

    //console.log("缩放中心到边界的距离", pre);

    const percent = pre / (img[direction] * scale);

    //  console.log("当前缩放尺度下，缩放中心到边界比例", percent);

    const trans = percent * sizeChanage;
    // console.log("缩放中心移动的距离:", trans);
    return trans;
  };

  const onMousewheel = (event: any) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    const container = allCanvasRef!.current;
    const { clientX, clientY, deltaX, deltaY, ctrlKey } = event;
    const { width, height, x, y } = container!.getBoundingClientRect();
    let newScale;
    if (ctrlKey) {
      //双指放大缩小
      if (deltaY < 0) {
        newScale = show_scale + scaleStep;
        newScale = Math.min(newScale, maxScale);
      } else {
        newScale = show_scale - scaleStep;
        newScale = Math.max(newScale, minScale);
      }
      const transX = getTrans(
        clientX,
        newScale,
        "width",
        CanvasSize,
        {
          width,
          height,
          x,
          y,
        },
        show_scale
      );
      const transY = getTrans(
        clientY,
        newScale,
        "height",
        CanvasSize,
        {
          width,
          height,
          x,
          y,
        },
        show_scale
      );
      translatex = translatex - transX;
      translatey = translatey - transY;
      show_scale = newScale;
      Tool.currentScale = newScale;
      canvas!.style.transform = `translate3d(${translatex}px, ${translatey}px, 0px) scale(${show_scale})`;
    } else {
      if (!!deltaX && !deltaY) {
        // 左右移动 向右 -deltaX < 0  向左   >0
        translatex = translatex - deltaX;
      } else if (!!deltaY && !deltaX) {
        translatey = translatey - deltaY;
      }

      canvas!.style.transform = `translate3d(${translatex}px, ${translatey}px, 0px) scale(${show_scale})`;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("wheel", onMousewheel, { passive: false });
      canvas.addEventListener("touchstart", onTouchStart);
      canvas.addEventListener("touchmove", onTouchMove);
      canvas.addEventListener("touchend", onTouchEnd);

      return () => {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("wheel", onMousewheel);

        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchmove", onTouchMove);
        canvas.removeEventListener("touchend", onTouchEnd);
      };
    }
  }, [canvasRef, onMouseDown, onMouseMove, onMouseUp]);

  const style = {
    margin: "auto",
  };
  if (allCanvasRef && CanvasSize) {
    const allCanvas = allCanvasRef.current;
    if (allCanvas) {
      style.margin =
        allCanvas.offsetWidth < (CanvasSize?.width || 0) ? "unset" : "auto";
    }
  }
  return (
    <div className="all-canvas" ref={allCanvasRef}>
      <canvas
        id={`ccc-paint-canvas ${id}`}
        className="ccc-paint-canvas"
        ref={canvasRef}
        style={{
          background: background || "#2d2d2d",
          ...style,
        }}
      ></canvas>
      <div className="canvas-text" id="text-container" ref={canvasTextRef}>
        <textarea
          ref={textBoxRef}
          id="textBox"
          name="story"
          autoFocus={true}
          //autocomplete={fales}
          //bordered={true}
          // autoSize={{ minRows: 2, maxRows: 2 }}
          className={`text-box`}
          // rows={1}
        />
      </div>
    </div>
  );
};

export default Canvas;
