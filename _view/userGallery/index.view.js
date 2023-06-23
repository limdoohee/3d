import React, { useEffect, useState, useRef } from "react";
import Router, { useRouter } from "next/router";
import { observer } from "mobx-react-lite";

import DDS_Icons from "../../_lib/component/icons";
import { Progress, Avatar, Badge } from "antd";
import Link from "next/link";

import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
import Gallery from "../../_lib/module/component/gallery";
import ChatTemplate from "../../_lib/template/chat";
import PointTemplate from "../../_lib/template/point";
import AlarmTemplate from "../../_lib/template/alarm";

const Home = observer((props) => {
    const router = useRouter();
    const { store } = props;
    const { common, lang, gallery, auth } = store;
    const [open, setOpen] = useState(false);
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

    const headerRight = [
        () =>
            !gallery.data.ownFlag && (
                <DDS.button.default
                    className={`dds button none gallery ${gallery.data.unconfirmedLuckyBox ? "badge" : ""}`}
                    icon={<DDS.icons.myGalleryBlackOn />}
                    onClick={() => {
                        router.push("/userGallery?memberSeq=" + auth.loginResult.seq);
                    }}
                />
                // <div></div>
            ),
        () => (
            <DDS.button.default
                className="dds button none"
                icon={<DDS.icons.shareNode />}
                onClick={() => {
                    window.location.href = "native://share?contents=" + encodeURI(gallery.data.galleryLink);
                }}
            />
        ),
        () => (
            <DDS.button.default
                className="dds button none"
                icon={<DDS.icons.bell />}
                onClick={() => {
                    common.uiChange("alarmOpen", true);
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

    const modalData = {
        open: open,
        setOpen: setOpen,
        img: "../../static/img/invite.png",
        title: lang.t("gallery.modal.title"),
        context: lang.t("gallery.modal.context"),
        confirm: {
            label: lang.t("gallery.modal.confirm"),
            action: () => {
                // Router.push("/gallery");
            },
        },
        cancel: {
            label: lang.t("gallery.modal.close"),
            action: () => {},
        },
    };

    return (
        <>
            <DDS.layout.container store={store}>
                <DK_template_header.default store={store} className="top" right={headerRight} />
                <DK_template_GNB.default store={store} />
                <DDS.layout.content>
                    <div className="userInfo">
                        <div className={`profile ${ref.current?.offsetHeight < 69 ? "center" : ""}`}>
                            <div>
                                {gallery.data.ownFlag ? (
                                    <Badge count={<DDS_Icons.pen />} className="profileMod">
                                        <DDS.profile.default size={64} badge={<DDS_Icons.badgeCrown className="cert" />} src={auth.loginResult.profileImage ? auth.loginResult.profileImage : "../../static/img/profile.png"} />
                                    </Badge>
                                ) : (
                                    <DDS.profile.default size={64} badge={<DDS_Icons.badgeCrown className="cert" />} src={auth.loginResult.profileImage ? auth.loginResult.profileImage : "../../static/img/profile.png"} />
                                )}
                            </div>
                            <div ref={ref}>
                                <div className="nickname">
                                    <p>{gallery.data.nickname}</p>
                                    {gallery.data.artistFlag && <DDS.chips.default className="third">ARTIST</DDS.chips.default>}
                                </div>
                                <h4>{gallery.data.introduction}</h4>

                                {gallery.data.ownFlag && (
                                    <div className="point">
                                        <DDS_Icons.point
                                            onClick={() => {
                                                common.uiChange("pointOpen", true);
                                            }}
                                        />
                                        {gallery.data.pointBalance}
                                        <DDS_Icons.userPlus className="inviteCount" />
                                        {gallery.data.inviteCnt}
                                    </div>
                                )}
                            </div>
                        </div>
                        {gallery.data.ownFlag && (
                            <div className="ddsBtnWrapper">
                                <DDS.button.default
                                    className="dds button primary"
                                    icon={<DDS.icons.paperPlane />}
                                    onClick={() => {
                                        window.location.href = "native://share?contents=" + encodeURI(auth.loginResult.inviteLink);
                                    }}
                                >
                                    invite
                                </DDS.button.default>
                                <DDS.button.default
                                    className="dds button secondary"
                                    icon={<DDS.icons.cube />}
                                    onClick={(e) => {
                                        router.push("/random");
                                    }}
                                >
                                    Lucky Box
                                </DDS.button.default>
                            </div>
                        )}
                        <Link href="/drops">
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
                    {gallery.data.galleryLink && <Gallery store={props.store} />}
                    <DDS.modal.bottom {...modalData} />
                    <ChatTemplate.open store={props.store} />
                    <PointTemplate.default store={props.store} />
                    <AlarmTemplate.default store={props.store} />
                </DDS.layout.content>
            </DDS.layout.container>
        </>
    );
});

export default Home;
