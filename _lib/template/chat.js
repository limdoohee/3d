import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Component
import ChatComponent from "../component/chat";
import DDS_Input from "../../_lib/component/input";
import DDS_Icons from "../../_lib/component/icons";
import DDS_Profile from "../../_lib/component/profile";
import DDS_Button from "../../_lib/component/button";
import DDS from "../../_lib/component/dds";
import { Drawer, Spin } from "antd";
//------------------------------------------------------------------------------- Component

const Home = {
    open: observer((props) => {
        const router = useRouter();
        const { common, lang, chat } = props.store;

        useEffect(() => {
            if (common.ui.chatOpen === true) {
                chat.joinChat({ name: "JISUN", id: "JISUN", url: "sendbird_open_channel_10510_f7b58093d862c9af9af0f9499049cfd7e1469d5e" });
            } else {
                chat.disconnect();
            }
        }, [common.ui.chatOpen]);

        useEffect(() => {
            return () => {
                onClose();
            };
        }, [router.asPath]);

        const onClose = () => {
            common.uiChange("chatOpen", false);
            setloading(false);
        };

        const [loading, setloading] = useState(false);

        useEffect(() => {
            if (chat.state.currentlyJoinedChannel && chat.sb && !chat.state.loading) {
                setTimeout(() => {
                    setloading(true);
                }, 500);
            }
        }, [chat.state.currentlyJoinedChannel]);

        return (
            <>
                <Drawer className={"dds chat-drawer"} placement="right" onClose={onClose} open={common.ui.chatOpen} closable={false}>
                    <div className="dk chat">
                        <div className="title">
                            <div className="owner">
                                <DDS_Button.default className="dds button none" icon={<DDS_Icons.angleLeft />} onClick={onClose} />
                                <DDS_Profile.default src={""} dot={"dot"} />
                                <span className="name">
                                    <strong>
                                        이상욱 <DDS_Icons.badgeCheck />
                                    </strong>
                                    {/* <small>현재 활동 중</small> */}
                                </span>
                            </div>
                            <div className="operators">
                                <DDS_Icons.user className="dds icons small" />
                                {chat.state.currentlyJoinedChannelOperators.length}
                            </div>
                        </div>
                        {loading ? (
                            <>
                                {/* <h1>{chat.state.currentlyJoinedChannel.name}</h1> */}
                                <ChatComponent.MessagePrint store={props.store} messages={chat.state.messages} myId={chat.state.userIdInputValue} loadMessagesPrev={chat.loadMessagesPrev.open} />
                                <ChatComponent.MessageInput chat={chat} value={chat.state.messageInputValue} sendMessage={chat.sendMessage.open} fileSelected={chat.state.file} />
                                {chat.state.uploadLoading == true && (
                                    <div className="upload-loading">
                                        <Spin />
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="loading">
                                    <Spin />
                                    <div>Chat Loading....</div>
                                </div>
                            </>
                        )}
                    </div>
                </Drawer>
            </>
        );
    }),
    page: observer((props) => {
        const router = useRouter();
        const { common, lang, chat, auth } = props.store;

        const langSet = {
            now: lang.t("chat.now"),
            format: lang.t("chat.format"),
            info1: lang.t("chat.info1"),
            info2: lang.t("chat.info2"),
            info3: lang.t("chat.info3"),
            info4: lang.t("chat.info4"),
            info5: lang.t("chat.info5"),
            info6: lang.t("chat.info6"),
            info7: lang.t("chat.info7"),
        };

        //------------------------------------------------- Init Load
        const initLoad = ({ initCheck, callback }) => {
            switch (process.env.STAGE) {
                case "LOCAL":
                    var s = "mango";
                    break;
                case "DEVELOPMENT":
                    var s = "mango";
                    break;
                case "STAGING":
                    var s = "plum";
                    break;
                case "PRODUCTION":
                    var s = "www";
                    break;
            }

            chat.joinChat({ name: auth.loginResult.nickname, id: `dropkitchen_${s}_member_${auth.loginResult.seq}`, url: Router.query.url });
        };
        //------------------------------------------------- Init Load

        //------------------------------------------------- Router isReady
        useEffect(() => {
            if (router.isReady && router.pathname == "/chat") {
                common.getBuildId();
                if (Router.query.url) {
                    initLoad({
                        callback: (e) => {},
                    });
                } else {
                    history.back();
                }
            }
            return () => {
                chat.disconnect();
            };
        }, [router.isReady, router.asPath]);
        //------------------------------------------------- Router isReady

        const onClose = () => {
            setOpen(true);
        };

        const [loading, setloading] = useState(false);

        useEffect(() => {
            if (chat.state.currentlyJoinedChannel && chat.sb && !chat.state.loading) {
                setTimeout(() => {
                    setloading(true);
                }, 500);
            }
        }, [chat.state.currentlyJoinedChannel]);

        const [open, setOpen] = useState(false);
        const modalData = {
            open: open,
            setOpen: setOpen,
            title: langSet.info4,
            context: langSet.info5,
            confirm: {
                label: langSet.info6,
                action: () => {
                    if (router.query.from) {
                        location.href = router.query.from;
                    } else {
                        history.back();
                        chat.disconnect();
                    }
                },
            },
            cancel: {
                label: langSet.info7,
                action: () => {},
            },
        };

        useEffect(() => {
            console.log(chat.state.currentlyJoinedChannelOperators.length);
            common.debug(chat.state.currentlyJoinedChannelOperators);
        }, [chat.state.currentlyJoinedChannelOperators]);

        return (
            <>
                <div className="dk chat">
                    {loading ? (
                        <>
                            <div className="title">
                                <div className="owner">
                                    <DDS_Button.default className="dds button none" icon={<DDS_Icons.angleLeft />} onClick={onClose} />
                                    <DDS_Profile.default
                                        src={chat.state.currentlyJoinedChannel.coverUrl}
                                        // dot={"dot"}
                                    />
                                    <span className="name">
                                        <strong>
                                            <span className="t">{chat.state.currentlyJoinedChannel.name}</span>
                                            <DDS.chips.default className={"secondary small"}>ARTIST</DDS.chips.default>
                                        </strong>
                                        {/* <small>{langSet.now}</small> */}
                                    </span>
                                </div>
                                <div className="operators">
                                    <DDS_Icons.user className="dds icons small" />
                                    {chat.state.participantCount}
                                </div>
                            </div>
                            {/* <h1>{chat.state.currentlyJoinedChannel.name}</h1> */}
                            <ChatComponent.MessagePrint store={props.store} messages={chat.state.messages} myId={chat.state.userIdInputValue} loadMessagesPrev={chat.loadMessagesPrev.open} />
                            <ChatComponent.MessageInput chat={chat} value={chat.state.messageInputValue} sendMessage={chat.sendMessage.open} fileSelected={chat.state.file} />
                            {chat.state.uploadLoading == true && (
                                <div className="upload-loading">
                                    <Spin />
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="loading">
                                <Spin />
                                <div>Chat Loading....</div>
                            </div>
                        </>
                    )}
                    <DDS.modal.center {...modalData} />
                </div>
            </>
        );
    }),
};

export default Home;
