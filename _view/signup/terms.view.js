("use client");
import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import "../../_lib/module/i18n";
import { useTranslation } from "react-i18next";
import Component from "../../_lib/component/button";
import { useDrag } from "@use-gesture/react";
import { a, useSpring, config } from "@react-spring/web";
import Layout from "../../_lib/component/layout";

//------------------------------------------------------------------------------- Antd
import { Checkbox, Space, Button } from "antd-mobile";
import { Drawer } from "antd";
import { Fragment } from "react";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Component
const CheckboxGroup = Checkbox.Group;
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

    const onClose = () => {
        setOpen(false);
    };
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
                        icon={() =>
                            items.length == value.length ? <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230602093509971_dk.webp" /> : <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230602093522455_dk.webp" />
                        }
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
                                        <Checkbox
                                            key={idx}
                                            value={item}
                                            icon={(checked) =>
                                                checked ? <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230602093509971_dk.webp" /> : <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230602093522455_dk.webp" />
                                            }
                                        >
                                            {item}
                                        </Checkbox>
                                        <span onClick={() => handleListClick(item, idx)}>
                                            <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230601162101262_dk.webp" />
                                        </span>
                                        <Drawer className="modal agreement" placement={"right"} closable={false} onClose={onClose} open={open} width={1500}>
                                            <div
                                                onClick={() => {
                                                    setOpen(false);
                                                }}
                                            >
                                                <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230601154911889_dk.webp" />
                                                {<h3>{selectedList.title}</h3>}
                                            </div>
                                            <div className="terms">
                                                {<h2>{selectedList.title}</h2>}
                                                <p>{selectedList.desc}</p>
                                            </div>
                                        </Drawer>
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
                        Router.push("/signup/nickname");
                    }}
                >
                    {t(`signup.terms.check`)}
                </Component.default>
            </div>
        </>
    );
});

export default Home;
