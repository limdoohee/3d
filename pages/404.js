import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- View
import View from "../_view/404.view";
//------------------------------------------------------------------------------- View
//------------------------------------------------------------------------------- Store
import Store from "../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store

const Home = observer((props) => {
    return (
        <>
            <View props={props} store={store} />
        </>
    );
});

export default Home;
