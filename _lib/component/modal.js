import React, { useEffect, useState } from "react";
import { Drawer } from "antd";
import DDS_Button from "./button";
import Link from "next/link";

const Component = (props) => {
    const { open, setOpen } = props;
    const onClose = () => {
        setOpen(false);
    };

    return (
        <Drawer placement="bottom" closable={false} onClose={onClose} open={open} height="bottom" className="bottomModal">
            {props.img && (
                <div className="imgWrapper">
                    <img src={props.img} />
                </div>
            )}
            <h1 className="title">{props.title}</h1>
            <h3 className="context">{props.context}</h3>
            <DDS_Button.default className="dds button primary large">
                <Link href={props.linkUrl}>{props.button}</Link>
            </DDS_Button.default>
            <DDS_Button.default className="dds button text" onClick={onClose}>
                나중에
            </DDS_Button.default>
        </Drawer>
    );
};

export default Component;
