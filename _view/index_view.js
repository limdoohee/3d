import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Store
import Store from "../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const {} = props;
    const router = useRouter();

    return <>INDEX</>;
});

export default Home;
