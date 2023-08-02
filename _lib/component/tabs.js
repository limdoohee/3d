import React from "react";
import { Tabs } from "antd-mobile";

const Component = {
    default: (props) => {
        const { items, defaultActiveKey, onChange, dot } = props;
        return (
            <>
                <Tabs defaultActiveKey={defaultActiveKey} className={`dds tabs ${props.className} ${items.length < 5 ? "tabsPart" : ""}`} onChange={onChange}>
                    {items.map((item, key) => (
                        <Tabs.Tab title={item.label} key={key} className={`${key == dot ? "dot" : ""}`}>
                            {item.children && item.children}
                        </Tabs.Tab>
                    ))}
                </Tabs>
            </>
        );
    },
};
export default Component;
