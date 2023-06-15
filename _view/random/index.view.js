import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { store } = props;
    const { common, lang, auth } = store;
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState(1);

    const addComma = (val) => {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    useEffect(() => {
        common.getBuildId();

        common.debug(auth.loginResult);
    }, []);

    const test = () => {
        return (
            <ul className="buyRandomBox">
                <li>
                    <div className="box">
                        <img src={`../../static/img/randomBox.png`} alt="randomBox" />
                        <ul>
                            <h6>랜덤박스</h6>
                            <li className="boxPoint">
                                <DDS.icons.point />
                                1,200
                            </li>
                        </ul>
                    </div>
                    <div className="option">
                        <DDS.icons.minus onClick={() => setAmount(amount - 1)} />
                        <span className="amount">{amount}</span>
                        <DDS.icons.plus onClick={() => setAmount(amount + 1)} />
                    </div>
                </li>
                <li className="point">
                    <h5>보유 포인트</h5>
                    <h6>{addComma(4781)}P</h6>
                </li>
                <li className="price">
                    <h5>총 결제 포인트</h5>
                    <h6>{addComma(3600)}P</h6>
                </li>
            </ul>
        );
    };
    const modalData = {
        open: open,
        setOpen: setOpen,
        title: "랜덤박스 구매하기",
        context: test(),
        confirm: {
            label: "바로 구매",
            action: () => {
                // Router.push("/gallery");
                console.log("바로 구매");
            },
        },
        cancel: {
            label: "닫기",
            action: () => {},
        },
    };

    return (
        <DDS.layout.container>
            <DK_template_header.default store={store} title={lang.t("random.title")} />
            {/* Content */}
            <DDS.layout.content>
                <div className="random">
                    <div className="voucher">
                        <img src={`../../static/img/randomBox.png`} alt="randomBox" />
                        <span>2</span>
                        <div className="chips">N</div>
                    </div>
                    <div className="bottom">
                        <h2>{lang.t("random.desc")}</h2>
                        <div className="btnContainer">
                            <DDS.button.default
                                className="dds button secondary"
                                onClick={() => {
                                    setOpen(true);
                                }}
                            >
                                구매하기
                            </DDS.button.default>
                            <DDS.button.default className="dds button primary">랜덤박스 열기</DDS.button.default>
                        </div>
                    </div>
                </div>
            </DDS.layout.content>
            <DDS.modal.bottom {...modalData} />
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;
