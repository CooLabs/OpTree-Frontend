import React, { FC } from "react";
import { useContext } from "react";
import { LineWidthContext } from "@/components/paint/context";
import IntegerStep from "../components/slider";
import ColorPanel from "../components/colorPanel";
import "./index.less";
import { Tool } from "../../util/tool";

interface PenType {
  lineSize: number;
}

const ShowPen = (props: PenType) => {
  const lineWidthContext = useContext(LineWidthContext);

  const { lineSize } = props;

  return (
    <div className="ccc-pen">
      <div className="ccc-slider-item">
        <h3>Brush Thickness</h3>
        <IntegerStep
          min={1}
          max={20}
          value={lineSize}
          onPropsChange={(value) => {
            lineWidthContext.setLineSize(value);
          }}
        />
      </div>
      <ColorPanel type="pen" className="toolbar-item" />
    </div>
  );
};

export default ShowPen;
