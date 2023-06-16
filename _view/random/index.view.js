import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
//------------------------------------------------------------------------------- Component
import { message } from "antd";
const Home = observer((props) => {
    const [messageApi, contextHolder] = message.useMessage();

    const { store } = props;
    const { common, lang, auth } = store;
    const randomBox = 2;
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState(1);
    const [descDisabled, setDescDisabled] = useState(false);
    const [incrDisabled, setIncrDisabled] = useState(false);
    const [helper, setHelper] = useState(false);
    const ref = useRef(null);

    const addComma = (val) => {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    function decrementCount() {
        if (amount != 1) {
            setAmount(amount - 1);
            setIncrDisabled(false);
            setDescDisabled(false);
            if (amount - 2 === 0) {
                setDescDisabled(true);
            }
        } else {
            setDescDisabled(true);
        }
    }
    function incrementCount() {
        if ((amount + 1) * 1500 <= 6000) {
            setAmount(amount + 1);
            setDescDisabled(false);
            setIncrDisabled(false);
            if (6000 <= (amount + 2) * 1500) {
                setIncrDisabled(true);
            }
        } else {
            setIncrDisabled(true);
        }
    }

    useEffect(() => {
        decrementCount();
        incrementCount();
        common.getBuildId();

        common.debug(auth.loginResult);
    }, []);

    const buyingModal = () => {
        return (
            <ul className="buyRandomBox">
                <li>
                    <div className="box">
                        <img src={`../../static/img/randomBox.png`} alt="randomBox" />
                        <ul>
                            <h6>{lang.t("random.modal.boxName")}</h6>
                            <li className="boxPoint">
                                <DDS.icons.point />
                                1,500
                            </li>
                        </ul>
                    </div>
                    <div className="option">
                        <DDS.icons.minus onClick={decrementCount} className={descDisabled ? "disabled" : ""} />
                        <span className="amount">{amount}</span>
                        <DDS.icons.plus onClick={incrementCount} className={incrDisabled ? "disabled" : ""} />
                    </div>
                </li>
                <li className="point">
                    <h5>{lang.t("random.modal.point")}</h5>
                    <h6>{addComma(900)}P</h6>
                </li>
                <li className="payment">
                    <h5>{lang.t("random.modal.payment")}</h5>
                    <h6>{addComma(amount * 1500)}P</h6>
                </li>
                <li className={`helper ${helper ? "on" : ""}`}>
                    <DDS.icons.circleExclamation />
                    {lang.t("random.modal.helper")}
                </li>
            </ul>
        );
    };

    const modalData = {
        open: open,
        setOpen: setOpen,
        title: lang.t("random.modal.title"),
        context: buyingModal(),
        confirm: {
            label: lang.t("random.modal.confirm"),
            action: () => {
                // Router.push("/gallery");
                buyingCallback();
            },
            close: descDisabled && incrDisabled && (() => {}),
        },
        cancel: {
            label: lang.t("random.modal.close"),
            action: () => {},
        },
    };

    const buyingCallback = () => {
        ref.current.open();
    };

    const messageData = {
        className: "buyingMessage",
        content: "랜덤박스 구매가 완료되었습니다.",
    };

    return (
        <DDS.layout.container>
            {/* {contextHolder} */}
            <DK_template_header.default store={store} title={lang.t("random.title")} />
            {/* Content */}
            <DDS.layout.content>
                <div className="random">
                    <div className="voucher">
                        <img src={`../../static/img/randomBox.png`} alt="randomBox" />
                        <span>{randomBox}</span>
                        <div className="chips">N</div>
                    </div>
                    <div className="bottom">
                        <h2>{lang.t("random.desc")}</h2>
                        <div className="btnContainer">
                            <DDS.button.default
                                className={`dds button ${randomBox > 0 ? "secondary" : "primary"}`}
                                onClick={() => {
                                    setOpen(true);
                                }}
                            >
                                구매하기
                            </DDS.button.default>
                            {randomBox > 0 && <DDS.button.default className="dds button primary">랜덤박스 열기</DDS.button.default>}
                        </div>
                    </div>
                    <DDS.message ref={ref} {...messageData} />
                </div>
            </DDS.layout.content>
            <DDS.modal.bottom {...modalData} />
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;
