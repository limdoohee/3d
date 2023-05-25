import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Tabs } from "antd";

const Component = {
    default: (props) => {
        return (
            <>
                <Tabs {...props} />
            </>
        );
    },
};
export default Component;
