import { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Layout, Space } from "antd";
import { motion } from "framer-motion";

const { Content } = Layout;

const Component = {
    container: (props) => {
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
                className={`dds container ${props.className}`}
                {...props}
            >
                {props.children}
            </motion.div>
        );
    },
    // /////////////////////////////////////////////////////////////////////////////////////// Back
    back: (props) => {
        const router = useRouter();

        return (
            <div className="ui back">
                <h2 onClick={() => router.back()}>
                    <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230601154911889_dk.webp" />
                    {/* {title && <stron>{title}</stron>} */}
                </h2>
                {props.children}
            </div>
        );
    },
};
export default Component;
