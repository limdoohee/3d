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
        messages: [],
        channels: [],
        showChannelCreate: false,
        messageInputValue: "",
        userNameInputValue: "JISUN",
        userIdInputValue: "JISUN",
        channelNameInputValue: "",
        settingUpUser: true,
        file: null,
        messageToUpdate: null,
        loading: false,
        error: false,
    };

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }

    updateState(value) {
        this.state = value;
    }
    // Sendbird 에러 출력
    onError(error) {
        this.state = { ...chat.state, error: error.message };
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
    async loadChannels(channelType) {
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
    }

    // Sendbird 채널 들어가기
    async handleJoinChannel({ channelType, channelUrl }) {
        //////////////////////////////////////////////////////////////////// openChannel
        if (channelType == "openChannel") {
            if (this.state.currentlyJoinedChannel?.url === channelUrl) {
                return null;
            }

            this.state.loading = true;
            const channelToJoin = this.state.channels.find((channel) => channel.url === channelUrl);
            await channelToJoin.enter();
            const [messages, error] = await this.loadMessages.open(channelToJoin);
            if (error) {
                return this.onError(error);
            }

            // setup connection event handlers
            const connectionHandler = new ConnectionHandler();
            connectionHandler.onReconnectSucceeded = async () => {
                // console.log("onReconnectSucceeded");
                const [messages, error] = await this.loadMessages.open(channelToJoin);
                this.state = { ...this.state, messages: messages };
            };
            this.sb.addConnectionHandler(uuid(), connectionHandler);

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
            this.sb.openChannel.addOpenChannelHandler(uuid(), channelHandler);
            this.state = { ...this.state, currentlyJoinedChannel: channelToJoin, messages: messages, loading: false };
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
        open: async (channel, messageId) => {
            const messageListParams = {};
            messageListParams.prevResultSize = 30;
            // messageListParams.reverse = true;
            const prevMessage = await channel.getMessagesByMessageId(messageId, messageListParams);
            if (prevMessage.length > 0) {
                var mergeMessage = [...prevMessage, ...this.state.messages];
                this.state = { ...this.state, messages: mergeMessage };
            } else {
                alert("더 이상 가져올 메세지가 없습니다.");
            }
        },
    };

    // Sendbird onMessageInputChange
    onMessageInputChange(e) {
        const messageInputValue = e.currentTarget.value;
        this.state = { ...this.state, messageInputValue };
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
