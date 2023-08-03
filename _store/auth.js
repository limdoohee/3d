//------------------------------------------------------------------------------- Module
import { makeAutoObservable, toJS, configure } from "mobx";
//------------------------------------------------------------------------------- Module//------------------------------------------------------------------------------- Module
import Api from "../_lib/module/api";
import cookie from "react-cookie";
import { Cookies } from "react-cookie";
//------------------------------------------------------------------------------- Module

configure({
    enforceActions: "never",
});

const cookies = new Cookies();

//////////////////////////// makeAutoObservable
class Store {
    data = {
        loginResult: {
            result: null,
        },
    };

    loginResult = {
        result: null,
    };

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }

    setCheckLogin(value) {
        this.loginResult = value;
        this.store.common.debug(value);
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
        // if (process.env.STAGE == "LOCAL") {
        //     url += "?local=Y";
        // }
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
        const token = this.loginResult.loginToken;
        await Api.post(`/dks-api/v2/check_login`, {}, this.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                this.loginResult = data.data;
                this.loginResult.loginToken = token;
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 인증코드 발송
    async sendAuthCode(params, callback) {
        await Api.post(`/dks-api/v2/send_auth_code`, params, null)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 인증코드 발송
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 인증코드 검증
    async checkAuthCode(params, callback) {
        await Api.post(`/dks-api/v2/check_auth_code`, params, null)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 인증코드 검증
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 점유인증
    async phoneVerify(params, callback) {
        await Api.post(`/dks-api/v2/phone_verify`, params, null)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 점유인증

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
    ////////////////////////////////////////////////////////////////////////////////////////////////////// imageUpload
    async uploadProfileImage(params, callback) {
        await Api.multipart(`/dks-api/v2/upload_profile_image`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// imageUpload

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 프로필 변경
    async changeProfile(params, callback) {
        await Api.post(`/dks-api/v2/change_profile`, params, this.store.auth.loginResult.loginToken)
            // await Api.post(`/dks-api/v2/check_username`, params, this.store.auth.data.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 프로필 변경

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 프로필 변경
    async errorCode(params, callback) {
        await Api.get(`/dks-api/v2/error_code`, params, null)
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 프로필 변경

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 로그아웃
    async logout(params, callback) {
        await Api.post(`/dks-api/v2/logout`, params, cookies.get("loginToken"))
            .then((response) => response.json())
            .then((data) => {
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 로그아웃
}
//////////////////////////// makeAutoObservable

export default Store;
