import { useRouter } from "next/router";
import React from "react";
import cookie from "react-cookies";
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
const { common, auth } = store;
//------------------------------------------------------------------------------- Store

const Home = () => {
    const router = useRouter();
    console.log(router.query);

    if (router.query.token) {
        auth.checkLoginJwt(router.query.token, async (e) => {
            common.debug(e);
            e.currentLoginSocial && localStorage.setItem("recentLogin", e.currentLoginSocial);
            if (e.result) {
                await cookie.remove("loginToken", { path: "/" });
                await cookie.save("loginToken", router.query.token, { path: "/" });
                location.href = "/";
            }
        });
    } else {
        <></>;
    }
    return <></>;
};

export default Home;
