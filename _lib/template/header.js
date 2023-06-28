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
        const { title, back, right, left } = props;
        const { common, lang, auth } = props.store;

        return (
            <>
                <div className={`dk header ${props.className ? props.className : ""}`}>
                    <div>
                        {left ? (
                            <>{left}</>
                        ) : (
                            <DDS.button.default
                                className="dds button none"
                                icon={<DDS.icons.angleLeft />}
                                onClick={() => {
                                    if (router.query.from) {
                                        location.href = router.query.from;
                                    } else if (back) {
                                        back();
                                    } else {
                                        history.back();
                                    }
                                }}
                            />
                        )}
                    </div>
                    <h4>{title}</h4>
                    <div style={{ display: "flex", minWidth: right ? "unset" : "38px" }}>
                        {right &&
                            right.map((Item, key) => {
                                return <Item key={key} />;
                            })}
                    </div>
                </div>
            </>
        );
    }),
};

export default Home;
