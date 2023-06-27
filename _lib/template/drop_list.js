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
        const { common, lang, drop } = props.store;

        //------------------------------------------------- Init Load
        const initLoad = ({ initCheck, callback }) => {
            var params = {};
            drop.dropList(params, (e) => {
                common.debug(e);
                callback && callback(e);
            });
        };
        //------------------------------------------------- Init Load

        //------------------------------------------------- Router isReady
        useEffect(() => {
            if (router.isReady) {
                common.getBuildId();
                initLoad({
                    callback: (e) => {},
                });
            }
        }, [router.isReady, router.asPath]);
        //------------------------------------------------- Router isReady

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
                <div className="dk drop-list">
                    <div className="collection">
                        <div className="plate">
                            <span>
                                <DDS.icons.drop />
                                My Collection
                            </span>
                            <span>
                                <strong>{drop.data.dropList.myDropCnt}</strong>/{drop.data.dropList.totalDropCnt}
                            </span>
                        </div>
                        <div className="progress">
                            <DDS.progress.default percent={(100 / drop.data.dropList.totalDropCnt) * drop.data.dropList.myDropCnt} showInfo={false} />
                        </div>
                    </div>
                    <ul className="list">
                        {drop.data.dropList.dropList.map((item, key) => {
                            return (
                                <li key={key}>
                                    <div className="left">
                                        <div
                                            className="image"
                                            onClick={() => {
                                                window.location.href = "native://drop_detail?dropSeq=" + item.dropSeq;
                                            }}
                                        >
                                            <img src={item.thumbnailUrl} />
                                            {item.status == "processing" && <span className="label now">NOW</span>}
                                        </div>
                                        <div
                                            className="name"
                                            onClick={() => {
                                                window.location.href = "native://drop_detail?dropSeq=" + item.dropSeq;
                                            }}
                                        >
                                            <h4>{item.dropRound}</h4>
                                            <p>{item.artName}</p>
                                        </div>
                                    </div>
                                    <div className="right">
                                        {item.dropOwnFlag ? (
                                            <>
                                                <DDS.chips.default className={"primary"}>보유</DDS.chips.default>
                                                <DDS.icons.envelopeOpenHeart
                                                    onClick={() => {
                                                        common.onShare({
                                                            url: auth.loginResult.inviteLink,
                                                        });
                                                    }}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <DDS.chips.default className={"secondary"}>미보유</DDS.chips.default>
                                                <DDS.icons.cubePlus
                                                    onClick={() => {
                                                        Router.push("/random");
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
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
            </>
        );
    }),
};

export default Home;
