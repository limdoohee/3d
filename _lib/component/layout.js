import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { Layout, Space } from "antd";
import { motion } from "framer-motion";

const { Content } = Layout;

const Component = {
    container: (props) => {
        return (
            <motion.div
                initial={{ x: 100, opacity: 0, duration: 300 }}
                animate={{ x: 0, opacity: 1, duration: 300 }}
                exit={{ x: 100, opacity: 0, duration: 300 }}
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
};
export default Component;
