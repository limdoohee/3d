import _config from "next/config";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";

import { observer } from "mobx-react-lite";
import { makeAutoObservable, toJS, configure } from "mobx";
import { timestampToTime, handleEnterPress } from "../module/messageUtils";

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
                <input
                    placeholder="write a message"
                    value={value}
                    onChange={onMessageInputChange}
                    onKeyDown={(event) => {
                        handleEnterPress(event, sendMessage);
                    }}
                />
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
};

export default home;
