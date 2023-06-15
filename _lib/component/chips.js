import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Button, Tooltip, Space, Dropdown } from "antd";

const Component = {
    default: (props) => {
        return (
            <>
                <span className={`dds chips ${props.className}`}>{props.children}</span>
            </>
        );
    },
};
export default Component;
