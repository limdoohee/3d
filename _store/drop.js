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
        startDate: "2023-06-09 10:00:30", // 드롭 오픈 시간
        endDate: "2023-06-09 17:02:40", // 드롭 마감 시간
        owner: 123,
        status: "open",
        myDrop: false,
        url: "../../static/3d/275C_Popup.fbx",
    };

    next = {
        startDate: "2023-06-06 08:49:30", // 드롭 오픈 시간
    };

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }

    dataChange(key, value, callback) {
        this.data[key] = value;
        callback && callback();
    }
}
//////////////////////////// makeAutoObservable

export default Store;
