//------------------------------------------------------------------------------- Module
import { makeAutoObservable, toJS, configure } from "mobx";
//------------------------------------------------------------------------------- Module
import CommonStore from "./common";
import AuthStore from "./auth";
import LangStore from "./lang";
import ChatStore from "./chat";
import PointStore from "./point";
import AlarmStore from "./alarm";

configure({
    enforceActions: "never",
});

//////////////////////////// Store
class Store {
    //////////////////////////////// Store Call
    common = new CommonStore(this);
    auth = new AuthStore(this);
    chat = new ChatStore(this);
    point = new PointStore(this);
    alarm = new AlarmStore(this);
    lang = new LangStore(this);
    //////////////////////////////// Store Call

    constructor() {
        makeAutoObservable(this);
    }
}
//////////////////////////// Store

export default Store;
