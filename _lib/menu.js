import Link from "next/link";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import Router, { useRouter } from "next/router";
import DDS_Icons from "./component/icons";

const Data = {
    gnb: [
        // { icon: () => <DDS_Icons.crown />, link: "", name: "Rank" },
        { icon: () => <DDS_Icons.myGalleryBlackOn />, link: "/userGallery/?memberSeq=", name: "My Gallery" },
        { icon: () => <DDS_Icons.drop />, link: "/drops", name: "Art Drop List" },
        { icon: () => <DDS_Icons.bookFilled />, link: "/magazine", name: "Magazine" },
        { icon: () => <DDS_Icons.gear />, link: "/setting", name: "Setting" },
        // { icon: () => <DDS_Icons.envelopeOpenTest />, link: "", name: "Feedback" },
    ],
};

export default Data;
