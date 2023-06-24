import React from "react";
import { useContext } from "react";
import { FillContext } from "@/components/paint/context";
import "./index.less";
import ColorPanel from "../components/colorPanel";
interface FormatColor {
  className?: string;
}

const FormatColor: React.FC<FormatColor> = (props) => {
  const { className } = props;
  const FillColorContext:any = useContext(FillContext);

  return (
    <div className={className ? `formatColor ${className}` : `formatColor`}>
      <div className="color-box">
        <ColorPanel
          className="toolbar-item"
          onChange={(color: string) => {
            FillColorContext.setFillColor(color);
          }}
        />
      </div>
    </div>
  );
};

export default FormatColor;
