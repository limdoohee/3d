import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Button, Tooltip, Space, Dropdown } from "antd";

const Component = {
    default: (props) => {
        return (
            <>
                <Button {...props}>{props.children}</Button>
            </>
        );
    },
    tooltip: (props) => {
        return (
            <>
                <Tooltip title={props.title}>
                    <Button {...props}>{props.children}</Button>
                </Tooltip>
            </>
        );
    },
    loading: (props) => {
        const [loading, setloading] = useState(false);
        return (
            <>
                <Button
                    {...props}
                    loading={loading}
                    onClick={async () => {
                        await setloading(true);
                        await props.onClick({ loading, setloading });
                    }}
                >
                    {props.children}
                </Button>
            </>
        );
    },
    dropdown: (props) => {
        const onMenuClick = props.onMenuClick;
        const [loading, setloading] = useState(false);
        var data = {};
        for (const key in props) {
            if (key !== "onMenuClick") {
                data[key] = props[key];
            }
        }

        return (
            <>
                <Dropdown.Button {...data} menu={{ items: props.items, onClick: onMenuClick }}>
                    {props.children}
                </Dropdown.Button>
            </>
        );
    },
};
export default Component;
