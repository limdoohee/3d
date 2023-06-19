import Link from "next/link";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import Router, { useRouter } from "next/router";
import { Drawer, Badge } from "antd";
import { observer } from "mobx-react-lite";

import DDS_Button from "../component/button";
import DDS_Icons from "../component/icons";
import DDS_Profile from "../component/profile";
import menuData from "../menu";

const Component = {
    default: observer((props) => {
        const { store } = props;
        const { common } = store;
        const router = useRouter();

        const onClose = () => {
            common.uiChange("gnbOpen", false);
        };

        useEffect(() => {
            return () => {
                onClose();
            };
        }, [router.asPath]);

        return (
            <>
                <Drawer className={"dds gnb"} placement="right" onClose={onClose} open={common.ui.gnbOpen} closable={false}>
                    <div className="top">
                        {/* <DDS_Button.default className="dds button text">
                            <Badge dot>
                                <DDS_Icons.myGalleryBlackOn />
                            </Badge>
                        </DDS_Button.default>
                        <DDS_Button.default
                            className="dds button text"
                            onClick={() => {
                                router.push("/");
                            }}
                        >
                            <DDS_Icons.gear />
                        </DDS_Button.default> */}
                        <DDS_Button.default
                            className="dds button text"
                            onClick={() => {
                                Router.push("/");
                            }}
                        >
                            <DDS_Icons.house />
                        </DDS_Button.default>
                    </div>
                    <div className="personal">
                        <DDS_Profile.default badge={<DDS_Icons.badgeCrown className="cert" />} src="https://picsum.photos/id/237/200/300" />
                        <strong>abcdefghigklmnopqrstdsfsdfsdf</strong>
                    </div>
                    <div className="point">
                        <span>내 포인트</span>
                        <strong>
                            3000
                            <small>P</small>
                        </strong>
                    </div>
                    <nav>
                        <ul>
                            {menuData.gnb.map((Item, key) => (
                                <li key={key}>
                                    <Link href={Item.link}>
                                        <Item.icon />
                                        <span>{Item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </Drawer>
            </>
        );
    }),
};
export default Component;
