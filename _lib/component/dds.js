import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import button from "../../_lib/component/button";
import chat from "../../_lib/component/chat";
import icons from "../../_lib/component/icons";
import input from "../../_lib/component/input";
import layout from "../../_lib/component/layout";
import logos from "../../_lib/component/logos";
import profile from "../../_lib/component/profile";
import tabs from "../../_lib/component/tabs";
//------------------------------------------------------------------------------- Component

const Home = {
    button: button,
    chat: chat,
    icons: icons,
    input: input,
    layout: layout,
    logos: logos,
    profile: profile,
    tabs: tabs,
};

export default Home;