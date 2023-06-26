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
    data = { pointHistory: { point: [], page: {} } };

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 알림 내역 조회
    async pointHistory(params, callback) {
        await Api.get(`/dks-api/v2/point_history`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                if (data.data) {
                    this.data.pointHistory = data.data;
                }
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 알림 내역 조회
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 알림 내역 조회
    async migratePoint(params, callback) {
        await Api.post(`/dks-api/v2/migrate_point`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 알림 내역 조회
}
//////////////////////////// makeAutoObservable

export default Store;
