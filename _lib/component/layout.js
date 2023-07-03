import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { motion } from "framer-motion";
import { message } from "antd";
//------------------------------------------------------------------------------- Component
import DDS_Icons from "../../_lib/component/icons";
//------------------------------------------------------------------------------- Component

const Component = {
    container: (props) => {
        const { className, children, store, pageMotion } = props;
        const { common } = store;
        const [messageApi, contextHolder] = message.useMessage();
        common.messageApiLoad(messageApi);

        return (
            <>
                {/* {pageMotion ? (
                    <motion.div
                        initial={{ x: 50, opacity: 0, duration: 300 }}
                        animate={{ x: 0, opacity: 1, duration: 300 }}
                        exit={{ x: 50, opacity: 0, duration: 300 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                        }}
                        className={`dds container ${className}`}
                    >
                        {contextHolder}
                        {children}
                    </motion.div>
                ) : (
                    <div
                        // initial={{ x: 50, opacity: 0, duration: 300 }}
                        // animate={{ x: 0, opacity: 1, duration: 300 }}
                        // exit={{ x: 50, opacity: 0, duration: 300 }}
                        // transition={{
                        //     type: "spring",
                        //     stiffness: 260,
                        //     damping: 20,
                        // }}
                        className={`dds container ${className}`}
                    >
                        {contextHolder}
                        {children}
                    </div>
                )} */}
                <div
                    // initial={{ x: 50, opacity: 0, duration: 300 }}
                    // animate={{ x: 0, opacity: 1, duration: 300 }}
                    // exit={{ x: 50, opacity: 0, duration: 300 }}
                    // transition={{
                    //     type: "spring",
                    //     stiffness: 260,
                    //     damping: 20,
                    // }}
                    className={`dds container ${className}`}
                >
                    {contextHolder}
                    {children}
                </div>
            </>
        );
    },
    // /////////////////////////////////////////////////////////////////////////////////////// Back
    back: (props) => {
        const router = useRouter();
        const { children, store, back } = props;
        const { common } = store;
        const [messageApi, contextHolder] = message.useMessage();
        common.messageApiLoad(messageApi);

        return (
            <div className="ui back">
                <h2
                    onClick={() => {
                        if (router.query.from) {
                            location.href = router.query.from;
                        } else if (back) {
                            back();
                        } else {
                            history.back();
                        }
                    }}
                >
                    <DDS_Icons.angleLeft className="dds icons" />
                </h2>
                {contextHolder}
                {children}
            </div>
        );
    },
    content: (props) => {
        const { className, children } = props;

        return (
            <>
                <div className={`dds content ${className}`}>{children}</div>
            </>
        );
    },
};

export default Component;
