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
            // dropSeq: 3,
            // status: "processing",
            // startAt: "2023-06-22 11:23:31",
            // endAt: "2023-06-22 13:44:59",
            // artSeq: 3,
            // artName: "작품2",
            // artistName: "dev_test",
            // amount: 2000,
            // contentUrl: "https://asset.dropkitchen.xyz/contents/202303_prod/YeonYeoIn_Daily_Attendance_Check_00.mp4",
            // thumbnailUrl: "https://asset.dropkitchen.xyz/contents/202304_dev/20230405151809635_dk.webp",
            // ownerCnt: 1,
            // dropOwnFlag: false,
        },
        next: {
            // dropSeq: 1,
            // status: "ready",
            // startAt: "2023-06-22 13:45:00",
            // endAt: "2023-06-22 11:25:56",
            // artSeq: 2,
            // artName: "작품3",
            // artistName: "dev_test",
            // amount: 2000,
            // contentUrl: "https://asset.dropkitchen.xyz/contents/202303_prod/YeonYeoIn_Daily_Attendance_Check_00.mp4",
            // thumbnailUrl: "https://asset.dropkitchen.xyz/contents/202304_dev/20230405151809635_dk.webp",
            // ownerCnt: 0,
            // dropOwnFlag: null,
        },
        detail: {},
        dropList: { dropList: [], totalDropCnt: 0, myDropCnt: 0 },
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
                this.data.next = data.data.drop[1];
                callback && callback(data.data ? data.data : data);
            });
    }

    async getDetail(params, callback) {
        await Api.get(`/dks-api/v2/drop_detail`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                this.data.detail = data.data.drop;
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
