import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Switch } from "antd";

const Component = {
    default: (props) => {
        const { className } = props;

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
                <Switch {...setting} className={`dds switch ${className}`} onChange={props.onChange} />
            </>
        );
    },
};
export default Component;
