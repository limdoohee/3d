import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Checkbox } from "antd";
import DDS from "./dds";

const Component = {
    default: (props) => {
        const { className, onChange } = props;

        var setting = {};
        for (const key in props) {
            if (key !== "className") {
                setting[key] = props[key];
            }
        }

        const [checked, setchecked] = useState(props.checked);

        useEffect(() => {
            setchecked(setting.checked);
        }, [setting.checked]);

        return (
            <>
                <span className={`dds checkbox ${className}`}>
                    {checked ? <DDS.icons.check className={"checked"} /> : <DDS.icons.checkEmpty />}
                    <Checkbox
                        {...setting}
                        onChange={(e) => {
                            setchecked(e.target.checked);
                            onChange && onChange(e.target.checked);
                        }}
                    >
                        {props.children}
                    </Checkbox>
                </span>
            </>
        );
    },
};
export default Component;
