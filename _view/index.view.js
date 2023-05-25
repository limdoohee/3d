import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const {} = props;
    const router = useRouter();

    return <>INDEX</>;
});

export default Home;
