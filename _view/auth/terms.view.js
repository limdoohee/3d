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
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const {} = props;
    const router = useRouter();
    const { t, i18n } = useTranslation();

    const items = Array.from({ length: 3 }, (_, idx) => t(`auth.terms.list${idx + 1}`));

    const [value, setValue] = useState([""]);
    const [isChecked, setIsChecked] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedList, setSelectedList] = useState({});

    useEffect(() => {
        setIsChecked(value.includes(items[0]) && value.includes(items[1]));
    }, [value]);

    // //////////////////////////////////////////////////////////////////
    const onClose = () => {
        setOpen(false);
    };
    const handleListClick = (list, idx) => {
        setSelectedList({
            title: t(`auth.list${idx + 1}.title`),
            desc: t(`auth.list${idx + 1}.desc`),
        });
        setOpen(true);
    };
    return (
        <>
            <div className="auth ui terms">
                <h2>{t(`auth.terms.title`)}</h2>
                <div className="agree-list ">
                    <Checkbox
                        className="all"
                        indeterminate={value.length > 0 && value.length < items.length}
                        // checked={value.length == items.length}
                        icon={() =>
                            items.length == value.length ? <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230602093509971_dk.webp" /> : <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230602093522455_dk.webp" />
                        }
                        onChange={(checked) => {
                            if (checked) {
                                setValue(items);
                            } else {
                                setValue([]);
                            }
                        }}
                    >
                        {t(`auth.terms.all`)}
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
                                    <>
                                        <Checkbox
                                            key={idx + 1}
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
                                    </>
                                ))}
                            </Space>
                        </Checkbox.Group>
                    </div>
                </div>
                <Component.default
                    className="agree-check"
                    disabled={!isChecked}
                    onClick={() => {
                        Router.push("/auth/nickname");
                    }}
                >
                    {t(`auth.terms.check`)}
                </Component.default>
            </div>
        </>
    );
});

export default Home;
