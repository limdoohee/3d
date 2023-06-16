("use client");
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import "../../_lib/module/i18n";
import { useTranslation } from "react-i18next";

//------------------------------------------------------------------------------- Antd
import { Checkbox, Space } from "antd-mobile";
import { Drawer } from "antd";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
import Component from "../../_lib/component/button";
import DDS_Icons from "../../_lib/component/icons";
//------------------------------------------------------------------------------- Component
const Home = observer((props) => {
    const router = useRouter();
    const { t, i18n } = useTranslation();

    //------------------------------------------------- Init Load
    const initLoad = ({ callback }) => {
        callback && callback();
    };
    //------------------------------------------------- Init Load
    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/signup/terms") {
            initLoad({
                callback: (e) => {
                    const translateSet = sessionStorage.getItem("LangValue");
                    if (translateSet) {
                        i18n.changeLanguage(translateSet);
                    }
                },
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    const items = Array.from({ length: 3 }, (_, idx) => t(`signup.terms.list${idx + 1}`));
    const [saveValue, setSaveValue] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedList, setSelectedList] = useState({});
    const [value, setValue] = useState([]);

    useEffect(() => {
        setSaveValue(value.includes(items[0]) && value.includes(items[1]));

        const termsValue = value.includes(items[2]) ? "Y" : "N";
        sessionStorage.setItem("IsTermsValue", termsValue);
    }, [value]);

    const handleListClick = (list, idx) => {
        setSelectedList({
            title: t(`signup.list${idx + 1}.title`),
            desc: t(`signup.list${idx + 1}.desc`),
        });
        setOpen(true);
    };

    return (
        <>
            <div className="auth ui terms">
                <h2>{t(`signup.terms.title`)}</h2>
                <div className="agree-list ">
                    <Checkbox
                        className="all"
                        icon={() => (items.length == value.length ? <DDS_Icons.check className="checked" /> : <DDS_Icons.checkEmpty className="unchecked" />)}
                        indeterminate={false}
                        checked={value.length === items.length}
                        onChange={(checked) => {
                            if (checked) {
                                setValue(items);
                            } else {
                                setValue([]);
                            }
                        }}
                    >
                        {t(`signup.terms.all`)}
                    </Checkbox>
                    <div className="each">
                        <Checkbox.Group
                            value={value}
                            onChange={(v) => {
                                setValue(v);
                            }}
                        >
                            <Space direction="vertical">
                                {items.map((item, idx) => (
                                    <React.Fragment key={idx}>
                                        <Checkbox key={idx} value={item} icon={(checked) => (checked ? <DDS_Icons.check className="checked" /> : <DDS_Icons.checkEmpty className="unchecked" />)}>
                                            {item}
                                        </Checkbox>
                                        <DDS_Icons.angleRight className="next" onClick={() => handleListClick(item, idx)} />
                                        <SignupDrawer open={open} setOpen={setOpen} selectedList={selectedList} />
                                    </React.Fragment>
                                ))}
                            </Space>
                        </Checkbox.Group>
                    </div>
                </div>
                <Component.default
                    className="agree-check"
                    disabled={!saveValue}
                    onClick={() => {
                        router.push("/signup/nickname");
                    }}
                >
                    {t(`signup.terms.check`)}
                </Component.default>
            </div>
        </>
    );
});

export default Home;

// ---------------------------------------------------------------- drawer

export const SignupDrawer = observer((props) => {
    const { open, setOpen, selectedList } = props;

    const onClose = () => {
        setOpen(false);
    };

    return (
        <Drawer className="modal agreement" placement={"right"} closable={false} onClose={onClose} open={open} width={1500}>
            <div>
                <DDS_Icons.angleLeft
                    onClick={() => {
                        setOpen(false);
                    }}
                />
                {<h3>{selectedList.title}</h3>}
            </div>
            <div className="terms">
                {<h2>{selectedList.title}</h2>}
                <p>{selectedList.desc}</p>
            </div>
        </Drawer>
    );
});
