import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import moment from "moment";
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
//------------------------------------------------------------------------------- Component

const Home = {
    default: observer((props) => {
        const router = useRouter();
        const { store } = props;
        const { common, lang, auth, point } = props.store;
        const [migrateFlag, setMigrateFlag] = useState(false);
        const [open, setOpen] = useState(false);

        //------------------------------------------------- Init Load
        const initLoad = ({ callback }) => {
            const params = {};
            point.pointHistory(params, (e) => {
                common.debug(e);
                e.migrateFlag && setMigrateFlag(e.migrateFlag);
                callback && callback(e);
            });
        };
        //------------------------------------------------- Init Load
        //------------------------------------------------- Router isReady
        useEffect(() => {
            if (router.isReady && router.pathname == "/point") {
                common.getBuildId();
                initLoad({
                    callback: () => {},
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

        const modalData = {
            open: open,
            setOpen: setOpen,
            title: lang.t("point.modal.title"),
            context: lang.t("point.modal.desc"),
            confirm: {
                label: lang.t("point.modal.cta"),
                action: () => {},
                close: () => {
                    setOpen(false);
                    location.href = "/point";
                },
            },
        };

        const migratePoint = () => {
            const params = {};
            setOpen(true);
            point.migratePoint(params, (e) => {
                common.debug(e);
            });
        };

        const MigratePoint = () => {
            return (
                <div className="connect">
                    <DDS.button.default className="dds button primary" onClick={migratePoint}>
                        {lang.t("point.connection.title")}
                    </DDS.button.default>
                    <p>{lang.t("point.connection.desc")}</p>
                </div>
            );
        };

        return (
            <>
                <div className="dk point">
                    <div className="my-point">
                        <p>{lang.t("point.myPoints")}</p>
                        <h3>
                            <small>
                                <DDS.icons.point />
                            </small>
                            <strong>{common.numberFormat(auth.loginResult.pointAmount)}</strong>
                        </h3>
                        {migrateFlag && <MigratePoint />}
                    </div>
                    <DDS.tabs.default defaultActiveKey={tabKey === 0 ? "0" : tabKey} items={items} onChange={onChange} className="pointTabs" />
                    <DDS.modal.center {...modalData} />
                </div>
            </>
        );
    }),
};

export default Home;

const PointInformation = observer((props) => {
    const { lang, auth } = props.store;
    const [open, setOpen] = useState(false);

    const modalData = {
        open: open,
        setOpen: setOpen,
        img: "https://asset.dropkitchen.xyz/contents/202307_dev/20230703164613868_dk.webp",
        title: lang.t("gallery.modal.title"),
        context: lang.t("gallery.modal.context"),
        subContext: "(" + lang.t("gallery.modal.subContext") + ")",
        confirm: {
            label: lang.t("gallery.modal.confirm"),
            action: () => {
                window.location.href = "native://share?contents=" + encodeURI(auth.loginResult.inviteLink);
            },
        },
        cancel: {
            label: lang.t("gallery.modal.close"),
            action: () => {},
        },
    };

    return (
        <>
            <div className="point-information">
                <h3>{lang.t("point.tab1.title")}</h3>
                <ul>
                    <li>
                        <DDS.icons.badgeCheck className="dds icon large" />
                        <span className="desc">{lang.t("point.tab1.signup")}</span>
                        <strong>5,000P</strong>
                    </li>
                    <li>
                        <DDS.icons.drop className="dds icon large" />
                        <span className="desc">{lang.t("point.tab1.drop")}</span>
                        <strong>1,000P</strong>
                    </li>
                    <li>
                        <DDS.icons.userGroup className="dds icon large" />
                        <span className="desc">
                            <dl>
                                <dt>{lang.t("point.tab1.invite.title")}</dt>
                                <dd>{lang.t("point.tab1.invite.subText1")}</dd>
                                <dd>{lang.t("point.tab1.invite.subText2")}</dd>
                            </dl>
                        </span>
                        <strong>
                            2,000P
                            <DDS.button.default
                                className="dds button primary"
                                onClick={() => {
                                    setOpen(true);
                                }}
                            >
                                {lang.t("point.tab1.invite.btn")}
                            </DDS.button.default>
                        </strong>
                    </li>
                    <li>
                        <DDS.icons.crown className="dds icon large" />
                        <span className="desc">
                            <dl>
                                <dt>{lang.t("point.tab1.collect30.title")}</dt>
                                <dd>{lang.t("point.tab1.collect30.subText1")}</dd>
                            </dl>
                        </span>
                        <strong>100,000P</strong>
                    </li>
                </ul>
                <ol>
                    <li>
                        <h4>
                            <strong>1</strong> {lang.t("point.tab1.accumulated.title")}
                        </h4>
                        <dl>
                            <dd>{lang.t("point.tab1.accumulated.subText1")}</dd>
                            <dd>{lang.t("point.tab1.accumulated.subText2")}</dd>
                        </dl>
                    </li>
                    <li>
                        <h4>
                            <strong>2</strong> {lang.t("point.tab1.period.title")}
                        </h4>
                        <dl>
                            <dd>{lang.t("point.tab1.period.subText1")}</dd>
                        </dl>
                    </li>
                    <li>
                        <h4>
                            <strong>3</strong> {lang.t("point.tab1.expiration.title")}
                        </h4>
                        <dl>
                            <dd>{lang.t("point.tab1.expiration.subText1")}</dd>
                        </dl>
                    </li>
                </ol>
            </div>
            <DDS.modal.bottom {...modalData} />
        </>
    );
});

const PointList = observer((props) => {
    const { common, lang, point } = props.store;
    const [sortValue, setsortValue] = useState("All");
    const [sortOpen, setsortOpen] = useState(false);

    const sortItems = [
        { key: "All", label: lang.t("point.sort.all") },
        { key: "plus", label: lang.t("point.sort.accumulated") },
        { key: "minus", label: lang.t("point.sort.used") },
    ];

    const sortOpenAction = () => {
        setsortOpen(true);
    };

    const sortChange = async (e) => {
        setsortValue(e);
    };

    return (
        <>
            <div className="sort">
                {point.data.pointHistory.point.length > 0 && (
                    <DDS.button.default
                        onClick={() => {
                            sortOpenAction();
                        }}
                    >
                        {sortItems
                            .filter((e) => e.key === sortValue)
                            .map((e) => (
                                <React.Fragment key={e.key}>{e.label}</React.Fragment>
                            ))}
                        <DDS.icons.angleDown />
                    </DDS.button.default>
                )}
            </div>
            <ul className={`point-list ${point.data.pointHistory.point.length > 0 ? "" : "empty"}`}>
                {point.data.pointHistory.point.length > 0 ? (
                    point.data.pointHistory.point
                        .filter((e) => (sortValue === "plus" ? e.pointAmount > 0 : sortValue === "minus" ? e.pointAmount < 0 : e))
                        .map((item, key) => {
                            return (
                                <li key={key}>
                                    <div>
                                        <strong>{item.description}</strong>
                                    </div>
                                    <div>
                                        <strong className={item.pointAmount > 0 ? "plus" : ""}>{common.numberFormat(parseInt(item.pointAmount))}</strong>
                                        <span>{moment(item.createdAt).format("YYYY.MM.DD")}</span>
                                    </div>
                                </li>
                            );
                        })
                ) : (
                    <li>{lang.t("point.empty")}</li>
                )}
            </ul>
            <DDS.actionsheet.default
                open={sortOpen}
                onClose={(callback) => {
                    setsortOpen(false);
                    callback && callback();
                }}
                items={sortItems}
                active={sortValue}
                change={sortChange}
            />
        </>
    );
});
