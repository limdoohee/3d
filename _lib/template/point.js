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
import DDS_Tabs from "../../_lib/component/tabs";
//------------------------------------------------------------------------------- Component

const Home = {
    default: observer((props) => {
        const router = useRouter();
        const { common, lang, point } = props.store;

        const [tabKey, settabKey] = useState(0);

        useEffect(() => {
            if (common.ui.pointOpen === true) {
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
            common.uiChange("pointOpen", false);
        };

        const items = [
            {
                key: 0,
                label: lang.t("point.tabs.all"),
                children: <PointList />,
            },
            {
                key: 1,
                label: lang.t("point.tabs.accumulate"),
                children: <PointList />,
            },
            {
                key: 2,
                label: lang.t("point.tabs.use"),
                children: <PointList />,
            },
        ];

        const onChange = (e) => {
            console.log(e);
            settabKey(e);
        };

        return (
            <>
                <Drawer className={"dds point-drawer"} placement="right" onClose={onClose} open={common.ui.pointOpen} closable={false}>
                    <div className="dk point">
                        <div className="title">
                            <div>
                                <DDS_Button.default className="dds button none" icon={<DDS_Icons.angleLeft />} onClick={onClose} />
                            </div>
                            <h4>{lang.t("point.title")}</h4>
                            <div>
                                <DDS_Button.default className="dds button none">{lang.t("point.information")}</DDS_Button.default>
                            </div>
                        </div>
                        <div className="my-point">
                            <p>{lang.t("point.myPoints")}</p>
                            <h3>
                                <small>
                                    <DDS_Icons.point />
                                </small>
                                <strong>1,000</strong>
                            </h3>
                        </div>
                        <DDS_Tabs.default defaultActiveKey={tabKey === 0 ? "0" : tabKey} items={items} onChange={onChange} />
                    </div>
                </Drawer>
            </>
        );
    }),
};

export default Home;

const PointList = observer((props) => {
    return (
        <>
            <ul className="point-list">
                <li>
                    <div>
                        <strong>상품결제</strong>
                        <span>상품명</span>
                    </div>
                    <div>
                        <strong>-10,000</strong>
                        <span>2023.07.14</span>
                    </div>
                </li>
                <li>
                    <div>
                        <strong>상품결제</strong>
                        <span>상품명</span>
                    </div>
                    <div>
                        <strong>-10,000</strong>
                        <span>2023.07.14</span>
                    </div>
                </li>
                <li>
                    <div>
                        <strong>상품결제</strong>
                        <span>#1 THE DOH COINTHE DOH COINTHE DOH COIN #1 THE DOH COINTHE DOH COINTHE DOH COIN</span>
                    </div>
                    <div>
                        <strong className="plus">+10,000</strong>
                        <span>2023.07.14</span>
                    </div>
                </li>
            </ul>
        </>
    );
});
