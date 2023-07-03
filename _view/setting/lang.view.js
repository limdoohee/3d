import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Module

const Home = observer((props) => {
    const { store } = props;
    const { common, lang } = store;
    const router = useRouter();

    //------------------------------------------------- Init Load
    const initLoad = () => {};
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/setting") {
            common.getBuildId();
            initLoad({
                callback: () => {},
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    return (
        <DDS.layout.container className={"fluid"} store={store} pageMotion={true}>
            <DK_template_header.default store={store} title={lang.t("setting.account.language.title")} r />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                <div className="page-setting sub">
                    <dl className="none">
                        <dd
                            className="none"
                            onClick={() => {
                                lang.changeLanguage("ko");
                            }}
                        >
                            <h4>
                                <span>한국어</span>
                            </h4>
                            {lang.i18n.language == "ko" && (
                                <span>
                                    <DDS.icons.check className={"dds icons checked"} />
                                </span>
                            )}
                        </dd>
                        <dd
                            className="none"
                            onClick={() => {
                                lang.changeLanguage("en");
                            }}
                        >
                            <h4>
                                <span>English</span>
                            </h4>
                            {lang.i18n.language == "en" && (
                                <span>
                                    <DDS.icons.check className={"dds icons checked"} />
                                </span>
                            )}
                        </dd>
                    </dl>
                    <div className="save">
                        <DDS.button.default
                            className="dds button primary block large"
                            onClick={() => {
                                history.back();
                            }}
                        >
                            {lang.t(`common.check`)}
                        </DDS.button.default>
                    </div>
                </div>
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;
