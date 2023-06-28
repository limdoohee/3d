import React, { useEffect } from "react";
import cookie from "react-cookies";

const Home = () => {
    useEffect(() => {
        const logout = async () => {
            await cookie.remove("loginToken", { path: "/" });
            location.href = "/";
        };
        logout();
    }, []);
    return <></>;
};

export default Home;
