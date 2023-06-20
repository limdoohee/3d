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
        // artistFlag: false, //	true: 작가임, false: 작가아님
        // collection: [], //보유 작품 목록
        // galleryLink: "https://dropkitchen.page.link/gZKo5hCpYoYbCDeq5", //갤러리 공유 딥링크
        // introduction: null, //소개글
        // inviteCnt: 0, //친구 초대 수
        // myDropCnt: 0, //드랍 받은 수
        // nickname: "Merong!@#", //닉네임
        // ownFlag: null, //true: 본인임, false: 본인아님, null: 로그인안함
        // pointBalance: 5000, //보유 포인트 금액
        // profileImage: null, //프로필 이미지 URL
        // totalDropCnt: 2, //전체 드랍수
    };

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }

    async getData(params, callback) {
        await Api.get(`/dks-api/v2/gallery`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                this.data = data.data;
                callback && callback(data.data ? data.data : data);
            });
    }
}
//////////////////////////// makeAutoObservable

export default Store;
