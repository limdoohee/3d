import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const router = useRouter();
    const { store } = props;
    const { common, lang, auth, gallery } = store;
    const [modalOpen, setModalOpen] = useState(false);
    const [amount, setAmount] = useState(1);
    const [buyingAmount, setBuyingAmount] = useState(0);
    const [descDisabled, setDescDisabled] = useState(false);
    const [incrDisabled, setIncrDisabled] = useState(false);
    const [helper, setHelper] = useState(false);
    const [boxOpen, setBoxOpen] = useState(false);

    //------------------------------------------------- Init Load
    const initLoad = ({ initCheck, callback }) => {
        gallery.getLuckyBox("", (e) => {
            setBuyingAmount(gallery.luckyBox.length);
            callback && callback(e);
        });
        gallery.getData({ sendbirdId: "dropkitchen_member_" + auth.loginResult.seq }, (e) => {
            // common.debug(e);
            callback && callback(e);
        });
    };
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/random") {
            initLoad({
                callback: (e) => {},
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

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
        if ((amount + 1) * 1500 <= auth.loginResult.pointAmount) {
            setAmount(amount + 1);
            setDescDisabled(false);
            setIncrDisabled(false);
            if (auth.loginResult.pointAmount <= (amount + 2) * 1500) {
                setIncrDisabled(true);
            }
        } else {
            setIncrDisabled(true);
        }
    }

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
                    <h6>{common.numberFormat(auth.loginResult.pointAmount)}P</h6>
                </li>
                <li className="payment">
                    <h5>{lang.t("random.modal.payment")}</h5>
                    <h6>{common.numberFormat(amount * 1500)}P</h6>
                </li>
                <li className={`helper ${helper ? "on" : ""}`}>
                    <DDS.icons.circleExclamation />
                    {lang.t("random.modal.helper")}
                </li>
            </ul>
        );
    };

    const modalData = {
        open: modalOpen,
        setOpen: setModalOpen,
        title: lang.t("random.modal.title"),
        context: buyingModal(),
        confirm: {
            label: lang.t("random.modal.confirm"),
            close:
                auth.loginResult.pointAmount < 1500 &&
                (() => {
                    setHelper(true);
                }),
            action: () => {
                auth.loginResult.pointAmount >= 1500 &&
                    gallery.buyLuckyBox({ amount }, (e) => {
                        setBuyingAmount(gallery.luckyBox.length + amount);
                        e.id === "ok" &&
                            common.messageApi.open({
                                className: "buyingMessage",
                                content: "랜덤박스 구매가 완료되었습니다.",
                            });
                    });
            },
        },
        cancel: {
            label: lang.t("random.modal.close"),
            action: () => {},
        },
    };

    const Text = () => {
        return boxOpen ? (
            <>
                <h2>{lang.t("random.drop.title")}</h2>
                <h3>{lang.t("random.drop.desc")}</h3>
            </>
        ) : (
            <h2>{lang.t("random.desc")}</h2>
        );
    };

    return (
        <DDS.layout.container store={store}>
            <DK_template_header.default store={store} title={lang.t("random.title")} />
            <DDS.layout.content>
                <div className="random">
                    <div className="voucher">
                        <img src={`../../static/img/randomBox.png`} alt="randomBox" />
                        <span>{buyingAmount}</span>
                        {gallery.data.unconfirmedLuckyBox && <div className="chips">N</div>}
                    </div>
                    <div className="bottom">
                        <Text />
                        <div className="ddsBtnWrapper">
                            <DDS.button.default
                                className={`dds button ${gallery.luckyBox.length > 0 ? "secondary" : "primary"}`}
                                onClick={() => {
                                    boxOpen ? router.push("userGallery?memberSeq=" + auth.loginResult.seq) : setModalOpen(true);
                                }}
                            >
                                {boxOpen ? "받은 드롭 보기" : "구매하기"}
                            </DDS.button.default>
                            {/* {gallery.luckyBox.length > 0 && ( */}
                            <DDS.button.default
                                className="dds button primary"
                                onClick={() => {
                                    boxOpen
                                        ? setBoxOpen(false)
                                        : gallery.data.totalDropCnt === gallery.data.myDropCnt
                                        ? common.messageApi.open({
                                              icon: <DDS.icons.circleExclamation />,
                                              className: "arMessage",
                                              content: "이미 모든 드롭을 보유하고 있습니다.",
                                          })
                                        : setBoxOpen(true);
                                }}
                            >
                                {boxOpen ? "확인" : "랜덤박스 열기"}
                            </DDS.button.default>
                        </div>
                    </div>
                </div>
            </DDS.layout.content>
            <DDS.modal.bottom {...modalData} />
        </DDS.layout.container>
    );
});

export default Home;
