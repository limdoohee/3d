import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import DDS_Icons from "../../_lib/component/icons";
import DDS_Button from "../../_lib/component/button";

const Home = observer((props) => {
    const [count, setCount] = useState(1024);
    const [more, setMore] = useState(false);
    const [like, setLike] = useState(false);
    const [height, setHeight] = useState(0);
    const nameInput = useRef();

    const addComma = (val) => {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const moreClick = () => {
        setMore(!more);
        more ? setHeight(0) : window.innerHeight - 300 < nameInput.current.scrollHeight ? setHeight(window.innerHeight - 300) : setHeight(nameInput.current.scrollHeight);
    };

    useEffect(() => {
        setCount(addComma(count));
        setMore(false);
    }, []);

    return (
        <div className="detail" style={{ backgroundColor: more ? "rgba(255,255,255,0.5" : "transparent", height: more ? "100vh" : "0" }}>
            <div className="wrapper">
                <div className="info">
                    <div className="artist">
                        <div>
                            <Avatar icon={<UserOutlined />} />
                            <span className="name">abcdefghijklmnopqrst</span>
                        </div>
                        {more && <DDS_Icons.circleChevronDown className="dds icons" onClick={moreClick} />}
                    </div>
                    <h6 className="dropNo">Drop #1</h6>
                    <h4 className="artName">A SWEET DAY</h4>
                    <div className="owner">
                        Owner <span className="count">{count}</span>
                    </div>
                    <div className="desc" style={{ height }} ref={nameInput}>
                        작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명
                        작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명 작품설명
                        작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명
                        작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명 작품설명 작품설명
                        작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명
                        작품설명 작품설명 작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명
                        작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명
                        작품설명 작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명작품설명 작품설명 작품설명 작품설명
                    </div>
                    {!more && (
                        <div className="more" onClick={moreClick}>
                            MORE INFO
                            <DDS_Icons.angleRight className="dds icons small" style={{ marginLeft: "8px" }} />
                        </div>
                    )}
                </div>
                <div className="bottom">
                    <DDS_Button.default className="dds button primary large bigButton" icon={<DDS_Icons.ar />}>
                        OPEN
                    </DDS_Button.default>
                    <div className="smallButton" onClick={() => setLike(true)}>
                        {!like ? <DDS_Icons.heart /> : <DDS_Icons.heartFill />}
                        <p>25</p>
                    </div>
                    <div className="smallButton">
                        <DDS_Icons.bookFilled />
                        <p>매거진</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Home;
