import Link from "next/link";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import Router, { useRouter } from "next/router";
import { Drawer, Badge } from "antd";
import { observer } from "mobx-react-lite";

import DDS_Button from "../component/button";
import DDS_Icons from "../component/icons";
import DDS_Profile from "../component/profile";

const Component = {
    default: observer((props) => {
        const { store } = props;
        const { common, auth, lang } = store;
        const router = useRouter();

        const onClose = () => {
            common.uiChange("gnbOpen", false);
        };

        useEffect(() => {
            return () => {
                onClose();
            };
        }, [router.asPath]);

        const menuData = {
            gnb: [
                // { icon: () => <DDS_Icons.crown />, link: "", name: "Rank" },
                {
                    icon: () => <DDS_Icons.myGalleryBlackOn />,
                    link: `/userGallery/?memberSeq=${auth.loginResult.seq}`,
                    name: "My Gallery",
                    click: () => {
                        common.analysisSubmit({
                            component: "button",
                            componentId: "menu_my_gallery",
                            action: "click",
                        });
                    },
                },
                {
                    icon: () => <DDS_Icons.drop />,
                    link: "/drops",
                    name: "Art Drop list",
                    click: () => {
                        common.analysisSubmit({
                            component: "button",
                            componentId: "menu_drop_list",
                            action: "click",
                        });
                    },
                },
                {
                    icon: () => <DDS_Icons.bookFilled />,
                    link: "/magazine",
                    name: "Magazine",
                    click: () => {
                        common.analysisSubmit({
                            component: "button",
                            componentId: "menu_magazine",
                            action: "click",
                        });
                    },
                },
                {
                    icon: () => <DDS_Icons.gear />,
                    link: "/setting",
                    name: "Setting",
                    click: () => {
                        common.analysisSubmit({
                            component: "button",
                            componentId: "menu_setting",
                            action: "click",
                        });
                    },
                },
                // { icon: () => <DDS_Icons.envelopeOpenTest />, link: "", name: "Feedback" },
            ],
        };

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
                            }}
                        >
                            <DDS_Icons.gear />
                        </DDS_Button.default> */}
                        <DDS_Button.default
                            className="dds button text"
                            onClick={() => {
                                common.analysisSubmit({
                                    component: "button",
                                    componentId: "menu_home",
                                    action: "click",
                                });
                                location.href = "/";
                            }}
                        >
                            <DDS_Icons.house />
                        </DDS_Button.default>
                    </div>
                    <div
                        className="personal"
                        onClick={() => {
                            common.analysisSubmit({
                                component: "button",
                                componentId: "menu_my_gallery",
                                action: "click",
                            });
                            location.href = "/userGallery?memberSeq=" + auth.loginResult.seq;
                        }}
                    >
                        <DDS_Profile.default badge={<DDS_Icons.badgeCrown className="cert" />} src={auth.loginResult.profileImage ? auth.loginResult.profileImage : "https://asset.dropkitchen.xyz/contents/202306_dev/20230628174629865_dk.webp"} />
                        <strong>{auth.loginResult && auth.loginResult.nickname}</strong>
                    </div>
                    <div
                        className="point"
                        onClick={() => {
                            common.analysisSubmit({
                                component: "button",
                                componentId: "menu_my_point",
                                action: "click",
                            });
                            location.href = "/point";
                        }}
                    >
                        <span>{lang.t("gnb.point")}</span>
                        <strong>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6 11C7.32608 11 8.59785 10.4732 9.53553 9.53553C10.4732 8.59785 11 7.32608 11 6C11 4.67392 10.4732 3.40215 9.53553 2.46447C8.59785 1.52678 7.32608 1 6 1C4.67392 1 3.40215 1.52678 2.46447 2.46447C1.52678 3.40215 1 4.67392 1 6C1 7.32608 1.52678 8.59785 2.46447 9.53553C3.40215 10.4732 4.67392 11 6 11ZM4.59375 3.5H6.39062C7.38281 3.5 8.1875 4.30469 8.1875 5.29688C8.1875 6.28906 7.38281 7.09375 6.39062 7.09375H5.0625V8.03125C5.0625 8.29102 4.85352 8.5 4.59375 8.5C4.33398 8.5 4.125 8.29102 4.125 8.03125V6.625V3.96875C4.125 3.70898 4.33398 3.5 4.59375 3.5ZM6.39062 6.15625C6.86523 6.15625 7.25 5.77148 7.25 5.29688C7.25 4.82227 6.86523 4.4375 6.39062 4.4375H5.0625V6.15625H6.39062Z"
                                    fill="#FD6E24"
                                />
                            </svg>
                            {auth.loginResult && common.numberFormat(auth.loginResult.pointAmount)}
                        </strong>
                    </div>
                    <nav>
                        <ul>
                            {menuData.gnb.map((Item, key) => (
                                <li key={key} onClick={Item.click}>
                                    <a href={Item.link}>
                                        <Item.icon />
                                        <span>{Item.name}</span>
                                    </a>
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
