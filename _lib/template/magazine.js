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
        const { common, lang, magazine } = props.store;

        const [tabKey, settabKey] = useState(0);

        useEffect(() => {
            if (common.ui.magazineOpen === true) {
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
            common.uiChange("magazineOpen", false);
        };

        return (
            <>
                <Drawer className={"dds drawer"} placement="right" onClose={onClose} open={common.ui.magazineOpen} closable={false}>
                    <div className="dk magazine">
                        <div className="title">
                            <div>
                                <DDS_Button.default className="dds button none" icon={<DDS_Icons.angleLeft />} onClick={onClose} />
                            </div>
                            <h4>{lang.t("magazine.title")}</h4>
                            <div></div>
                        </div>
                    </div>
                </Drawer>
            </>
        );
    }),
};

export default Home;
