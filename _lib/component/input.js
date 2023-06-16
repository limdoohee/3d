import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Input } from "antd";

const { TextArea } = Input;

const Component = {
    default: (props) => {
        return (
            <>
                <Input {...props} />
            </>
        );
    },
    textarea: (props) => {
        return (
            <>
                <TextArea {...props} />
            </>
        );
    },
};
export default Component;
