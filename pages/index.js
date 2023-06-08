import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
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

    auth.setCheckLogin(props);

    return (
        <>
            <View props={props} store={store} />
        </>
    );
});

//------------------------------------------------------------------------------- getServerSideProps
export async function getServerSideProps(context) {
    let datas = await checkLogin.default.ssr(context);
    return { props: datas };
}
//------------------------------------------------------------------------------- getServerSideProps

export default Home;
