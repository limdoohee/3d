import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Component
import ChatComponent from "../../_lib/component/chat";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { common, chat } = props.store;
    const router = useRouter();

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/test/chat") {
            joinChat({ name: "kimjh", id: "kimjh", url: "sendbird_open_channel_10510_f7b58093d862c9af9af0f9499049cfd7e1469d5e" });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    const joinChat = async ({ name, id, url }) => {
        await chat.updateState({ ...chat.state, userNameInputValue: name, userIdInputValue: id });
        await chat.connectSendbird({
            // channelType: "openChannel",
            callback: () => {
                common.debug(chat.sb);
                chat.handleJoinChannel({ channelType: "openChannel", channelUrl: url });
                // chat.loadChannels("openChannel", () => {
                // });
            },
        });
    };

    return (
        <>
            <Head>
                <title>Chat Test</title>
            </Head>
            <div>{chat.sb ? "Sendbird Connect" : "Sendbird Disconnect"}</div>
            <div>{chat.state.loading ? "Loading...." : ""}</div>
            <div>{chat.state.error ? chat.state.error : ""}</div>
            {/* <ul>
                {chat.state.channels.map((item, key) => {
                    return (
                        <li key={key}>
                            <div
                                onClick={() => {
                                    joinChat(item.url);
                                }}
                            >
                                {item.name} : {item.url}
                            </div>
                        </li>
                    );
                })}
            </ul> */}
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
});

export default Home;
