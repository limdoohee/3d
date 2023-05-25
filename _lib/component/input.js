import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Input } from "antd";

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
