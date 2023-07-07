//------------------------------------------------------------------------------- Module
import { makeAutoObservable, toJS, configure } from "mobx";
//------------------------------------------------------------------------------- Module//------------------------------------------------------------------------------- Module
import Api from "../_lib/module/api";
//------------------------------------------------------------------------------- Module

configure({
    enforceActions: "never",
});

//////////////////////////// makeAutoObservable
class Store {
    data = {
        curr: {
            // dropSeq: 2,
            // status: "processing",
            // startAt: "2023-06-28 12:30:00",
            // endAt: "2023-06-28 13:59:59",
            // artSeq: 2,
            // artName: "Dream Guardian Cat",
            // artistName: "김윤아",
            // amount: 10,
            // contentUrl: "https://asset.dropkitchen.xyz/contents/drops/Drop02_KimYunA/scene.gltf",
            // thumbnailUrl: "https://asset.dropkitchen.xyz/contents/202306_dev/20230627143346646_dk.webp",
            // ownerCnt: 2,
            // dropOwnFlag: false,
            // dropRound: "2",
        },
        detail: {},
        dropList: { dropList: [], totalDropCnt: 0, myDropCnt: 0 },
        mainLink: "",
        dropLink: null,
    };

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }

    async getData(params, callback) {
        await Api.get(`/dks-api/v2/drop`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                this.data.curr = data.data.drop[0];
                this.data.mainLink = data.data.mainLink;
                callback && callback(data.data ? data.data : data);
            });
    }

    async getDetail(params, callback) {
        await Api.get(`/dks-api/v2/drop_detail`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                this.data.detail = data.data.drop;
                this.data.dropLink = data.data.dropLink;
                callback && callback(data.data ? data.data : data);
            });
    }

    async updateLike(params, callback) {
        await Api.post(`/dks-api/v2/like_art`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }

    async dropArt(params, callback) {
        await Api.post(`/dks-api/v2/drop_art`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }

    dataChange(key, value, callback) {
        this.data.curr[key] = value;
        callback && callback();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 매거진 목록 조회
    async dropList(params, callback) {
        await Api.get(`/dks-api/v2/drop_list`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                if (data.data) {
                    this.data.dropList = data.data;
                }
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 매거진 목록 조회
}
//////////////////////////// makeAutoObservable

export default Store;
