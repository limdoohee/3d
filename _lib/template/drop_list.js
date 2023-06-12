import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Component
import { Drawer } from "antd";
import DDS from "../../_lib/component/dds";
//------------------------------------------------------------------------------- Component

const Home = {
    default: observer((props) => {
        const router = useRouter();
        const { common, lang, alarm } = props.store;

        const [tabKey, settabKey] = useState(0);

        useEffect(() => {
            if (common.ui.alarmOpen === true) {
                //
            } else {
                //
            }
        }, [common.ui.chatOpen]);

        useEffect(() => {
            return () => {
                onClose();
            };
        }, [router.asPath]);

        const onClose = () => {
            common.uiChange("dropListOpen", false);
        };

        const [open, setOpen] = useState(false);

        const modalData = {
            open: open,
            setOpen: setOpen,
            title: "현재 드롭이 진행중이에요.",
            context: "메인에서 드롭을 받을 수 있어요. 메인으로 이동해볼까요?",
            confirm: {
                label: "드롭 받으러 가기",
                action: () => {
                    // Router.push("/gallery");
                },
            },
            cancel: {
                label: "나중에",
                action: () => {},
            },
        };

        return (
            <>
                <Drawer className={"dds drawer"} placement="right" onClose={onClose} open={common.ui.dropListOpen} closable={false}>
                    <div className="dk drop-list">
                        <div className="title">
                            <div>
                                <DDS.button.default className="dds button none" icon={<DDS.icons.angleLeft />} onClick={onClose} />
                            </div>
                            <h4>{lang.t("dropList.title")}</h4>
                            <div></div>
                        </div>
                        <div className="collection">
                            <div className="plate">
                                <span>
                                    <DDS.icons.drop />
                                    My Collection
                                </span>
                                <span>
                                    <strong>2</strong>/4
                                </span>
                            </div>
                            <div className="progress">
                                <DDS.progress.default percent={50} showInfo={false} />
                            </div>
                        </div>
                        <ul className="list">
                            <li>
                                <div className="left">
                                    <div className="image">
                                        <img src="" />
                                        <span className="label now">NOW</span>
                                    </div>
                                    <div className="name">
                                        <h4>Drop #4</h4>
                                        <p>???</p>
                                    </div>
                                </div>
                                <div className="right">
                                    <DDS.chips.default className={"primary"}>보유</DDS.chips.default>
                                    <DDS.icons.envelopeOpenHeart />
                                </div>
                            </li>
                            <li>
                                <div className="left">
                                    <div className="image">
                                        <img src="" />
                                        <span className="label now">NOW</span>
                                    </div>
                                    <div className="name">
                                        <h4>Drop #4</h4>
                                        <p>???</p>
                                    </div>
                                </div>
                                <div className="right">
                                    <DDS.chips.default className={"secondary"}>미보유</DDS.chips.default>
                                    <DDS.icons.cubePlus />
                                </div>
                            </li>
                        </ul>
                        <div className="bottom">
                            <DDS.button.default
                                className="dds button primary large block"
                                onClick={() => {
                                    setOpen(true);
                                }}
                            >
                                미보유 드롭 받으러 가기
                            </DDS.button.default>
                        </div>
                    </div>
                    <DDS.modal.bottom {...modalData} />
                </Drawer>
            </>
        );
    }),
};

export default Home;
