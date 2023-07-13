import _config from "next/config";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";

import { observer } from "mobx-react-lite";
import { makeAutoObservable, toJS, configure } from "mobx";
import { timestampToTime, handleEnterPress } from "../module/messageUtils";
import { animateScroll as scroll, Events, scrollSpy, scroller, Element } from "react-scroll";
import moment from "moment";

//------------------------------------------------------------------------------- Component
import DDS_Input from "../../_lib/component/input";
import DDS_Icons from "../../_lib/component/icons";
import DDS_Profile from "../../_lib/component/profile";
import DDS_Button from "../../_lib/component/button";
import DDS_Logos from "../../_lib/component/logos";
import DDS from "../../_lib/component/dds";
//------------------------------------------------------------------------------- Component

const home = {
    messageScrollDown: () => {
        setTimeout(() => {
            if (document.querySelector("#message-wrap")) {
                var v = document.querySelector("#message-wrap").scrollHeight;
                scroll.scrollTo(v, {
                    smooth: true,
                    duration: 0,
                    containerId: "message-wrap",
                });
            }
        }, 100);
    },
    MessageInput: ({ chat, value, sendMessage }) => {
        // Sendbird onMessageInputChange
        const onMessageInputChange = (e) => {
            chat.updateState({ ...chat.state, messageInputValue: e.target.value });
        };

        // Sendbird onFileInputChange
        const onFileInputChange = async (e) => {
            if (e.currentTarget.files && e.currentTarget.files.length > 0) {
                chat.updateState({ ...chat.state, uploadLoading: true });
                const fileMessageParams = {};
                fileMessageParams.file = e.currentTarget.files[0];

                console.log(e.currentTarget.files[0].type);
                var checkImage = e.currentTarget.files[0].type;
                checkImage = checkImage.indexOf("image");
                console.log(checkImage);
                if (checkImage === 0) {
                    chat.state.currentlyJoinedChannel
                        .sendFileMessage(fileMessageParams)
                        .onSucceeded((message) => {
                            const updatedMessages = [...chat.state.messages, message];
                            chat.updateState({ ...chat.state, messages: updatedMessages, messageInputValue: "", file: null, uploadLoading: false });
                            home.messageScrollDown();
                        })
                        .onFailed((error) => {
                            console.log(error);
                            console.log("failed");
                        });
                } else {
                    alert("이미지만 업로드 가능합니다.");
                }
            }
        };

        const onSend = async () => {
            if (chat.state.messageInputValue) {
                await sendMessage({
                    callback: () => {
                        console.log("sendMessage");
                        home.messageScrollDown();
                        chat.updateState({ ...chat.state, messageInputValue: "" });
                        chat.store.common.analysisSubmit({
                            component: "chat",
                            componentId: "send_message",
                            action: "click",
                        });
                    },
                });
            }
            // console.log("onSend", v);
        };

        return (
            <div className="message-input">
                <div className="upload">
                    <DDS_Icons.plus className="dds icons" />
                    <input id="upload" type="file" onChange={onFileInputChange} onClick={() => {}} accept="image/*" />
                </div>
                <DDS_Input.default
                    className="dds input secondary rounded"
                    suffix={<DDS_Icons.circleArrowUp className={`dds icons large ${chat.state.messageInputValue ? "" : "disabled"}`} onClick={onSend} />}
                    placeholder="Send message"
                    value={value}
                    onChange={onMessageInputChange}
                    onKeyDown={(event) => handleEnterPress(event, onSend)}
                />
                {/* <div className="message-input-buttons">
                    <button className="send-message-button" onClick={onSend}>
                        Send Message
                    </button>
                    <label className="file-upload-label" htmlFor="upload">
                        Select File
                    </label>
                </div> */}
            </div>
        );
    },
    MessagePrint: ({ store, messages, myId, loadMessagesPrev }) => {
        const { common, chat, lang } = store;
        const [more, setmore] = useState(true);

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
            info8: lang.t("chat.info8"),
            info9: lang.t("chat.info9"),
        };

        useEffect(() => {
            home.messageScrollDown();
        }, [common.ui.chatOpen == true]);

        const clickProfile = (sender) => {
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

            location.href = `/userGallery/?memberSeq=${sender.userId.replace(`dropkitchen_${s}_member_`, "")}`;
        };

        const [bottomDown, setbottomDown] = useState(false);
        useEffect(() => {
            var element = document.querySelector("#message-wrap");

            // var hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
            // if (hasVerticalScrollbar) {
            //     // 세로 스크롤바가 있는 경우
            //     console.log("세로 스크롤바가 있습니다.");
            // } else {
            //     // 세로 스크롤바가 없는 경우
            //     console.log("세로 스크롤바가 없습니다.");
            // }

            element.addEventListener(
                "scroll",
                (e) => {
                    var hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
                    console.log(hasVerticalScrollbar, element.scrollHeight, element.scrollTop + element.clientHeight);
                    if (hasVerticalScrollbar && element.scrollHeight - element.scrollTop - element.clientHeight > 50) {
                        setbottomDown(true);
                    } else {
                        setbottomDown(false);
                    }
                },
                false,
            );
        }, [messages]);

        const [open, setOpen] = useState(false);
        const [imageUrl, setimageUrl] = useState("");
        const modalData = {
            open: open,
            setOpen: setOpen,
            img: imageUrl,
        };

        const [openGallery, setopenGallery] = useState(false);
        const modalGallery = {
            open: openGallery,
            setOpen: setopenGallery,
            title: langSet.info8,
            // context: langSet.info5,
            confirm: {
                label: langSet.info9,
                action: () => {
                    clickProfile(sender);
                },
            },
            cancel: {
                label: langSet.info7,
                action: () => {},
            },
        };
        const [sender, setsender] = useState();

        return (
            <div className="message-wrap" id="message-wrap">
                {bottomDown && (
                    <div className="bottom-down">
                        <DDS_Button.default
                            className={"dds button primary rounded"}
                            icon={<DDS_Icons.angleDown />}
                            onClick={() => {
                                home.messageScrollDown();
                            }}
                        />
                    </div>
                )}
                <div className="more">
                    <h6>
                        {langSet.info1}
                        <br />
                        {langSet.info2}
                        <br />
                        {langSet.info3}
                    </h6>
                    {more && (
                        <DDS_Button.default
                            className="dds button secondary"
                            onClick={() => {
                                loadMessagesPrev({
                                    callback: (e) => {
                                        setmore(e);
                                    },
                                });
                            }}
                        >
                            이전 대화 보기
                        </DDS_Button.default>
                    )}
                    <p>{moment(messages[0] && messages[0].createdAt).format(langSet.format)}</p>
                </div>
                <ul className="messages">
                    {messages.map((item, key) => {
                        var dateCheck = false;
                        if (key > 0) {
                            if (moment(item.createdAt).format("DD") !== moment(messages[key - 1].createdAt).format("DD")) {
                                var dateCheck = true;
                            }
                        }

                        return (
                            <React.Fragment key={key}>
                                {dateCheck && <li className="date">{moment(item.createdAt).format("YYYY. MM. DD.")}</li>}
                                {item.sender ? (
                                    <li className={item.sender.userId == myId ? "my" : null}>
                                        {item.sender.userId !== myId && (
                                            <DDS_Profile.default
                                                src={item.sender.plainProfileUrl ? item.sender.plainProfileUrl : "https://asset.dropkitchen.xyz/contents/202306_dev/20230628174629865_dk.webp"}
                                                onClick={() => {
                                                    setsender(item.sender);
                                                    setopenGallery(true);
                                                }}
                                            />
                                        )}
                                        <div className="content">
                                            {item.sender.userId !== myId && <div className="name">{item.sender.nickname}</div>}
                                            <div className="inner">
                                                {item.messageType == "user" && <div className="message">{item.message}</div>}
                                                {item.messageType == "file" && (
                                                    <div
                                                        className="message image"
                                                        onClick={() => {
                                                            setOpen(true);
                                                            setimageUrl(item.url);
                                                        }}
                                                    >
                                                        {/*  */}
                                                        {/* {item.type == "image/jpeg" || item.type == "image/png" ? <img src={`${item.url}`} /> : null} */}
                                                        <img src={`${item.url}`} />
                                                    </div>
                                                )}
                                                <div className="date">{moment(item.createdAt).format("A HH:mm")}</div>
                                            </div>
                                        </div>
                                    </li>
                                ) : (
                                    <li className={"admin"}>
                                        <DDS_Logos.circle className={"small"} />
                                        <div className="content">
                                            <div className="inner">
                                                {item.messageType == "admin" && <div className="message">{item.message}</div>}
                                                {item.messageType == "file" && (
                                                    <div
                                                        className="message image"
                                                        onClick={() => {
                                                            setOpen(true);
                                                            setimageUrl(item.url);
                                                        }}
                                                    >
                                                        {/*  */}
                                                        {/* {item.type == "image/jpeg" || item.type == "image/png" ? <img src={`${item.url}`} /> : null} */}
                                                        <img src={`${item.url}`} />
                                                    </div>
                                                )}
                                                <div className="date">{moment(item.createdAt).format("A HH:mm")}</div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                            </React.Fragment>
                        );
                    })}
                </ul>
                <DDS.modal.image {...modalData} />
                <DDS.modal.center {...modalGallery} />
            </div>
        );
    },
};

export default home;
