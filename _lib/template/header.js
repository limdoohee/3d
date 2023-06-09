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
import DK_template_GNB from "../../_lib/template/gnb";
//------------------------------------------------------------------------------- Component

const Home = {
    default: observer((props) => {
        const router = useRouter();
        const { title, back } = props;
        const { common, lang, auth } = props.store;

        return (
            <>
                <div className="dk header">
                    <div>
                        <DDS.button.default
                            className="dds button none"
                            icon={<DDS.icons.angleLeft />}
                            onClick={() => {
                                back ? back() : Router.back();
                            }}
                        />
                    </div>
                    <h4>{title}</h4>
                    <div>
                        <DDS.button.default
                            className="dds button none"
                            icon={<DDS.icons.bars />}
                            onClick={() => {
                                common.uiChange("gnbOpen", true);
                            }}
                        />
                    </div>
                </div>
            </>
        );
    }),
};

export default Home;
