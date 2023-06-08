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
import DDS_Icons from "../../_lib/component/icons";
import DDS_Button from "../../_lib/component/button";
import DDS_Logos from "../../_lib/component/logos";
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
            common.uiChange("alarmOpen", false);
        };

        return (
            <>
                <Drawer className={"dds drawer"} placement="right" onClose={onClose} open={common.ui.alarmOpen} closable={false}>
                    <div className="dk alarm">
                        <div className="title">
                            <div>
                                <DDS_Button.default className="dds button none" icon={<DDS_Icons.angleLeft />} onClick={onClose} />
                            </div>
                            <h4>{lang.t("alarm.title")}</h4>
                            <div></div>
                        </div>
                        <ul className="alarm-list">
                            <li className="active">
                                <div className="mark">
                                    <DDS_Logos.circle />
                                </div>
                                <div className="content">
                                    <h4>
                                        <strong>드롭예정</strong>
                                        <span>1초 전</span>
                                    </h4>
                                    <p>드롭 상품 오픈이 30분 남았어요. 이번 기회를 놓치면 다시는 구하지 못하는 작품이에요.</p>
                                </div>
                            </li>
                            <li>
                                <div className="mark">
                                    <DDS_Logos.circle />
                                </div>
                                <div className="content">
                                    <h4>
                                        <strong>드롭 30개 획득 ✨</strong>
                                        <span>1초 전</span>
                                    </h4>
                                    <p>드롭 상품 오픈이 30분 남았어요. 이번 기회를 놓치면 다시는 구하지 못하는 작품이에요.</p>
                                </div>
                            </li>
                            <li>
                                <div className="mark">
                                    <DDS_Logos.circle />
                                </div>
                                <div className="content">
                                    <h4>
                                        <strong>드롭 획득 ✨</strong>
                                        <span>1초 전</span>
                                    </h4>
                                    <p>드롭 상품 오픈이 30분 남았어요. 이번 기회를 놓치면 다시는 구하지 못하는 작품이에요.</p>
                                </div>
                            </li>
                            <li>
                                <div className="mark">
                                    <DDS_Logos.circle />
                                </div>
                                <div className="content">
                                    <h4>
                                        <strong>포인트 지급 🥳</strong>
                                        <span>1초 전</span>
                                    </h4>
                                    <p>드롭 상품 오픈이 30분 남았어요. 이번 기회를 놓치면 다시는 구하지 못하는 작품이에요.</p>
                                </div>
                            </li>
                            <li>
                                <div className="mark">
                                    <DDS_Logos.circle />
                                </div>
                                <div className="content">
                                    <h4>
                                        <strong>회원가입 완료 ! 🎉</strong>
                                        <span>1초 전</span>
                                    </h4>
                                    <p>드롭 상품 오픈이 30분 남았어요. 이번 기회를 놓치면 다시는 구하지 못하는 작품이에요.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </Drawer>
            </>
        );
    }),
};

export default Home;
