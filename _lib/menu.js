import Link from "next/link";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import Router, { useRouter } from "next/router";
import DDS_Icons from "./component/icons";

const Data = {
    gnb: [
        { icon: () => <DDS_Icons.crown />, link: "", name: "Rank" },
        { icon: () => <DDS_Icons.storeFilled />, link: "", name: "Drop list" },
        { icon: () => <DDS_Icons.bookFilled />, link: "", name: "Magazine" },
        { icon: () => <DDS_Icons.circleQuestion />, link: "", name: "FAQ" },
        { icon: () => <DDS_Icons.envelopeOpenTest />, link: "", name: "Feedback" },
    ],
};

export default Data;
