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
    // data = {
    //     id: 1,
    //     startDate: "2023-06-16 16:00:30", // 드롭 오픈 시간
    //     endDate: "2023-06-16 17:02:40", // 드롭 마감 시간
    //     owner: 123,
    //     status: "ready",
    //     myDrop: false,
    //     url: "../../static/3d/275C_Popup.fbx",
    // };

    // next = {
    //     id: 2,
    //     startDate: "2023-06-13 08:49:30", // 드롭 오픈 시간
    // };

    data = {
        curr: {
            // dropSeq: 2,
            // status: "processing",
            // startAt: "2023-06-12 14:23:31",
            // endAt: "2023-06-20 11:25:55",
            // artSeq: 2,
            // artName: "작품2",
            // artistName: "dev_test",
            // amount: 2000,
            // contentUrl: "https://asset.dropkitchen.xyz/contents/202303_prod/YeonYeoIn_Daily_Attendance_Check_00.mp4",
            // thumbnailUrl: "https://asset.dropkitchen.xyz/contents/202304_dev/20230405151809635_dk.webp",
            // ownerCnt: 1,
            // dropOwnFlag: null,
        },
        next: {
            // dropSeq: 3,
            // status: "ready",
            // startAt: "2023-06-20 11:25:56",
            // endAt: "2023-06-24 11:25:56",
            // artSeq: 3,
            // artName: "작품3",
            // artistName: "dev_test",
            // amount: 2000,
            // contentUrl: "https://asset.dropkitchen.xyz/contents/202303_prod/YeonYeoIn_Daily_Attendance_Check_00.mp4",
            // thumbnailUrl: "https://asset.dropkitchen.xyz/contents/202304_dev/20230405151809635_dk.webp",
            // ownerCnt: 0,
            // dropOwnFlag: null,
        },
        selected: 21,
        detail: {},
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
        await Api.get(`/dks-api/v2/drop_detail`, params, "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMCIsImlhdCI6MTY4NjE5NzIzNH0.LyXlQGghMW2WQM0CA0TZTdnHRNjjzWXX9t2uu_IPSKE")
            .then((response) => response.json())
            .then((data) => {
                this.data.detail = data.data.drop;
                callback && callback(data.data ? data.data : data);
            });
    }

    async updateLike(params, callback) {
        await Api.post(`/dks-api/v2/like_art`, params, "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMCIsImlhdCI6MTY4NjE5NzIzNH0.LyXlQGghMW2WQM0CA0TZTdnHRNjjzWXX9t2uu_IPSKE")
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }

    dataChange(key, value, callback) {
        this.data[key] = value;
        callback && callback();
    }
}
//////////////////////////// makeAutoObservable

export default Store;
