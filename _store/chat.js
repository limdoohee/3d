import { makeAutoObservable, toJS, configure } from "mobx";

import { ConnectionHandler } from "@sendbird/chat";
import { v4 as uuid } from "uuid";
import SendbirdChat from "@sendbird/chat";
import { OpenChannelModule, OpenChannelHandler } from "@sendbird/chat/openChannel";
import { GroupChannelModule, GroupChannelFilter, GroupChannelListOrder, MessageFilter, MessageCollectionInitPolicy } from "@sendbird/chat/groupChannel";
//------------------------------------------------------------------------------- Module
import Api from "../_lib/module/api";
//------------------------------------------------------------------------------- Module

configure({
    enforceActions: "never",
});

//////////////////////////// makeAutoObservable
class Store {
    sb = null;

    state = {
        currentlyJoinedChannel: null,
        currentlyUpdatingChannel: null,
        currentlyJoinedChannelOperators: [],
        messages: [],
        channels: [],
        showChannelCreate: false,
        messageInputValue: "",
        userNameInputValue: "",
        userIdInputValue: "",
        channelNameInputValue: "",
        settingUpUser: true,
        file: null,
        messageToUpdate: null,
        loading: false,
        error: false,
    };

    members = null;

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }

    updateState(value) {
        this.state = value;
    }
    // Sendbird 에러 출력
    onError(error) {
        this.state = { ...this.state, error: error.message };
    }

    disconnect() {
        if (this.sb) {
            this.sb.disconnect();
        }
        this.state = {
            currentlyJoinedChannel: null,
            currentlyUpdatingChannel: null,
            currentlyJoinedChannelOperators: [],
            messages: [],
            channels: [],
            showChannelCreate: false,
            messageInputValue: "",
            userNameInputValue: "",
            userIdInputValue: "",
            channelNameInputValue: "",
            settingUpUser: true,
            file: null,
            messageToUpdate: null,
            loading: false,
            error: false,
        };
    }

    // Sendbird 접속
    async connectSendbird({ callback }) {
        this.state.loading = true;
        const sendbirdSetting = {
            appId: process.env.SENDBIRD_APP_ID,
            localCacheEnabled: true,
            modules: [new OpenChannelModule(), new GroupChannelModule()],
        };
        const sendbirdChat = await SendbirdChat.init(sendbirdSetting);

        try {
            await sendbirdChat.connect(this.state.userIdInputValue);
            this.store.common.debug("Sendbird connect Success");
        } catch (e) {
            this.store.common.debug("error", e);
        }

        await sendbirdChat.setChannelInvitationPreference(true);

        const userUpdateParams = {};
        userUpdateParams.nickname = this.state.userNameInputValue;
        userUpdateParams.userId = this.state.userIdInputValue;
        await sendbirdChat.updateCurrentUserInfo(userUpdateParams);

        this.sb = sendbirdChat;
        this.state.loading = false;

        callback && callback();
    }

    // Sendbird 채널 가져오기
    async loadChannels(channelType, callback) {
        this.state.loading = true;
        try {
            let channelQuery;
            let channels;
            switch (channelType) {
                case "openChannel":
                    channelQuery = this.sb[`${channelType}`].createOpenChannelListQuery({ limit: 30 });
                    channels = await channelQuery.next();
                    break;
                case "groupChannel":
                    const groupChannelFilter = new GroupChannelFilter();
                    groupChannelFilter.includeEmpty = true;

                    const collection = this.sb.groupChannel.createGroupChannelCollection({
                        filter: groupChannelFilter,
                        order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
                    });

                    collection.setGroupChannelCollectionHandler(this.channelHandlers);
                    channels = await collection.loadMore();
                    break;
            }
            this.store.common.debug(channels);
            this.state = { ...this.state, channels: channels, loading: false, settingUpUser: false };
        } catch (error) {
            return this.onError(error);
        }
        callback && callback();
    }

    // Sendbird 채널 들어가기
    async handleJoinChannel({ channelType, channelUrl }) {
        //////////////////////////////////////////////////////////////////// openChannel
        if (channelType == "openChannel") {
            // if (this.state.currentlyJoinedChannel?.url === channelUrl) {
            //     return null;
            // }

            this.state.loading = true;

            const channelToJoin = await this.sb.openChannel.getChannel(channelUrl);

            // const channelToJoin = this.state.channels.find((channel) => channel.url === channelUrl);
            await channelToJoin.enter();
            const [messages, error] = await this.loadMessages.open(channelToJoin);
            const [operators, operatorsError] = await this.getChannelOperators(channelToJoin);
            if (error) {
                return this.onError(error);
            }

            // setup connection event handlers
            const connectionHandler = new ConnectionHandler();
            connectionHandler.onReconnectSucceeded = async () => {
                console.log("onReconnectSucceeded");
                const [messages, error] = await this.loadMessages.open(channelToJoin);
                this.state = { ...this.state, messages: messages };
            };

            //listen for incoming messages
            const channelHandler = new OpenChannelHandler();
            channelHandler.onMessageUpdated = (channel, message) => {
                // console.log("onMessageUpdated");
                const messageIndex = this.state.messages.findIndex((item) => item.messageId == message.messageId);
                const updatedMessages = [...this.state.messages];
                updatedMessages[messageIndex] = message;
                // console.log("updatedMessages");
                this.state = { ...this.state, messages: updatedMessages };
            };
            channelHandler.onMessageReceived = (channel, message) => {
                // console.log("onMessageReceived");
                const updatedMessages = [...this.state.messages, message];
                this.state = { ...this.state, messages: updatedMessages };
            };
            channelHandler.onMessageDeleted = (channel, message) => {
                // console.log("onMessageDeleted");
                const updatedMessages = this.state.messages.filter((messageObject) => {
                    return messageObject.messageId !== message;
                });
                this.state = { ...this.state, messages: updatedMessages };
            };

            // 메타데이터 업데이트
            // const metadata = { onlineUsers: [] };
            // channelHandler.onMetaDataCreated(metadata, (response, error) => {
            //     console.log(`메타데이터가 업데이트되었습니다.`);
            // });
            // // channelHandler.onChannelChanged;
            // channelHandler.onMessageReceived = (channel) => {
            //     // 메타데이터 가져오기
            //     channel.getMetaData(["onlineUsers"], (metadata, error) => {
            //         if (error) {
            //             console.error(error);
            //             return;
            //         }

            //         const onlineUsers = response["onlineUsers"];
            //         console.log(`현재 접속한 사용자 목록: ${onlineUsers.join(", ")}`);
            //     });
            // };

            // // 사용자 입장
            // channelToJoin.onUserEntered = (user) => {
            //     // 메타데이터 업데이트: 사용자를 온라인 목록에 추가
            //     channel.getMetaData(["onlineUsers"], (response, error) => {
            //         if (error) {
            //             console.error(error);
            //             return;
            //         }

            //         const onlineUsers = response["onlineUsers"];
            //         onlineUsers.push(user.userId);

            //         const metadata = { onlineUsers };
            //         channel.updateMetaData(metadata, (response, error) => {
            //             if (error) {
            //                 console.error(error);
            //                 return;
            //             }

            //             console.log(`사용자 ${user.userId}이(가) 채널에 입장했습니다.`);
            //         });
            //     });
            // };

            // // 사용자 퇴장
            // channelToJoin.onUserExited = (user) => {
            //     // 메타데이터 업데이트: 사용자를 온라인 목록에서 제거
            //     channel.getMetaData(["onlineUsers"], (response, error) => {
            //         if (error) {
            //             console.error(error);
            //             return;
            //         }

            //         const onlineUsers = response["onlineUsers"];
            //         const index = onlineUsers.indexOf(user.userId);
            //         if (index !== -1) {
            //             onlineUsers.splice(index, 1);

            //             const metadata = { onlineUsers };
            //             channel.updateMetaData(metadata, (response, error) => {
            //                 if (error) {
            //                     console.error(error);
            //                     return;
            //                 }

            //                 console.log(`사용자 ${user.userId}이(가) 채널에서 나갔습니다.`);
            //             });
            //         }
            //     });
            // };

            this.sb.openChannel.addOpenChannelHandler(uuid(), channelHandler);
            this.state = { ...this.state, currentlyJoinedChannel: channelToJoin, messages: messages, loading: false, currentlyJoinedChannelOperators: operators };

            console.log({ ...this.state, currentlyJoinedChannel: channelToJoin, messages: messages, loading: false, currentlyJoinedChannelOperators: operators });
        }
        //////////////////////////////////////////////////////////////////// openChannel

        //////////////////////////////////////////////////////////////////// groupChannel
        if (channelType == "groupChannel") {
            if (this.state.messageCollection && this.state.messageCollection.dispose) {
                this.state.messageCollection?.dispose();
            }
            if (this.state.currentlyJoinedChannel?.url === channelUrl) {
                return null;
            }

            this.state.loading = true;
            const channel = channels.find((channel) => channel.url === channelUrl);
            const onCacheResult = (err, messages) => {
                this.state = { ...this.state, currentlyJoinedChannel: channel, messages: messages.reverse(), loading: false };
            };
            const onApiResult = (err, messages) => {
                this.state = { ...this.state, currentlyJoinedChannel: channel, messages: messages.reverse(), loading: false };
            };
            const collection = this.loadMessages.group(channel, this.messageHandlers.group, onCacheResult, onApiResult);
            this.state = { ...this.state, messageCollection: collection };
        }
        //////////////////////////////////////////////////////////////////// groupChannel
    }

    // Sendbird 채널 핸들러
    channelHandlers = {
        onChannelsAdded: (context, channels) => {
            const updatedChannels = [...channels, ...this.state.channels];
            this.state = { ...this.state, channels: updatedChannels, applicationUsers: [] };
        },
        onChannelsDeleted: (context, channels) => {
            const updatedChannels = this.state.channels.filter((channel) => {
                return !channels.includes(channel.url);
            });
            this.state = { ...this.state, channels: updatedChannels };
        },
        onChannelsUpdated: (context, channels) => {
            const updatedChannels = this.state.channels.map((channel) => {
                const updatedChannel = channels.find((incomingChannel) => incomingChannel.url === channel.url);
                if (updatedChannel) {
                    return updatedChannel;
                } else {
                    return channel;
                }
            });
            this.state = { ...this.state, channels: updatedChannels };
        },
    };

    // Sendbird 메세지 로드
    loadMessages = {
        open: async (channel, timeFlag) => {
            try {
                //list all messages
                const messageListParams = {};
                messageListParams.prevResultSize = 30;
                // messageListParams.reverse = true;
                const unixMilliseconds = timeFlag ? timeFlag : new Date().getTime();
                const messages = await channel.getMessagesByTimestamp(unixMilliseconds, messageListParams);
                return [messages, null];
            } catch (error) {
                return [null, error];
            }
        },
        group: (channel, messageHandlers, onCacheResult, onApiResult) => {
            const messageFilter = new MessageFilter();

            const collection = channel.createMessageCollection({
                filter: messageFilter,
                startingPoint: Date.now(),
                limit: 100,
            });

            collection.setMessageCollectionHandler(messageHandlers);
            collection.initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API).onCacheResult(onCacheResult).onApiResult(onApiResult);
            return collection;
        },
    };

    // Sendbird 메세지 이전 내용 로드
    loadMessagesPrev = {
        open: async ({ callback }) => {
            var callbackReturn = true;
            const messageListParams = {};
            messageListParams.prevResultSize = 30;
            // messageListParams.reverse = true;
            var messageId = this.state.messages[0].messageId;
            const prevMessage = await this.state.currentlyJoinedChannel.getMessagesByMessageId(messageId, messageListParams);
            if (prevMessage.length > 0) {
                var mergeMessage = [...prevMessage, ...this.state.messages];
                this.state = { ...this.state, messages: mergeMessage };

                if (prevMessage.length < messageListParams.prevResultSize) {
                    callbackReturn = false;
                }
            } else {
                alert("더 이상 가져올 메세지가 없습니다.");
                callbackReturn = false;
            }
            callback && callback(callbackReturn);
        },
    };

    // Sendbird 메세지 핸들러
    messageHandlers = {
        group: {
            onMessagesAdded: (context, channel, messages) => {
                const updatedMessages = [...this.state.messages, ...messages];
                this.state = { ...this.state, messages: updatedMessages };
            },
            onMessagesUpdated: (context, channel, messages) => {
                const updatedMessages = [...this.state.messages.messages];
                for (let i in messages) {
                    const incomingMessage = messages[i];
                    const indexOfExisting = this.state.messages.messages.findIndex((message) => {
                        return incomingMessage.reqId === message.reqId;
                    });

                    if (indexOfExisting !== -1) {
                        updatedMessages[indexOfExisting] = incomingMessage;
                    }
                    if (!incomingMessage.reqId) {
                        updatedMessages.push(incomingMessage);
                    }
                }

                this.state = { ...this.state, messages: updatedMessages };
            },
            onMessagesDeleted: (context, channel, messageIds) => {
                const updateMessages = this.state.messages.messages.filter((message) => {
                    return !messageIds.includes(message.messageId);
                });
                this.state = { ...this.state, messages: updatedMessages };
            },
            onChannelUpdated: (context, channel) => {},
            onChannelDeleted: (context, channelUrl) => {},
            onHugeGapDetected: () => {},
        },
    };

    // Sendbird 메세지 보내기
    sendMessage = {
        open: async ({ callback }) => {
            const { messageToUpdate, currentlyJoinedChannel, messages } = this.state;
            if (messageToUpdate) {
                const userMessageUpdateParams = {};
                userMessageUpdateParams.message = state.messageInputValue;
                const updatedMessage = await currentlyJoinedChannel.updateUserMessage(messageToUpdate.messageId, userMessageUpdateParams);
                const messageIndex = messages.findIndex((item) => item.messageId == messageToUpdate.messageId);
                messages[messageIndex] = updatedMessage;
                this.state = { ...this.state, messages: messages, messageInputValue: "", messageToUpdate: null };
            } else {
                const userMessageParams = {};
                userMessageParams.message = this.state.messageInputValue;
                currentlyJoinedChannel
                    .sendUserMessage(userMessageParams)
                    .onSucceeded(async (message) => {
                        // console.log("onSucceeded");
                        const updatedMessages = [...messages, message];
                        this.state = { ...this.state, messages: updatedMessages, messageInputValue: "" };

                        // var params = { prompt: message.message, channelType: "open_channels", channelUrl: "sendbird_open_channel_10510_15a620bd611c5fdb2c80024d330bdb3ff0cc9c41" };
                        // await Api.restPost(`https://86a3-175-209-16-141.ngrok-free.app/dks-api/v2/chatgpt/ask`, params)
                        //     .then((response) => response.json())
                        //     .then((data) => {});
                        callback && callback();
                    })
                    .onFailed((error) => {
                        console.log(error);
                        console.log("failed");
                    });
            }
        },
    };

    // Sendbird Get Operators
    async getChannelOperators(channel) {
        try {
            const query = channel.createOperatorListQuery();
            const operators = await query.next();
            return [operators, null];
        } catch (error) {
            return [null, error];
        }
    }

    async joinChat({ name, id, url }) {
        await (this.state = { ...this.state, userNameInputValue: name, userIdInputValue: id });
        await this.connectSendbird({
            // channelType: "openChannel",
            callback: () => {
                this.handleJoinChannel({ channelType: "openChannel", channelUrl: url });
                // chat.loadChannels("openChannel", () => {
                // });
            },
        });
    }

    // Sendbird onFileInputChange
    async onFileInputChange(e) {
        if (e.currentTarget.files && e.currentTarget.files.length > 0) {
            const fileMessageParams = {};
            fileMessageParams.file = e.currentTarget.files[0];
            this.state.currentlyJoinedChannel
                .sendFileMessage(fileMessageParams)
                .onSucceeded((message) => {
                    const updatedMessages = [...this.state.messages, message];
                    this.state = { ...this.state, messages: updatedMessages, messageInputValue: "", file: null };
                })
                .onFailed((error) => {
                    console.log(error);
                    console.log("failed");
                });
        }
    }
}
//////////////////////////// makeAutoObservable

export default Store;
