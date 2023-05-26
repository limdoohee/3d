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
        startDate: "2023-05-26 11:36:00", // 드롭 오픈 시간
        endDate: "2023-05-28 16:45:00", // 드롭 마감 시간
        owner: 123,
        status: "before",
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
