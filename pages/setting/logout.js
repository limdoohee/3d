import React, { useEffect } from "react";
import cookie from "react-cookies";

const Home = () => {
    useEffect(() => {
        const logout = async (callback) => {
            await cookie.remove("loginToken", { path: "/" });
            await sessionStorage.clear();
            // await localStorage.clear();
            callback();
        };
        logout(() => {
            location.href = "/";
        });
    }, []);
    return <></>;
};

export default Home;
