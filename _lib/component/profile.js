import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Avatar, Badge } from "antd";

const Component = {
    default: (props) => {
        return (
            <>
                <Badge count={props.badge ? props.badge : ""}>
                    <Avatar {...props} className={`dds profile ${props.className}`}>
                        {props.children}
                    </Avatar>
                </Badge>
            </>
        );
    },
};
export default Component;
