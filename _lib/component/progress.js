import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Progress } from "antd";

const Component = {
    default: (props) => {
        return (
            <>
                <Progress className={`dds progress ${props.class ? props.className : ""}`} {...props}>
                    {props.children}
                </Progress>
            </>
        );
    },
};
export default Component;
