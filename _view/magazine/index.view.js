import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import Sticky from "react-sticky-el";
import { InView } from "react-intersection-observer";
import { animateScroll as scroll, Events, scrollSpy, scroller, Element } from "react-scroll";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Module
import Date_Module from "../../_lib/module/date";
//------------------------------------------------------------------------------- Module

const Home = observer((props) => {
    const { store } = props;
    const { common, lang, auth, magazine } = store;
    const router = useRouter();

    // const [category, setcategory] = useState();
    // const [page, setpage] = useState(0);

    var category;
    const [init, setinit] = useState(false);
    const [page, setpage] = useState(0);
    const [keywordValue, setkeywordValue] = useState("");
    const [sortOpen, setsortOpen] = useState(false);
    const [sortValue, setsortValue] = useState("createdAt");

    //------------------------------------------------- Init Load
    const initLoad = ({ initCheck, callback }) => {
        var params = { size: 4, page: initCheck ? 0 : page, sort: sortValue + ",desc" };
        category && (params.category = category);
        router.query.keyword && (params.keyword = router.query.keyword);
        magazine.magazineList(params, (e) => {
            if (!page) {
                setinit(true);
            }
            common.debug(e);
            callback && callback(e);
            setpage(page + 1);
        });
    };
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/magazine") {
            common.getBuildId();
            setkeywordValue(router.query.keyword ? router.query.keyword : null);
            initLoad({
                callback: (e) => {},
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    const headerRight = [
        () => (
            <DDS.button.default
                className="dds button none"
                icon={<DDS.icons.bars />}
                onClick={() => {
                    common.uiChange("gnbOpen", true);
                }}
            />
        ),
    ];

    const items = [
        {
            key: "1",
            label: `ALL`,
            value: "all",
        },
        {
            key: "2",
            label: `INTERVIEW`,
            value: "interview",
        },
        {
            key: "3",
            label: `PICK`,
            value: "pick",
        },
        {
            key: "4",
            label: `COLUMN`,
            value: "column",
        },
        {
            key: "5",
            label: `CULTURE`,
            value: "culture",
        },
    ];

    const onChange = async (key) => {
        key > 0 && (category = items[key].value);
        await setpage(0);
        scroll.scrollTo(0, {
            smooth: true,
            duration: 0,
            containerId: "message-wrap",
        });
        await initLoad({
            initCheck: true,
            callback: (e) => {},
        });
    };

    const pageEnd = async (inView, entry) => {
        if (init && inView && page < magazine.data.magazineList.page.totalPages) {
            await initLoad({
                callback: (e) => {},
            });
        }
    };

    const keywordChange = (e) => {
        setkeywordValue(e.target.value);
    };

    const handleEnterPress = async (e, callback) => {
        if (e.key === "Enter" && e.nativeEvent.isComposing === false) {
            console.log("handleEnterPress");
            location.href = `/magazine/?keyword=${e.target.value}`;
        }
    };

    const sortOpenAction = (e) => {
        setsortOpen(true);
    };
    const sortChange = async (e) => {
        setsortValue(e);

        magazine.initMagazineList();
        await setpage(0);
        var params = { size: 4, page: page, sort: e + ",desc" };
        category && (params.category = category);
        router.query.keyword && (params.keyword = router.query.keyword);
        magazine.magazineList(params, (e) => {
            if (!page) {
                setinit(true);
            }
        });
    };

    const sortItems = [
        //
        { key: "createdAt", label: "최신순" },
        { key: "viewCount", label: "조회순" },
    ];

    const onMove = (seq) => {
        location.href = `/magazine/d/${seq}`;
    };

    return (
        <DDS.layout.container className={"fluid"} store={store}>
            <DK_template_header.default store={store} title={lang.t("magazine.title")} right={headerRight} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content className="page-magazine">
                <Sticky>
                    <div className="search">
                        <DDS.input.default value={keywordValue} onChange={keywordChange} onKeyDown={handleEnterPress} className="dds input secondary" placeholder="Search" prefix={<DDS.icons.magnifyingGlass />} />
                    </div>
                    <DDS.tabs.default defaultActiveKey="0" items={items} onChange={onChange} />
                </Sticky>
                <div className="sort">
                    <DDS.button.default
                        onClick={() => {
                            sortOpenAction();
                        }}
                    >
                        {sortItems.map((e, i) => {
                            return <React.Fragment key={i}>{e.key == sortValue && e.label}</React.Fragment>;
                        })}
                        <DDS.icons.angleDown />
                    </DDS.button.default>
                </div>

                <ul className="list">
                    {magazine.data.magazineList.list.map((item, key) => {
                        return (
                            <li key={key}>
                                <div
                                    className="image"
                                    style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
                                    onClick={() => {
                                        onMove(item.seq);
                                    }}
                                >
                                    <img src={""} />
                                </div>
                                <div className="category">
                                    <strong>{item.category}</strong>
                                    <span>
                                        <Date_Module.timeRemain.default time={item.updatedAt} />
                                    </span>
                                </div>
                                <h4
                                    onClick={() => {
                                        onMove(item.seq);
                                    }}
                                >
                                    {item.title}
                                </h4>
                                <dl>
                                    {item.hashTag.map((el, i) => (
                                        <dd key={i}>
                                            <Link href={`/magazine/?keyword=${el}`}>#{el}</Link>
                                        </dd>
                                    ))}
                                </dl>
                            </li>
                        );
                    })}
                    <InView as="li" onChange={pageEnd}></InView>
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
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;
