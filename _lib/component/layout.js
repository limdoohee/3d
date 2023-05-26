import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Layout, Space } from "antd";

const { Content } = Layout;

const Component = {
    container: (props) => {
        return (
            <Content className={`dds container ${props.className}`} {...props}>
                {props.children}
            </Content>
        );
    },
};
export default Component;
