import { useRouter } from "next/router";
import React from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../_lib/component/dds";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { store } = props;
    const { common, lang, auth } = store;
    const router = useRouter();

    React.useEffect(() => {
        common.getBuildId();

        common.debug(auth.loginResult);
    }, []);

    return (
        <DDS.layout.container store={store}>
            <div className="dk error">
                <div className="center">
                    <h3>Oops...</h3>
                    <p>
                        {lang.t("error.404.description1")}
                        <br />
                        {lang.t("error.404.description2")}
                    </p>
                </div>
                <div className="bottom">
                    <DDS.button.default
                        className={"dds button primary block"}
                        onClick={() => {
                            history.back();
                        }}
                    >
                        {lang.t("error.404.historyBack")}
                    </DDS.button.default>
                </div>
            </div>
        </DDS.layout.container>
    );
});

export default Home;
