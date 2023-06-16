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
        id: 1,
        startDate: "2023-06-22 10:00:30", // 드롭 오픈 시간
        endDate: "2023-06-24 17:02:40", // 드롭 마감 시간
        owner: 123,
        status: "ready",
        myDrop: false,
        url: "../../static/3d/275C_Popup.fbx",
        //
        dropList: { dropList: [] },
    };

    next = {
        id: 2,
        startDate: "2023-06-13 08:49:30", // 드롭 오픈 시간
    };

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }

    async getDrop() {
        await Api.get(`/dks-api/v2/drop`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
    }

    dataChange(key, value, callback) {
        this.data[key] = value;
        callback && callback();
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 매거진 목록 조회
    async dropList(params, callback) {
        await Api.get(`/dks-api/v2/drop_list`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                this.data.dropList = data.data;
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 매거진 목록 조회
}
//////////////////////////// makeAutoObservable

export default Store;
