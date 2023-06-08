//------------------------------------------------------------------------------- Module
import { makeAutoObservable, toJS, configure } from "mobx";
//------------------------------------------------------------------------------- Module
import CommonStore from "./common";
import ChatStore from "./chat";
import PointStore from "./point";

configure({
    enforceActions: "never",
});

//////////////////////////// Store
class Store {
    //////////////////////////////// Store Call
    common = new CommonStore(this);
    chat = new ChatStore(this);
    point = new PointStore(this);
    //////////////////////////////// Store Call

    constructor() {
        makeAutoObservable(this);
    }
}
//////////////////////////// Store

export default Store;
