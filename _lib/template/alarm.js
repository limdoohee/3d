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
import Module_date from "../../_lib/module/date";
import DDS from "../../_lib/component/dds";
//------------------------------------------------------------------------------- Component

const Home = {
    default: observer((props) => {
        const router = useRouter();
        const { common, lang, alarm } = props.store;

        //------------------------------------------------- Init Load
        const initLoad = ({ callback }) => {
            const params = {};
            alarm.pushHistory(params, (e) => {
                common.debug(e);
                callback && callback(e);
            });
        };
        //------------------------------------------------- Init Load

        //------------------------------------------------- Router isReady
        useEffect(() => {
            console.log(router.pathname);
            if (router.isReady && router.pathname == "/alarm") {
                common.getBuildId();
                initLoad({
                    callback: (e) => {},
                });
            }
        }, [router.isReady, router.asPath]);
        //------------------------------------------------- Router isReady

        const readPush = (item) => {
            const params = { pushSeq: item.seq };
            alarm.readPush(params, (e) => {
                initLoad({
                    callback: (e) => {
                        item.targetUrl && item.targetUrl !== null && item.targetUrl !== undefined ? (location.href = item.targetUrl) : "";

                        common.analysisSubmit({
                            component: "alarm",
                            componentId: "alarm_read",
                            action: "click",
                        });
                    },
                });
            });
        };

        return (
            <>
                <div className="dk alarm">
                    <ul className="alarm-list">
                        {alarm.data.pushHistory.push.map((item, key) => (
                            <li
                                className={item.readFlag == "N" ? "active" : ""}
                                key={key}
                                onClick={() => {
                                    readPush(item);
                                }}
                            >
                                <div className="mark">
                                    <DDS.logos.circle />
                                </div>
                                <div className="content">
                                    <h4>
                                        <strong>{item.title}</strong>
                                        <span>
                                            <Module_date.timeRemain.default time={item.createdAt} />
                                        </span>
                                    </h4>
                                    <p>{item.content}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        );
    }),
};

export default Home;
