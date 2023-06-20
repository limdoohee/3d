import React, { useEffect, useState, useRef } from "react";
import Router, { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import Detail from "../detail/index.view";

import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import gsap from "gsap";

import DDS_Icons from "../../_lib/component/icons";
import { message, Progress, Avatar, Badge } from "antd";
import Link from "next/link";

import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
import ChatTemplate from "../../_lib/template/chat";
import Gallery from "../../_lib/module/component/gallery";

const Home = observer((props) => {
    const router = useRouter();
    const { store } = props;
    const { drop, common, gallery } = store;
    const [open, setOpen] = useState(false);
    const [back, setBack] = useState(false);
    const ref = useRef(null);

    //------------------------------------------------- Init Load
    const initLoad = ({ initCheck, callback }) => {
        var params = { sendbirdId: "dropkitchen_member_" + router.query.memberSeq };
        gallery.getData(params, (e) => {
            common.debug(e);
            callback && callback(e);
        });
    };
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/userGallery") {
            initLoad({
                callback: (e) => {},
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    const modalData = {
        // open,
        title: "친구도 나도 둘 다 받는 혜택!\n친구를 초대하고 드롭키친의 선물을 받아보세요.",
        context: "아직 드롭키친 회원이 아닌 친구가 회원가입하면 드롭키친의 디지털 아트를 랜덤으로 지급받을 수 있어요.\n친구가 회원가입 할 때마다 나에게 300P가 주어져요.",
        button: "초대하고 선물받기",
        linkUrl: "/main",
        img: "../../static/3d/perspective_matte.png",
    };

    const headerRight = [
        () => (
            <DDS.button.default
                className="dds button none"
                icon={<DDS.icons.cube />}
                onClick={() => {
                    router.push("/random");
                }}
            />
        ),
        () => (
            <DDS.button.default
                className="dds button none"
                icon={<DDS.icons.shareNode />}
                onClick={() => {
                    common.uiChange("gnbOpen", true);
                }}
            />
        ),
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

    const goGallery = () => {
        ref.current.back();
    };

    return (
        <>
            <DDS.layout.container store={store}>
                <DK_template_header.default store={store} className="top" right={headerRight} back={back && goGallery} />
                <DK_template_GNB.default store={store} />
                <DDS.layout.content>
                    <div className="userInfo">
                        <div className="profile">
                            <div>
                                <Badge count={<DDS_Icons.pen />} className="profileMod">
                                    <Avatar
                                        size={64}
                                        src={<img src={"https://s.pstatic.net/dthumb.phinf/?src=%22https%3A%2F%2Fs.pstatic.net%2Fshopping.phinf%2Fmain_4037083%2F40370838619.20230607071158.jpg%22&type=nf216_312&service=navermain"} alt="avatar" />}
                                        // src={<img src={gallery.data.profileImage} alt="avatar" />}
                                    />
                                </Badge>
                            </div>
                            <div>
                                <h1>
                                    {gallery.data.nickname}
                                    <DDS_Icons.badgeCheck className="badge" />
                                </h1>
                                {/* <h4>Hello, I’m heavy collector Hello, I’m heavy coll</h4> */}
                                <h4>{gallery.data.introduction}</h4>
                                <div className="point">
                                    <DDS_Icons.point />
                                    {gallery.data.pointBalance}
                                    <DDS_Icons.userGroup className="inviteCount" />
                                    {gallery.data.inviteCnt}
                                </div>
                            </div>
                        </div>
                        <Link href="dds">
                            <div className="collection">
                                <ul className="wrapper">
                                    <li className="title">
                                        <DDS_Icons.drop />
                                        Colletion
                                    </li>
                                    <li className="count">
                                        <strong>{gallery.data.myDropCnt}</strong>
                                        <span className="slash">/</span>
                                        {gallery.data.totalDropCnt}
                                    </li>
                                </ul>
                                <Progress percent={(gallery.data.myDropCnt / gallery.data.totalDropCnt) * 100} showInfo={false} strokeColor={"#FD6E24"} className="asdf" />
                            </div>
                        </Link>
                    </div>
                    {/* 마이갤러리 */}
                    <div className="btn">
                        {/* <div className="invite" onClick={() => setOpen(true)}>
                            <div className="iconWrapper">
                                <DDS_Icons.envelopeOpenHeart />
                            </div>
                            <div className="text">
                                <h5>친구도 나도 둘 다 받는 혜택!</h5>
                                <h6>친구를 초대하고 포인트를 획득해보세요!</h6>
                            </div>
                            <div className="greyAngle">
                                <DDS_Icons.envelopeOpenHeart />
                            </div>
                        </div> */}
                        {/* 작가갤러리 */}
                        <div className="wrapper">
                            {/* <div>
                                <DDS_Icons.bookFilled
                                    onClick={() => {
                                        router.push("magazine");
                                    }}
                                />
                            </div> */}
                            <div>
                                <DDS_Icons.chat
                                    onClick={() => {
                                        common.uiChange("chatOpen", true);
                                    }}
                                />
                            </div>
                            {/* <div>
                                <DDS_Icons.heart className="like" />
                                <h6>14K</h6>
                            </div> */}
                        </div>
                    </div>
                    <Gallery {...gallery} back={back} setBack={setBack} ref={ref} />
                    <Detail />
                    <ChatTemplate.open store={props.store} />
                </DDS.layout.content>
            </DDS.layout.container>
        </>
    );
});

export default Home;
