import { useRouter } from "next/router";
import React from "react";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
const { common, auth } = store;
//------------------------------------------------------------------------------- Store

const Home = () => {
    const router = useRouter();
    console.log(router.query);

    if (router.query.email && router.query.clientId) {
        auth.checkLoginJwt(router.query.email && router.query.clientId, async (e) => {
            common.debug(e);
            sessionStorage.removeItem("loginToken");

            sessionStorage.setItem("loginEmail", router.query.email);
            sessionStorage.setItem("loginClientId", router.query.clientId);
            router.push("/signup/terms");
        });
    } else {
        if (router.query.errorCode) {
            auth.errorCode({ code: router.query.errorCode }, (e) => {
                alert(e.error);
                router.push("/login");
            });
        }
    }

    return <></>;
};

export default Home;
