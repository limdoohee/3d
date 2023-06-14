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

    login(type, path) {
        switch (type) {
            case "naver":
                var url = `/oauth2/authorization/naver`;
                break;
            case "kakao":
                var url = `/oauth2/authorization/kakao`;
                break;
            case "google":
                var url = `/oauth2/authorization/google`;
                break;
            case "apple":
                var url = `/oauth2/authorization/apple`;
                break;
        }
        if (!sessionStorage.getItem("loginPath")) {
            sessionStorage.setItem("loginPath", path);
        }
        location.href = `${process.env.API_URL}${url}`;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 체크로그인
    async checkLoginJwt(jwt, callback) {
        await Api.post(`/dks-api/v2/check_login`, {}, jwt ? jwt : null)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 체크로그인

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 체크로그인
    async checkLoginCSR({}, callback) {
        await Api.post(`/dks-api/v2/check_login`, {}, cookie.load("loginToken") ? cookie.load("loginToken") : null)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 체크로그인

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 로그인 정보 셋팅
    loginResultSet(data) {
        if (data.result == "ok") {
            this.data.loginResult = data;
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 로그인 정보 셋팅

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 로그인 상태 반영
    async checkLoginStatus() {
        if (this.data.loginResult.selfAuth === false) {
            this.store.common.data.uiSelfauth = true;
        } else if (this.data.loginResult.termsAgree === false) {
            this.store.common.data.uiTermsagree = true;
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 로그인 상태 반영

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 이용약관 동의
    async phoneVerify(params, callback) {
        await Api.post(`/dks-api/v2/phone_verify`, params, null)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 이용약관 동의

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 닉네임 중복 체크
    async checkNickname(params, callback) {
        await Api.post(`/dks-api/v2/check_nickname`, params, null)
            // await Api.post(`/dks-api/v2/check_username`, params, this.store.auth.data.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 닉네임 중복 체크
}
//////////////////////////// makeAutoObservable

export default Store;
