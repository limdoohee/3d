import Link from "next/link";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import Router, { useRouter } from "next/router";
import { Drawer } from "antd";
import { observer } from "mobx-react-lite";

import DDS_Button from "../component/button";
import DDS_Icons from "../component/icons";
import DDS_Profile from "../component/profile";

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
                        <DDS_Button.default
                            className="dds button text"
                            onClick={() => {
                                router.push("/");
                            }}
                        >
                            <DDS_Icons.gear />
                        </DDS_Button.default>
                        <DDS_Button.default className="dds button text">
                            <DDS_Icons.house />
                        </DDS_Button.default>
                    </div>
                    <div className="personal">
                        <DDS_Profile.default badge={<DDS_Icons.badgeCrown className="cert" />} src="https://picsum.photos/id/237/200/300" />
                        <strong>장후롱</strong>
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
                            <li>
                                <Link href="">
                                    <DDS_Icons.crown />
                                    <span>Rank</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="">
                                    <DDS_Icons.storeFilled />
                                    <span>Drop list</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="">
                                    <DDS_Icons.bookFilled />
                                    <span>Magazine</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="">
                                    <DDS_Icons.circleQuestion />
                                    <span>FAQ</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="">
                                    <DDS_Icons.envelopeOpenTest />
                                    <span>Feedback</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </Drawer>
            </>
        );
    }),
};
export default Component;
