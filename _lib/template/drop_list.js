import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef, use } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
//------------------------------------------------------------------------------- Component

const Home = {
    default: observer((props) => {
        const router = useRouter();
        const { common, lang, drop, auth } = props.store;

        const dropListLangSet = {
            title: lang.t(`dropList.title`),
            myCollection: lang.t(`dropList.myCollection`),
            go: lang.t(`dropList.go`),
            collected: lang.t(`dropList.collected`),
            collect: lang.t(`dropList.collect`),
            invite: { title: lang.t(`dropList.invite.desc`), desc: lang.t(`dropList.invite.desc`), give: lang.t(`dropList.invite.give`) },
            empty: lang.t(`dropList.empty`),
        };

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
        const [shareModal, setshareModal] = useState(false);

        // const modalData = {
        //     open: open,
        //     setOpen: setOpen,
        //     title: "현재 드롭이 진행중이에요.",
        //     context: "메인에서 드롭을 받을 수 있어요. 메인으로 이동해볼까요?",
        //     confirm: {
        //         label: "드롭 받으러 가기",
        //         action: () => {
        //         },
        //     },
        //     cancel: {
        //         label: "나중에",
        //         action: () => {},
        //     },
        // };

        const shareModalData = {
            open: shareModal,
            setOpen: setshareModal,
            title: (
                <>
                    <div style={{ textAlign: "center", margin: "0 0 20px 0" }}>
                        <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230628110209194_dk.webp" style={{ width: 120, height: 120 }} />
                    </div>
                    {dropListLangSet.invite.title}
                </>
            ),
            context: <>{dropListLangSet.invite.desc}</>,
            confirm: {
                label: dropListLangSet.invite.give,
                action: () => {
                    setshareModal(false);
                    common.onShare({
                        url: auth.loginResult.inviteLink,
                    });
                },
            },
            // cancel: {
            //     label: "나중에",
            //     action: () => {},
            // },
        };

        return (
            <>
                <div className="dk drop-list">
                    <div className="collection">
                        <div className="plate">
                            <span>
                                <DDS.icons.drop />
                                {dropListLangSet.myCollection}
                            </span>
                            <span>
                                <strong>{drop.data.dropList.myDropCnt}</strong>/{drop.data.dropList.totalDropCnt}
                            </span>
                        </div>
                        <div className="progress">
                            <DDS.progress.default percent={(100 / drop.data.dropList.totalDropCnt) * drop.data.dropList.myDropCnt} showInfo={false} />
                        </div>
                    </div>
                    <ul className={`list ${drop.data.dropList.totalDropCnt === 0 ? "empty" : ""}`}>
                        {drop.data.dropList.totalDropCnt === 0 ? (
                            <li>{dropListLangSet.empty}</li>
                        ) : (
                            drop.data.dropList.dropList.map((item, key) => {
                                return (
                                    <li key={key}>
                                        <div
                                            className="left"
                                            onClick={() => {
                                                window.location.href = "native://drop_detail?dropSeq=" + item.dropSeq;
                                            }}
                                        >
                                            <div className="image">
                                                <img src={item.dropOwnFlag ? item.thumbnailUrl : "https://asset.dropkitchen.xyz/contents/202306_dev/20230629112650847_dk.webp"} alt={item.artName} />
                                                {item.status == "processing" && <span className="label now">NOW</span>}
                                            </div>
                                            <div className="name">
                                                <h4>Art Drop #{item.dropSeq}</h4>
                                                {((item.status === "processing" && item.dropOwnFlag) || item.status === "closed") && <p>{item.artName}</p>}
                                            </div>
                                        </div>
                                        <div className="right">
                                            {item.dropOwnFlag ? (
                                                <>
                                                    <DDS.chips.default className={"primary"}>{dropListLangSet.collected}</DDS.chips.default>
                                                    <DDS.icons.paperPlanePlus
                                                        onClick={() => {
                                                            setshareModal(true);
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    {item.status == "processing" ? (
                                                        <DDS.button.default
                                                            className="dds button small go"
                                                            onClick={() => {
                                                                window.location.href = "/main";
                                                            }}
                                                        >
                                                            {dropListLangSet.go}
                                                        </DDS.button.default>
                                                    ) : (
                                                        <>
                                                            <DDS.chips.default className={"secondary"}>{dropListLangSet.collect}</DDS.chips.default>
                                                            <DDS.icons.cubePlus
                                                                onClick={() => {
                                                                    window.location.href = "/random";
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                    {/* <div className="bottom">
                        <DDS.button.default
                            className="dds button primary large block"
                            onClick={() => {
                                setOpen(true);
                            }}
                        >
                            미보유 드롭 받으러 가기
                        </DDS.button.default>
                    </div> */}
                </div>
                {/* <DDS.modal.bottom {...modalData} /> */}
                <DDS.modal.bottom {...shareModalData} />
            </>
        );
    }),
};

export default Home;
