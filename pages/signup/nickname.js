import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Component
import Layout from "../../_lib/component/layout";
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- View
import View from "../../_view/signup/nickname.view";
//------------------------------------------------------------------------------- View

const Home = observer((props) => {
    return (
        <>
            <Layout.back store={store}>
                <View props={props} store={store} />
            </Layout.back>
        </>
    );
});

export default Home;
