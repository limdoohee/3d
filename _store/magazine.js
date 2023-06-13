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
        magazineList: { list: [], page: {} },
    };

    constructor(store) {
        this.store = store;
        makeAutoObservable(this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////// 매거진 목록 조회
    async magazineList(params, callback) {
        await Api.get(`/dks-api/v2/magazine_list`, params, this.store.auth.loginResult.loginToken)
            .then((response) => response.json())
            .then((data) => {
                data.data.magazine.forEach((element, key) => {
                    data.data.magazine[key].hashTag = element.hashTag.split(",");
                });
                if (data.data.page.pageNumber === 0) {
                    this.data.magazineList.list = data.data.magazine;
                } else if (data.data.page.pageNumber !== 0) {
                    data.data.magazine.forEach((element) => {
                        this.data.magazineList.list.push(element);
                    });
                }
                this.data.magazineList.page = data.data.page;
                callback && callback(data.data ? data.data : data);
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// 매거진 목록 조회
}
//////////////////////////// makeAutoObservable

export default Store;
