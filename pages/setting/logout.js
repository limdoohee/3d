import React, { useEffect } from "react";
import cookie from "react-cookies";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store

const Home = () => {
    const { auth } = store;
    useEffect(() => {
        const logout = (callback) => {
            auth.logout({}, async (e) => {
                if (e.id === "ok") {
                    await cookie.remove("loginToken", { path: "/" });
                    await sessionStorage.clear();
                    // await localStorage.clear();
                    callback();
                }
            });
        };
        logout(() => {
            location.href = "/";
        });
    }, []);
    return <></>;
};

export default Home;
