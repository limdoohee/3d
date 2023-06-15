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
            }
        };

        const onSend = async () => {
            if (chat.state.messageInputValue) {
                await sendMessage({
                    callback: () => {
                        console.log("sendMessage");
                        home.messageScrollDown();
                    },
                });
            }
            // console.log("onSend", v);
        };

        return (
            <div className="message-input">
                <div className="upload">
                    <DDS_Icons.plus className="dds icons" />
                    <input id="upload" type="file" onChange={onFileInputChange} onClick={() => {}} />
                </div>
                <DDS_Input.default
                    className="dds input secondary rounded"
                    suffix={<DDS_Icons.circleArrowUp className={`dds icons large ${chat.state.messageInputValue ? "" : "disabled"}`} />}
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
        const { common, chat } = store;
        const [more, setmore] = useState(true);

        useEffect(() => {
            home.messageScrollDown();
        }, [common.ui.chatOpen == true]);

        const clickProfile = (sender) => {
            alert(sender.userId);
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
                    {/* {more && (
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
                    )} */}
                    <p>{moment(messages[0] && messages[0].createdAt).format("YYYY년 MM월 DD일")}</p>
                    <h6>
                        실시간 채팅에 오신것을 환영해요!
                        <br />
                        운영정책을 위반할 시 채팅방 이용에 제한이 있을 수 있어요.
                        <br />
                        상대방을 존중하고 배려하는 대화방을 만들어주세요.
                    </h6>
                    <h6>
                        <u>채팅 서비스 이용 안내 보기</u>
                    </h6>
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

                                {item.sender ? (
                                    <li className={item.sender.userId == myId ? "my" : null}>
                                        {item.sender.userId !== myId && (
                                            <DDS_Profile.default
                                                src={item.sender.plainProfileUrl}
                                                onClick={() => {
                                                    clickProfile(item.sender);
                                                }}
                                            />
                                        )}
                                        <div className="content">
                                            {item.sender.userId !== myId && <div className="name">{item.sender.nickname}</div>}
                                            <div className="inner">
                                                {item.messageType == "user" && <div className="message">{item.message}</div>}
                                                {item.messageType == "file" && <div className="message">{item.type == "image/jpeg" || item.type == "image/png" || item.type == "image/gif" ? <img src={item.plainUrl} /> : null}</div>}
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
                                                    <div className="message">
                                                        {/*  */}
                                                        {item.type == "image/jpeg" || item.type == "image/png" ? <img src={item.plainUrl} /> : null}
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
            </div>
        );
    },
};

export default home;
