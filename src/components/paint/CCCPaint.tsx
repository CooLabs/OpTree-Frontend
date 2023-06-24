import React, { Ref, useEffect, useImperativeHandle } from "react";
import Canvas from "./canvas";
import { LoadingOutlined } from "@ant-design/icons";
import { Tool } from "./util/tool";
import {
  ToolTypeContext,
  ShapeTypeContext,
  ShapeOutlineContext,
  LineWidthContext,
  ColorContext,
  FillContext,
  TextContext,
  DispatcherContext,
} from "./context";
import "./style.less";
import { useState } from "react";
import {
  ColorType,
  LineWidthType,
  ShapeOutlineType,
  ShapeToolType,
  ToolType,
} from "./util/toolType";
import ToolPanel from "./left-tool";
import Dispatcher from "./util/dispatcher";
import Right from "./right";
import Edit from "./edit";
import { getImageSize } from "./utils";
import { getMousePos } from "./util/tool/tool";
import PiexCanvas from "./piexCanvas";

interface PaintProps {
  imgSrc?: string;
  width?: number;
  height?: number;
  background?: string;
  id?: string;
  cRef?: any;
  ThumbSrc?: string;
  isPixel?: boolean;
  showArea?: Array<[number, number]>;
}
//= https://bafybeibsrvi7eb2eibdkr73e2d3znucfpbkvml2jsbgt7cctdk7m4p2fi4.ipfs.dweb.link/orign.png
//"https://bafybeicgvg3vwtv5c633cjexbykjp75yjt755qhma4o7vgusa4ldvocz44.ipfs.dweb.link/orign.png"
//https://bafybeifgfvlt6qhz5b2gb4t35pzalywvzxm7qmlj3d4vpmcwq7vmqtqtdu.ipfs.dweb.link/orign.png

