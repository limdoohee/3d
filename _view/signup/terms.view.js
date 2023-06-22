("use client");
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Antd
import { Checkbox, Space } from "antd-mobile";
import { Drawer } from "antd";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
//------------------------------------------------------------------------------- Component
const Home = observer((props) => {
    const { store } = props;
    const router = useRouter();
    const { common, lang } = store;

    //------------------------------------------------- Init Load
    const initLoad = ({ callback }) => {
        callback && callback();
    };
    //------------------------------------------------- Init Load
    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/signup/terms") {
            initLoad({
                callback: (e) => {},
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady
    const [open, setOpen] = useState(false);
    const [policySelect, setpolicySelect] = useState(0);

    const handleListClick = (idx) => {
        setpolicySelect(idx);
        setOpen(true);
    };

    // Checked Function
    const [checkAll, setcheckAll] = useState(false);
    const [checkedValue, setcheckedValue] = useState({ policy: false, private: false, marketing: false });
    useEffect(() => {
        var c = true;
        for (const key in checkedValue) {
            checkedValue[key] == false && (c = false);
        }
        setcheckAll(c);
    }, [checkedValue.policy, checkedValue.private, checkedValue.marketing]);
    const onCheckedAll = (e) => {
        setcheckAll(e);
        setcheckedValue({ policy: e, private: e, marketing: e });
    };
    // Checked Function
    const checkKeyArray = ["policy", "private", "marketing"];

    const nextStep = async () => {
        await sessionStorage.setItem("signupMarketing", checkedValue.marketing ? "Y" : "N");
        await router.push("/signup/nickname");
    };

    return (
        <>
            <DDS.layout.back className={"fluid"} store={store}>
                <div className="auth ui terms">
                    <h2>{lang.t(`signup.terms.title`)}</h2>
                    <div className="agree-list ">
                        <h4>
                            <DDS.checkbox.default checked={checkAll} onChange={onCheckedAll}>
                                {lang.t(`signup.terms.all`)}
                            </DDS.checkbox.default>
                        </h4>
                        <ul className="policy">
                            {checkKeyArray.map((item, key) => (
                                <li key={key}>
                                    <DDS.checkbox.default
                                        checked={checkedValue[checkKeyArray[key]]}
                                        onChange={(e) => {
                                            var obj = {};
                                            obj[checkKeyArray[key]] = e;
                                            setcheckedValue((prev) => ({ ...prev, ...obj }));
                                        }}
                                    >
                                        {lang.t(`signup.terms.list${key + 1}`)}
                                    </DDS.checkbox.default>
                                    <DDS.icons.angleRight
                                        onClick={() => {
                                            handleListClick(key);
                                        }}
                                    />
                                </li>
                            ))}
                        </ul>
                        <SignupDrawer open={open} setOpen={setOpen} policySelect={policySelect} lang={lang} />
                    </div>
                    <DDS.button.default className="agree-check" disabled={checkedValue.policy && checkedValue.private ? false : true} onClick={nextStep}>
                        {lang.t(`signup.terms.check`)}
                    </DDS.button.default>
                </div>
            </DDS.layout.back>
        </>
    );
});

export default Home;

// ---------------------------------------------------------------- drawer

export const SignupDrawer = observer((props) => {
    const { open, setOpen, policySelect, lang } = props;

    const onClose = () => {
        setOpen(false);
    };

    return (
        <Drawer className="modal agreement" placement={"right"} closable={false} onClose={onClose} open={open} width={1500}>
            <div>
                <DDS.icons.angleLeft
                    onClick={() => {
                        setOpen(false);
                    }}
                />
                <h3>{lang.t(`signup.list${policySelect + 1}.title`)}</h3>
            </div>
            <div className="terms">
                <p>{lang.t(`signup.list${policySelect + 1}.desc`)}</p>
            </div>
        </Drawer>
    );
});
