import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Input } from "antd-mobile";

const Component = {
    default: (props) => {
        return (
            <>
                <Input {...props} />
            </>
        );
    },
};
export default Component;
