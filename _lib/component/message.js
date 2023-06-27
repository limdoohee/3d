import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Router, { useRouter } from "next/router";
import { message } from "antd";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import DDS from "./dds";

const Component = forwardRef(function Component(props, ref) {
    console.log(props);
    const [messageApi, contextHolder] = message.useMessage();

    useImperativeHandle(
        ref,
        () => {
            return {
                open() {
                    messageApi.open({
                        key: props.key,
                        icon: props.icon,
                        content: props.content,
                        // duration: 100,
                        // message 컴포넌트는 body 바로 아래 element 이므록 고유한 className으로 작성할 것
                        className: `${props.className ? props.className : ""}`,
                    });
                },
            };
        },
        [],
    );

    return <>{contextHolder}</>;
});

export default Component;
