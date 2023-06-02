import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Avatar, Badge } from "antd-mobile";
import DDS_Icons from "../../_lib/component/icons";

const Component = {
    default: (props) => {
        return (
            <div className={`dds profile ${props.className}`}>
                <Avatar {...props}></Avatar>
                <DDS_Icons.badgeCrown className="cert" />
            </div>
        );
    },
};
export default Component;
