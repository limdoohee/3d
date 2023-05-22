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

    // Sendbird 접속
    async connectSendbird({ channelType, callback }) {
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
        this.state.loading = true;

        const [channels, error] = await this.loadChannels(channelType);
        if (error) {
            return this.onError(error);
        }
        this.state = { ...this.state, channels: channels, loading: false, settingUpUser: false };

        callback && callback();
    }
    // Sendbird 에러 출력
    onError(error) {
        this.state = { ...chat.state, error: error.message };
    }

    // Sendbird 채널 가져오기
    async loadChannels(channelType) {
        try {
            let channelQuery;
            let channels;
            switch (channelType) {
                case "openChannel":
                    channelQuery = this.sb[`${channelType}`].createOpenChannelListQuery({ limit: 30 });
                    channels = await channelQuery.next();
                    break;
                // case "groupChannel":
                //     const groupChannelFilter = new GroupChannelFilter();
                //     groupChannelFilter.includeEmpty = true;

                //     const collection = this.sb.groupChannel.createGroupChannelCollection({
                //         filter: groupChannelFilter,
                //         order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
                //     });

                //     collection.setGroupChannelCollectionHandler(this.channelHandlers);
                //     channels = await collection.loadMore();
                //     break;
            }
            return [channels, null];
        } catch (error) {
            return [null, error];
        }
    }
}
//////////////////////////// makeAutoObservable

export default Store;
