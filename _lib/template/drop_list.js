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
            invite: { title: lang.t(`dropList.invite.title`), desc: lang.t(`dropList.invite.desc`), give: lang.t(`dropList.invite.give`) },
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
            img: "https://asset.dropkitchen.xyz/contents/202307_dev/20230703164613868_dk.webp",
            title: dropListLangSet.invite.title,
            context: dropListLangSet.invite.desc,
            subContext: "(" + lang.t("gallery.modal.subContext") + ")",
            confirm: {
                label: dropListLangSet.invite.give,
                action: () => {
                    common.analysisSubmit({
                        component: "button",
                        componentId: "invite_complete",
                        action: "click",
                    });
                    setshareModal(false);
                    common.onShare({
                        url: auth.loginResult.inviteLink,
                    });
                },
            },
            cancel: {
                label: lang.t("gallery.modal.close"),
                action: () => {
                    common.analysisSubmit({
                        component: "button",
                        componentId: "invite_cancel",
                        action: "click",
                    });
                },
            },
        };

        return (
            <>
                <div className="dk drop-list">
                    <div
                        className="collection"
                        onClick={() => {
                            common.analysisSubmit({
                                component: "button",
                                componentId: "dropList_gallery",
                                action: "click",
                            });
                            location.href = "/userGallery?memberSeq=" + auth.loginResult.seq;
                        }}
                    >
                        <div className="plate">
                            <span>
                                <DDS.icons.drop />
                                {dropListLangSet.myCollection}
                            </span>
                            <span>
                                <strong>{drop.data.dropList.myDropCnt}</strong>/30
                            </span>
                        </div>
                        <div className="progress">
                            <DDS.progress.default percent={(100 / 30) * drop.data.dropList.myDropCnt} showInfo={false} />
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
                                                common.analysisSubmit({
                                                    component: "button",
                                                    componentId: "dropList_detail",
                                                    action: "click",
                                                });
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
                                                            common.analysisSubmit({
                                                                component: "button",
                                                                componentId: "dropList_invite",
                                                                action: "click",
                                                            });
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
                                                                common.analysisSubmit({
                                                                    component: "button",
                                                                    componentId: "dropList_main",
                                                                    action: "click",
                                                                });
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
                                                                    common.analysisSubmit({
                                                                        component: "button",
                                                                        componentId: "dropList_luckyBox",
                                                                        action: "click",
                                                                    });
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
