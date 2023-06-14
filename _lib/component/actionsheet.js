import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import DDS from "./dds";

const Component = {
    default: (props) => {
        const { open, items, active, change, onClose } = props;
        return (
            <>
                <div
                    className={`dds actionsheet ${open ? "on" : ""}`}
                    onClick={() => {
                        onClose();
                    }}
                >
                    <div className="inner">
                        <ul>
                            {items.map((item, key) => {
                                return (
                                    <li
                                        key={key}
                                        onClick={() => {
                                            if (active !== item.key) {
                                                change(item.key);
                                            }
                                        }}
                                    >
                                        <span>{item.label}</span> {item.key == active ? <DDS.icons.check /> : ""}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </>
        );
    },
};
export default Component;
