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
                const fileMessageParams = {};
                fileMessageParams.file = e.currentTarget.files[0];
                chat.state.currentlyJoinedChannel
                    .sendFileMessage(fileMessageParams)
                    .onSucceeded((message) => {
                        const updatedMessages = [...chat.state.messages, message];
                        chat.updateState({ ...chat.state, messages: updatedMessages, messageInputValue: "", file: null });
                        home.messageScrollDown();
                    })
                    .onFailed((error) => {
                        console.log(error);
                        console.log("failed");
                    });
            }
        };

        const onSend = async () => {
            await sendMessage({
                callback: () => {
                    console.log("sendMessage");
                    home.messageScrollDown();
                },
            });
            // console.log("onSend", v);
        };

        return (
            <div className="message-input">
                <div className="upload">
                    <DDS_Icons.plus className="dds icons large" />
                    <input id="upload" type="file" onChange={onFileInputChange} onClick={() => {}} />
                </div>
                <DDS_Input.default
                    className="dds input secondary rounded"
                    suffix={<DDS_Icons.circleArrowUp className="dds icons large" />}
                    placeholder="write a message"
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
        const { common, chat } = store;
        const [more, setmore] = useState(true);

        useEffect(() => {
            home.messageScrollDown();
        }, [common.ui.chatOpen == true]);

        return (
            <div className="message-wrap" id="message-wrap">
                <div className="more">
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
                    <p>{moment(messages[0].createdAt).format("YYYY년 MM월 DD일")}</p>
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
                                {dateCheck && <li className="date">{moment(item.createdAt).format("YYYY년 MM월 DD일")}</li>}
                                <li className={item.sender.userId == myId ? "my" : null}>
                                    {item.sender.userId !== myId && <DDS_Profile.default src={item.sender.plainProfileUrl} />}
                                    <div className="content">
                                        {item.sender.userId !== myId && <div className="name">{item.sender.nickname}</div>}
                                        <div className="inner">
                                            {item.messageType == "user" && <div className="message">{item.message}</div>}
                                            {item.messageType == "file" && (
                                                <>
                                                    {/*  */}
                                                    {item.type == "image/jpeg" || item.type == "image/png" ? <img src={item.plainUrl} /> : null}
                                                </>
                                            )}
                                            <div className="date">{moment(item.createdAt).format("A HH:mm")}</div>
                                        </div>
                                    </div>
                                </li>
                            </React.Fragment>
                        );
                    })}
                </ul>
            </div>
        );
    },
};

export default home;
