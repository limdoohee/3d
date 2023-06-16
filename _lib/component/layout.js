import { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { motion } from "framer-motion";
//------------------------------------------------------------------------------- Component
import DDS_Icons from "../../_lib/component/icons";
//------------------------------------------------------------------------------- Component

const Component = {
    container: (props) => {
        const { className, children } = props;

        return (
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
                {children}
            </motion.div>
        );
    },
    // /////////////////////////////////////////////////////////////////////////////////////// Back
    back: (props) => {
        const router = useRouter();

        return (
            <div className="ui back">
                <h2 onClick={() => (router.path === "signup/terms/" ? router.push("/") : router.back())}>
                    <DDS_Icons.angleLeft className="dds icons" />
                </h2>
                {props.children}
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
