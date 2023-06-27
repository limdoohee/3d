import React, { useEffect } from "react";
import cookie from "react-cookies";

const Home = () => {
    useEffect(() => {
        const logout = async () => {
            await cookie.remove("loginToken", { path: "/" });
            // await Router.push("/");
            location.href = "/";
        };
        logout();
    }, []);
    return <></>;
};

export default Home;
