import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Tabs } from "antd-mobile";

const Component = {
    default: (props) => {
        const { items, defaultActiveKey } = props;
        return (
            <>
                <Tabs defaultActiveKey={defaultActiveKey} className={`dds tabs ${props.className}`}>
                    {items.map((item, key) => (
                        <Tabs.Tab title={item.label} key={key}>
                            {item.children}
                        </Tabs.Tab>
                    ))}
                </Tabs>
            </>
        );
    },
};
export default Component;
