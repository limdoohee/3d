import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Avatar, Badge } from "antd";
import DDS_Icons from "../../_lib/component/icons";

const Component = {
    default: (props) => {
        return (
            <div className={`dds profile ${props.className}`}>
                {/* <Badge count={<DDS_Icons.badgeCrown className="cert" />}> */}
                <Badge dot={props.dot ? props.dot : false}>
                    <Avatar {...props}></Avatar>
                </Badge>
            </div>
        );
    },
};
export default Component;
