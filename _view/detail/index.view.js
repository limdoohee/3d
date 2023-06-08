import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import DDS_Icons from "../../_lib/component/icons";
import DDS_Button from "../../_lib/component/button";

const Home = observer((props) => {
    const [count, setCount] = useState(1024);
    const [more, setMore] = useState(false);

    const addComma = (val) => {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const moreClick = () => {
        setMore(!more);
    };

    useEffect(() => {
        setCount(addComma(count));
    }, []);

    return (
        <div className="detail">
            {/* <div className="hold">
                    <button>보유중</button>
                </div> */}
            <div className="wrapper">
                <div className="info">
                    <div className="artist">
                        <div>
                            {/* <Avatar
                            style={{
                                backgroundColor: "#000000",
                            }}
                            src={<img src={"../../static/img/defaultProfile.png"} className="profile" alt="profile" />}
                        /> */}
                            <Avatar icon={<UserOutlined />} />
                            <span className="name">abcdefghijklmnopqrst</span>
                        </div>
                        {more && <DDS_Icons.heartFill className="dds icons" onClick={moreClick} />}
                    </div>
                    <h6 className="dropNo">Drop #1</h6>
                    <h4 className="artName">A SWEET DAY</h4>
                    <div className="owner">
                        Owner <span className="count">{count}</span>
                    </div>
                    {more ? (
                        <div className="desc">
                            작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명
                            작품설명 작품설명 작품설명 작품설명 작품설명
                        </div>
                    ) : (
                        <div className="more" onClick={moreClick}>
                            MORE INFO
                        </div>
                    )}
                </div>
                <div className="bottom">
                    <DDS_Button.default className="dds button primary large">OPEN</DDS_Button.default>
                </div>
            </div>
        </div>
    );
});

export default Home;
