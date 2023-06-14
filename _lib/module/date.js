import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import cookie from "cookie";
import { useTimer, useStopwatch } from "react-timer-hook";
import moment from "moment";
const pageFunc = {
    timeRemain: {
        default: observer(({ time, onExpire }) => {
            var now = moment().unix();
            var timestamp = moment(time).unix();
            var currentTime = now - timestamp;
            var timePrint = "";
            if (currentTime < 3600) {
                timePrint = `${(currentTime / 60).toFixed(0)}분전`;
            } else if (currentTime < 86400) {
                timePrint = `${(currentTime / 3600).toFixed(0)}시간전`;
            } else if (currentTime < 86400 * 7) {
                timePrint = `${(currentTime / 86400).toFixed(0)}일전`;
            }
            // else if (currentTime < 86400 * 30 * 12) {
            //     timePrint = `${(currentTime / (86400 * 30)).toFixed(0)}개월전`;
            // } else {
            //     timePrint = `${(currentTime / (86400 * 30 * 12)).toFixed(0)}년전`;
            // }
            else {
                timePrint = moment(time).format("YYYY.MM.DD");
            }

            return <>{timePrint}</>;
        }),
        daysOnly: observer(({ time, onExpire }) => {
            const authTime = new Date();
            authTime.setSeconds(authTime.getSeconds());
            var expiryTimestamp = authTime;
            const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
                expiryTimestamp,
                onExpire: () => {
                    onExpire && onExpire();
                },
            });

            useEffect(() => {
                if (time) {
                    var now = moment();
                    var check = moment(time);

                    var duration = moment.duration(check.diff(now)).asSeconds();

                    const endTime = new Date();
                    endTime.setSeconds(endTime.getSeconds() + duration);

                    restart(endTime);
                }
            }, [time]);

            return <>{`${days}일 ${hours}시간 ${minutes}분 ${seconds}초`}</>;
        }),
    },
};

export default pageFunc;
