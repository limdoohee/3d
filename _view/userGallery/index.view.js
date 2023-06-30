import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Router, { useRouter } from "next/router";
import { observer } from "mobx-react-lite";

import { Progress, Avatar, Badge } from "antd";
import Link from "next/link";

import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
import Gallery from "../../_lib/module/component/gallery";

import { Drawer } from "antd";

const Home = observer((props) => {
    const router = useRouter();
    const { store } = props;
    const { common, lang, gallery, auth } = store;
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const [headerRight, setHeaderRight] = useState([]);
    const [height, setHeight] = useState(0);
    const [profileOpen, setProfileOpen] = useState(false);

    //------------------------------------------------- Init Load
    const initLoad = ({ initCheck, callback }) => {
        let s;
        switch (process.env.STAGE) {
            case "LOCAL":
                s = "mango";
                break;
            case "DEVELOPMENT":
                s = "mango";
                break;
            case "STAGING":
                s = "plum";
                break;
            case "PRODUCTION":
                s = "www";
                break;
            default:
                break;
        }
        var params = { sendbirdId: `dropkitchen_${s}_member_` + router.query.memberSeq };
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
                callback: (e) => {
                    gallery.data.ownFlag
                        ? setHeaderRight([
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
                                          location.href = "/alarm";
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
                          ])
                        : setHeaderRight([
                              () => (
                                  <DDS.button.default
                                      className={`dds button none gallery ${gallery.data.unconfirmedLuckyBox ? "badge" : ""}`}
                                      icon={<DDS.icons.myGalleryBlackOn />}
                                      onClick={() => {
                                          location.href = "/userGallery?memberSeq=" + auth.loginResult.seq;
                                      }}
                                  />
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
                                          location.href = "/alarm";
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
                          ]);
                },
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    useEffect(() => {
        setHeight(ref.current?.clientHeight);
    }, [gallery.data]);

    const modalData = {
        open: open,
        setOpen: setOpen,
        img: "../../static/img/invite.png",
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

    const toDropList = () => {
        gallery.data.ownFlag && (location.href = "/drops");
    };

    return (
        <>
            <DDS.layout.container store={store}>
                <DK_template_header.default store={store} className="top" right={headerRight} />
                <DK_template_GNB.default store={store} />
                <DDS.layout.content>
                    {gallery.data.nickname && (
                        <div className="userInfo">
                            <div className={`profile ${height > 64 ? "" : "center"}`}>
                                <div
                                    onClick={() => {
                                        {
                                            gallery.data.ownFlag ? (location.href = "/setting/profile/") : setProfileOpen(true);
                                        }
                                    }}
                                >
                                    {gallery.data.ownFlag ? (
                                        <Badge count={<DDS.icons.pen />} className="profileMod">
                                            <DDS.profile.default
                                                size={64}
                                                badge={<DDS.icons.badgeCrown className="cert" />}
                                                src={gallery.data.profileImage ? gallery.data.profileImage : "https://asset.dropkitchen.xyz/contents/202306_dev/20230630141950960_dk.webp"}
                                            />
                                        </Badge>
                                    ) : (
                                        <DDS.profile.default
                                            size={64}
                                            badge={<DDS.icons.badgeCrown className="cert" />}
                                            src={gallery.data.profileImage ? gallery.data.profileImage : "https://asset.dropkitchen.xyz/contents/202306_dev/20230630141950960_dk.webp"}
                                        />
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
                                            <DDS.icons.point
                                                onClick={() => {
                                                    location.href = "/point";
                                                }}
                                            />
                                            {common.numberFormat(gallery.data.pointBalance)}
                                            <DDS.icons.userPlus className="inviteCount" />
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
                                            setOpen(true);
                                        }}
                                    >
                                        Invite
                                    </DDS.button.default>
                                    <DDS.button.default
                                        className="dds button secondary"
                                        icon={<DDS.icons.cube />}
                                        onClick={(e) => {
                                            location.href = "/random";
                                        }}
                                    >
                                        Lucky Box
                                    </DDS.button.default>
                                </div>
                            )}
                            <div className="collection" onClick={toDropList}>
                                <ul className="wrapper">
                                    <li className="title">
                                        <DDS.icons.drop />
                                        Collection
                                    </li>
                                    <li className="count">
                                        <strong>{gallery.data.myDropCnt}</strong>
                                        <span className="slash">/</span>
                                        {gallery.data.totalDropCnt}
                                    </li>
                                </ul>
                                <Progress percent={(gallery.data.myDropCnt / gallery.data.totalDropCnt) * 100} showInfo={false} strokeColor={"#FD6E24"} className="asdf" />
                            </div>
                        </div>
                    )}
                    {gallery.data.nickname && <Gallery store={props.store} />}
                    <DDS.modal.bottom {...modalData} />
                    <Drawer className="profileView" placement={"right"} open={profileOpen} closeIcon={<DDS.button.default className="dds button primary" icon={<DDS.icons.xmark onClick={() => setProfileOpen(false)} />} />}>
                        <img src={gallery.data.profileImage ? gallery.data.profileImage : "https://asset.dropkitchen.xyz/contents/202306_dev/20230630141950960_dk.webp"} alt="profile image" />
                    </Drawer>
                </DDS.layout.content>
            </DDS.layout.container>
        </>
    );
});

export default Home;
