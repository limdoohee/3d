import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Switch } from "antd";

const Component = {
    default: (props) => {
        const { className } = props;
        delete props.className;

        return (
            <>
                <Switch {...props} className={`dds switch ${className}`} onChange={props.onChange} />
            </>
        );
    },
};
export default Component;
