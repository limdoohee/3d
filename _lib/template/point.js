import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import moment from "moment";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Component
import { Drawer } from "antd";
import DDS from "../../_lib/component/dds";
//------------------------------------------------------------------------------- Component

const Home = {
    default: observer((props) => {
        const router = useRouter();
        const { store } = props;
        const { common, lang, auth, point } = props.store;

        //------------------------------------------------- Init Load
        const initLoad = ({ callback }) => {
            const params = {};
            point.pointHistory(params, (e) => {
                common.debug(e);
                callback && callback(e);
            });
        };
        //------------------------------------------------- Init Load
        //------------------------------------------------- Router isReady
        useEffect(() => {
            if (router.isReady && router.pathname == "/point") {
                common.getBuildId();
                initLoad({
                    callback: (e) => {},
                });
            }
        }, [router.isReady, router.asPath]);
        //------------------------------------------------- Router isReady

        const [tabKey, settabKey] = useState(0);

        useEffect(() => {
            return () => {
                onClose();
            };
        }, [router.asPath]);

        const onClose = () => {
            common.uiChange("pointOpen", false);
        };

        const items = [
            {
                key: 0,
                label: lang.t("point.tabs.information"),
                children: <PointInformation store={store} />,
            },
            {
                key: 1,
                label: lang.t("point.tabs.history"),
                children: <PointList store={store} tabKey={tabKey} />,
            },
        ];

        const onChange = (e) => {
            // console.log(e);
            settabKey(e);
        };

        const migratePoint = () => {
            const params = {};
            point.migratePoint(params, (e) => {
                common.debug(e);
                initLoad({
                    callback: (e) => {},
                });
            });
        };

        return (
            <>
                <div className="dk point">
                    <div className="title">
                        <div>
                            <DDS.button.default className="dds button none" icon={<DDS.icons.angleLeft />} onClick={onClose} />
                        </div>
                        <h4>{lang.t("point.title")}</h4>
                        <div>
                            <DDS.button.default className="dds button none">{lang.t("point.information")}</DDS.button.default>
                        </div>
                    </div>
                    <div className="my-point">
                        <p>{lang.t("point.myPoints")}</p>
                        <h3>
                            <small>
                                <DDS.icons.point />
                            </small>
                            <strong>{common.numberFormat(auth.loginResult.pointAmount)}</strong>
                        </h3>
                        {point.data.pointHistory.migrateFlag && (
                            <div className="connect">
                                <DDS.button.default className="dds button primary" onClick={migratePoint}>
                                    이전 포인트 연동
                                </DDS.button.default>
                                <p>보유하신 포인트는 1:1로 연동됩니다.</p>
                            </div>
                        )}
                    </div>
                    <DDS.tabs.default defaultActiveKey={tabKey === 0 ? "0" : tabKey} items={items} onChange={onChange} />
                </div>
            </>
        );
    }),
};

export default Home;

const PointInformation = observer((props) => {
    const { common, lang, auth } = props.store;
    return (
        <>
            <div className="point-information">
                <h3>드롭키친 포인트 안내</h3>
                <ul>
                    <li>
                        <DDS.icons.badgeCheck className="dds icon large" />
                        <span className="desc">회원가입 시</span>
                        <strong>5,000P</strong>
                    </li>
                    <li>
                        <DDS.icons.drop className="dds icon large" />
                        <span className="desc">디지털 아트 획득 시</span>
                        <strong>1,000P</strong>
                    </li>
                    <li>
                        <DDS.icons.userGroup className="dds icon large" />
                        <span className="desc">
                            <dl>
                                <dt>초대 링크로 친구 가입 시</dt>
                                <dd>1-20회 초대 시 2,000P 지급</dd>
                                <dd>21회 이상 초대 시 200P 지급</dd>
                            </dl>
                        </span>
                        <strong>
                            2,000P
                            <DDS.button.default
                                className="dds button primary"
                                onClick={() => {
                                    common.onShare({
                                        url: auth.loginResult.inviteLink,
                                        callback: () => {
                                            common.messageApi.open({
                                                type: "success",
                                                content: "초대링크를 복사 하였습니다.",
                                            });
                                        },
                                    });
                                }}
                            >
                                초대하기
                            </DDS.button.default>
                        </strong>
                    </li>
                    <li>
                        <DDS.icons.crown className="dds icon large" />
                        <span className="desc">
                            <dl>
                                <dt>디지털 아트 30개 획득 시</dt>
                                <dd>선착순 300명에게 100,000P 지급</dd>
                            </dl>
                        </span>
                        <strong>100,000P</strong>
                    </li>
                </ul>
                <ol>
                    <li>
                        <h4>
                            <strong>1</strong> 적립
                        </h4>
                        <dl>
                            <dd>드롭 획득, 이벤트 참여 등을 통해 포인트를 적립 받을 수 있습니다.</dd>
                            <dd>적립 기준은 항목마다 상이합니다.</dd>
                        </dl>
                    </li>
                    <li>
                        <h4>
                            <strong>2</strong> 사용/유효기간
                        </h4>
                        <dl>
                            <dd>적립 포인트는 명시한 유효기간을 따르며 별도 명시가 없으면 지급일로 부터 1년간 유효합니다.</dd>
                        </dl>
                    </li>
                    <li>
                        <h4>
                            <strong>3</strong> 소멸
                        </h4>
                        <dl>
                            <dd>아이디가 휴면계정 처리되거나 탈퇴할 경우, 포인트는 소멸됩니다.</dd>
                        </dl>
                    </li>
                </ol>
            </div>
        </>
    );
});

const PointList = observer((props) => {
    const router = useRouter();
    const { tabKey } = props;
    const { common, lang, point } = props.store;
    return (
        <>
            <ul className="point-list">
                {point.data.pointHistory.point.map((item, key) => {
                    return (
                        <React.Fragment key={key}>
                            <li>
                                <div>
                                    <strong>{item.description}</strong>
                                    {/* <span>{item.description}</span> */}
                                </div>
                                <div>
                                    <strong className={item.pointAmount > 0 ? "plus" : ""}>{common.numberFormat(parseInt(item.pointAmount))}</strong>
                                    <span>{moment(item.createdAt).format("YYYY.MM.DD")}</span>
                                </div>
                            </li>
                        </React.Fragment>
                    );
                })}
            </ul>
        </>
    );
});
