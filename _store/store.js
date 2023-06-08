//------------------------------------------------------------------------------- Module
import { makeAutoObservable, toJS, configure } from "mobx";
//------------------------------------------------------------------------------- Module
import CommonStore from "./common";
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
