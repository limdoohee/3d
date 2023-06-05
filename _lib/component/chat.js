import _config from "next/config";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";

import { observer } from "mobx-react-lite";
import { makeAutoObservable, toJS, configure } from "mobx";
import { timestampToTime, handleEnterPress } from "../module/messageUtils";

//------------------------------------------------------------------------------- Component
import DDS_Input from "../../_lib/component/input";
import DDS_Icons from "../../_lib/component/icons";
import DDS_Profile from "../../_lib/component/profile";
//------------------------------------------------------------------------------- Component

const home = {
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
                    })
                    .onFailed((error) => {
                        console.log(error);
                        console.log("failed");
                    });
            }
        };

        return (
            <div className="message-input">
                <DDS_Input.default className="dds input secondary" placeholder="텍스트 입력" defaultValue="Input secondary suffix" suffix={<DDS_Icons.magnifyingGlass />} />
                <input placeholder="write a message" value={value} onChange={onMessageInputChange} onKeyDown={onMessageInputChange} />
                <div className="message-input-buttons">
                    <button className="send-message-button" onClick={sendMessage}>
                        Send Message
                    </button>
                    <label className="file-upload-label" htmlFor="upload">
                        Select File
                    </label>
                    <input id="upload" className="file-upload-button" type="file" hidden={true} onChange={onFileInputChange} onClick={() => {}} />
                </div>
            </div>
        );
    },
    MessagePrint: ({ messages, myId }) => {
        return (
            <ul className="messages">
                {messages.map((item, key) => {
                    return (
                        <li key={key} className={item.sender.userId == myId ? "my" : null}>
                            {item.messageType == "user" && (
                                <>
                                    <DDS_Profile.default src={item.sender.plainProfileUrl} />
                                    <div className="message">{item.message}</div>
                                    {/* {item.sender && item.sender.nickname} : */}
                                </>
                            )}
                            {item.messageType == "file" && (
                                <>
                                    {item.sender && item.sender.nickname} :{item.type == "image/jpeg" || item.type == "image/png" ? <img src={item.plainUrl} /> : null}
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    },
};

export default home;