//https://bafybeiblav74hxa4r4vojadmrvitljxqksm4g24mkkvk64bqar5ii3a3t4.ipfs.dweb.link/orign.jpeg
function Paint(props: PaintProps): JSX.Element {
  const {
    id = "test",
    imgSrc = "https://bafybeicgvg3vwtv5c633cjexbykjp75yjt755qhma4o7vgusa4ldvocz44.ipfs.dweb.link/orign.png",
    width = 0,
    height = 0,
    background,
    cRef,
    showArea,
    ThumbSrc,
    isPixel = false,
  } = props;

  const [toolType, setToolType] = useState<ToolType>(ToolType.PEN);
  const [strawType, setStrawType] = useState<boolean>(false);
  const [shapeType, setShapeType] = useState<ShapeToolType>(ShapeToolType.LINE);
  const [size, setSize] = useState({ width, height });
  const [Thumbnail, setThumbnail] = useState(ThumbSrc);
  const [loadings, setLoadings] = useState(true);
  const [showPixel, setIsPixel] = useState(isPixel);

  const [shapeOutlineType, setShapeOutlineType] = useState<ShapeOutlineType>(
    ShapeOutlineType.SOLID
  );
  const [lineWidthType, setLineWidthType] = useState<LineWidthType>(
    LineWidthType.LINESIZE
  );
  const [lineSize, setLineFontSize] = useState<number>(1);
  const [fillColor, setFillColor] = useState<string>("");
  const [activeColorType, setActiveColorType] = useState<ColorType>(
    ColorType.MAIN
  );
  const [fontStyle, setFontStyle] = useState({
    fontSize: 72,
    fontFamily: "System Font",
  });
  const [mainColor, setMainColor] = useState<string>("black");
  const [subColor, setSubColor] = useState<string>("white");
  const [dispatcher] = useState(new Dispatcher());

  const setColor = (value: string) => {
    if (activeColorType === ColorType.MAIN) {
      setMainColor(value);
    } else {
      setSubColor(value);
    }
  };

  useImperativeHandle(cRef, () => ({
    getCurrentImageData: () => {
      canvasText();
      const canvasElem: any = document.getElementById(`ccc-paint-canvas ${id}`);
      let imageData;
      if (Tool.isPixel) {
        const data = canvasElem
          .getContext("2d")
          .getImageData(0, 0, canvasElem.width, canvasElem.height);
        imageData = calcImageData(data);
      } else {
        imageData = canvasElem.toDataURL("image/png");
      }
      return imageData;
    },
  }));

  const calcImageData = (imageData: ImageData) => {
    const canvasElem: any = document.createElement("canvas");
    canvasElem.width = size.width;
    canvasElem.height = size.height;
    const imgData = imageData;
    const ctx = canvasElem.getContext("2d");
    const data = imgData.data;
    for (let i = 0; i < imgData.width; i += Tool.OptPixel.size) {
      for (let j = 0; j < imgData.height; j += Tool.OptPixel.size) {
        let index = j * imgData.width + i;
        const flag = index * 4;
        let rgb = `rgba(${data[flag]},${data[flag + 1]},${data[flag + 2]},${
          data[flag + 3] / 255
        })`;
        ctx.fillStyle = rgb;
        ctx.fillRect(i / Tool.OptPixel.size, j / Tool.OptPixel.size, 1, 1);
      }
    }

    return canvasElem.toDataURL("image/png");
  };

  const loadImage = async (imgSrc: string) => {
    const size = await getImageSize(imgSrc);
    setSize(size);
    if (!isPixel) {
      setLineFontSize(Math.floor(size.width / 100));
    }
    setLoadings(false);
  };

  useEffect(() => {
    // 再一次进入
    setIsPixel(isPixel);
    Tool.isPixel = isPixel;
    Tool.currentScale = 1;
    Tool.translate = { translatex: 0, translatey: 0 };

    if (imgSrc) {
      loadImage(imgSrc);
    } else if (width && height) {
      setSize({ width, height });
      setLoadings(false);
    }
    if (!ThumbSrc) {
      // 没有area
      setThumbnail("");
      Tool.showArea = null;
    }
  }, [width, imgSrc, height, isPixel]);

  const canvasText = () => {
    if (
      Tool.textList &&
      Object.keys(Tool.textList).length > 0 &&
      !Tool.isPixel
    ) {
      Object.keys(Tool.textList).forEach((va) => {
        const { data, pos } = Tool.textList[va];
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = data;
        img.onload = function () {
          /*1.在canvas 中绘制图像*/
          const { x, y } = getMousePos(Tool.ctx.canvas, undefined, undefined, {
            x: pos[0],
            y: pos[1],
          });
          Tool.ctx.drawImage(img, x, y);
        };
        if (Tool.textList[va].canvas) {
          document
            .getElementById("all-canvas")
            ?.removeChild(Tool.textList[va].canvas);
        }
      });
      Tool.textList = {};
    }
  };

  if (showArea) {
    Tool.showArea = showArea;
  }
  return (
    <ToolTypeContext.Provider
      value={{
        type: toolType,
        strawType: strawType,
        setStrawType: (value) => {
          setStrawType(value);
        },
        setType: (value) => {
          canvasText();
          setToolType(value);
        },
      }}
    >
      <ShapeTypeContext.Provider
        value={{
          type: shapeType,
          setType: (type: ShapeToolType) => {
            setShapeType(type);
          },
        }}
      >
        <ShapeOutlineContext.Provider
          value={{ type: shapeOutlineType, setType: setShapeOutlineType }}
        >
          <LineWidthContext.Provider
            value={{
              type: lineWidthType,
              lineSize: lineSize,
              setType: setLineWidthType,
              setLineSize: setLineFontSize,
            }}
          >
            <DispatcherContext.Provider value={{ dispatcher }}>
              <ColorContext.Provider
                value={{
                  mainColor,
                  subColor,
                  activeColor: activeColorType,
                  setColor,
                  setActiveColor: setActiveColorType,
                }}
              >
                <FillContext.Provider
                  value={{
                    fillColor,
                    setFillColor,
                  }}
                >
                  <TextContext.Provider
                    value={{
                      fontStyle,
                      setFont: setFontStyle,
                    }}
                  >
                    <div className="ccc">
                      <div className="ccc-edit">
                        <Edit />
                        {/* <Button
                          onClick={() => {
                            const canvasElem: any = document.getElementById(
                              `ccc-paint-canvas ${id}`
                            );
                            const data = canvasElem
                              .getContext("2d")
                              .getImageData(
                                0,
                                0,
                                canvasElem.width,
                                canvasElem.height
                              );
                            calcImageData(data);
                          }}
                        >
                          保存
                        </Button> */}
                      </div>
                      <div className="ccc-content">
                        <div className="ToolPanel">
                          <ToolPanel
                            isPixel={isPixel}
                            className="toolbar-item"
                            fillColor={fillColor}
                          />
                        </div>
                        {loadings ? (
                          <div className="show-loading">
                            <LoadingOutlined className="loading-size" />
                          </div>
                        ) : (
                          <div className="show-Canvas">
                            {isPixel ? (
                              <PiexCanvas
                                id={id}
                                strawType={strawType}
                                CanvasSize={size}
                                imgSrc={imgSrc}
                                background={background}
                                fillColor={fillColor}
                                toolType={toolType}
                                fontStyle={fontStyle}
                                shapeType={shapeType}
                                shapeOutlineType={shapeOutlineType}
                                mainColor={mainColor}
                                subColor={subColor}
                                lineSize={lineSize}
                                lineWidthType={lineWidthType}
                                setColor={setColor}
                              />
                            ) : (
                              <Canvas
                                id={id}
                                strawType={strawType}
                                CanvasSize={size}
                                imgSrc={imgSrc}
                                background={background}
                                fillColor={fillColor}
                                toolType={toolType}
                                fontStyle={fontStyle}
                                shapeType={shapeType}
                                shapeOutlineType={shapeOutlineType}
                                mainColor={mainColor}
                                subColor={subColor}
                                lineSize={lineSize}
                                lineWidthType={lineWidthType}
                                setColor={setColor}
                              />
                            )}
                          </div>
                        )}
                        <div className="show-type">
                          <Right
                            toolType={toolType}
                            ThumbSrc={Thumbnail}
                            lineSize={lineSize}
                            maxSize={Math.floor(size.width / 10)}
                          />
                        </div>
                      </div>
                    </div>
                  </TextContext.Provider>
                </FillContext.Provider>
              </ColorContext.Provider>
            </DispatcherContext.Provider>
          </LineWidthContext.Provider>
        </ShapeOutlineContext.Provider>
      </ShapeTypeContext.Provider>
    </ToolTypeContext.Provider>
  );
}

export default Paint;