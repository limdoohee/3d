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
//------------------------------------------------------------------------------- Component

const Home = {
    open: observer((props) => {
        const { common, chat } = props.store;

        return (
            <>
                <div className="dk chat">
                    <div className="title">
                        <div className="owner">
                            <DDS_Icons.angleLeft />
                            <DDS_Profile.default src={""} />
                        </div>
                        <div className="operators">
                            <DDS_Icons.user className="dds icons small" />
                            {chat.state.currentlyJoinedChannelOperators.length}
                        </div>
                    </div>
                    {chat.state.currentlyJoinedChannel ? (
                        <>
                            {/* <h1>{chat.state.currentlyJoinedChannel.name}</h1> */}
                            <ChatComponent.MessagePrint messages={chat.state.messages} myId={chat.state.userIdInputValue} loadMessagesPrev={chat.loadMessagesPrev.open} />
                        </>
                    ) : (
                        <div>
                            <div>{chat.sb ? "Sendbird Connect" : "Sendbird Disconnect"}</div>
                            <div>{chat.state.loading ? "Loading...." : ""}</div>
                            <div>{chat.state.error ? chat.state.error : ""}</div>
                        </div>
                    )}
                    <ChatComponent.MessageInput chat={chat} value={chat.state.messageInputValue} sendMessage={chat.sendMessage.open} fileSelected={chat.state.file} />
                </div>
            </>
        );
    }),
};

export default Home;
