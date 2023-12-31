//------------------------------------------------------------------------------- Module
import { makeAutoObservable, toJS, configure } from "mobx";
//------------------------------------------------------------------------------- Module//------------------------------------------------------------------------------- Module
import Api from "../_lib/module/api";
import cookie from "react-cookie";
//------------------------------------------------------------------------------- Module

configure({
    enforceActions: "never",
});

//////////////////////////// makeAutoObservable
class Store {
    data = {
        loginResult: {
            result: null,
        },
    };

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }

    setCheckLogin(value) {
        this.loginResult = value;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 휴대폰 번호 변경
    async changePhoneNo(params, callback) {
        await Api.post(`/dks-api/v2/change_cell_no`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 휴대폰 번호 변경

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 알림 수신 변경
    async changePushAgree(params, callback) {
        await Api.post(`/dks-api/v2/change_push_agree`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 알림 수신 변경

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 알림 수신 변경
    async signout(params, callback) {
        await Api.post(`/dks-api/v2/signout`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 알림 수신 변경
}
//////////////////////////// makeAutoObservable

export default Store;
