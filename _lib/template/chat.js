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
//------------------------------------------------------------------------------- Component

const Home = {
    open: observer((props) => {
        const { common, chat } = props.store;
        return (
            <>
                {/* <div>{chat.sb ? "Sendbird Connect" : "Sendbird Disconnect"}</div>
            <div>{chat.state.loading ? "Loading...." : ""}</div>
            <div>{chat.state.error ? chat.state.error : ""}</div> */}
                {chat.state.currentlyJoinedChannel && (
                    <>
                        <h1>{chat.state.currentlyJoinedChannel.name}</h1>
                        {chat.state.messages.map((item, key) => {
                            if (item.messageType == "user") {
                                return (
                                    <div key={key}>
                                        {item.sender && item.sender.nickname} : {item.message}
                                    </div>
                                );
                            }
                            if (item.messageType == "file") {
                                return (
                                    <div key={key}>
                                        {item.sender && item.sender.nickname} : {item.type} / {item.plainUrl}
                                    </div>
                                );
                            }
                        })}
                        <ChatComponent.MessageInput chat={chat} value={chat.state.messageInputValue} sendMessage={chat.sendMessage.open} fileSelected={chat.state.file} />
                    </>
                )}
            </>
        );
    }),
};

export default Home;
