("use client");
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";

//------------------------------------------------------------------------------- Antd
import { Drawer } from "antd";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { open, setopen, type, store } = props;
    const { common, lang } = store;

    const onClose = () => {
        setopen(false);
    };

    useEffect(() => {
        if (open) {
            common.policy({ type: type }, (e) => {
                setcontent(e.content);
            });
        }
    }, [open]);

    const [content, setcontent] = useState("");

    return (
        <>
            {/* ///////////////////////////////////////////////////// 약관 보기 */}
            <Drawer className="modal agreement" placement={"right"} closable={false} onClose={onClose} open={open} width={1500}>
                <div>
                    <DDS.icons.angleLeft onClick={onClose} />
                    <h3>{lang.t(`policy.${type}.title`)}</h3>
                </div>
                <div className="terms" dangerouslySetInnerHTML={{ __html: content }}></div>
            </Drawer>
            {/* ///////////////////////////////////////////////////// 약관 보기 */}
        </>
    );
});

export default Home;
