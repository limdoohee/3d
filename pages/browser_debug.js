import { observer } from "mobx-react-lite";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
//------------------------------------------------------------------------------- Store
import Store from "../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Module
import checkLogin from "../_lib/module/checkLogin";
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- View
import View from "../_view/index.view";
//------------------------------------------------------------------------------- View

const Home = observer((props) => {
    const { auth } = store;

    useEffect(() => {
        localStorage.setItem("browserDebug", "Y");

        location.href = "/";
    }, []);

    return <></>;
});

//------------------------------------------------------------------------------- getServerSideProps
export async function getServerSideProps(context) {
    let datas = await checkLogin.default.ssr(context);
    return { props: datas };
}
//------------------------------------------------------------------------------- getServerSideProps

export default Home;
