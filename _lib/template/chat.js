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
//------------------------------------------------------------------------------- Component

const Home = {
    open: observer((props) => {
        const { common, chat } = props.store;

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
            <>
                {/* <div>{chat.sb ? "Sendbird Connect" : "Sendbird Disconnect"}</div>
            <div>{chat.state.loading ? "Loading...." : ""}</div>
            <div>{chat.state.error ? chat.state.error : ""}</div> */}
                {chat.state.currentlyJoinedChannel && (
                    <div className="dk chat">
                        {/* <h1>{chat.state.currentlyJoinedChannel.name}</h1> */}
                        <ChatComponent.MessagePrint messages={chat.state.messages} />
                        <ChatComponent.MessageInput chat={chat} value={chat.state.messageInputValue} sendMessage={chat.sendMessage.open} fileSelected={chat.state.file} />
                    </div>
                )}
            </>
        );
    }),
};

export default Home;
