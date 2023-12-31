import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { Drawer, Modal } from "antd";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import DDS from "./dds";

const Component = {
    center: observer((props) => {
        const router = useRouter();
        const { open, setOpen, confirm, cancel } = props;
        const onClose = () => {
            setOpen(false);
        };

        return (
            <>
                <Modal
                    open={open}
                    onCancel={onClose}
                    closable={false}
                    className="dds modal center"
                    footer={[
                        confirm && (
                            <DDS.button.default
                                className="dds button primary large"
                                onClick={async () => {
                                    confirm.action && (await confirm.action());
                                    confirm.close ? confirm.close() : onClose();
                                }}
                                key="primary"
                            >
                                {confirm.label}
                            </DDS.button.default>
                        ),
                        cancel && (
                            <DDS.button.default
                                className="dds button text"
                                onClick={async () => {
                                    cancel.action && (await cancel.action());
                                    onClose();
                                }}
                                key="text"
                            >
                                {cancel.label}
                            </DDS.button.default>
                        ),
                    ]}
                >
                    {props.img && (
                        <div className="imgWrapper">
                            <img src={props.img} />
                        </div>
                    )}
                    <h1 className="title">{props.title}</h1>
                    <h3 className="context">{props.context}</h3>
                </Modal>
            </>
        );
    }),
    bottom: observer((props) => {
        const router = useRouter();
        const { open, setOpen, confirm, cancel } = props;
        const onClose = () => {
            setOpen(false);
        };

        return (
            <>
                <Modal
                    open={open}
                    onCancel={onClose}
                    closable={false}
                    className="dds modal bottom"
                    footer={[
                        confirm && (
                            <DDS.button.default
                                className="dds button primary large"
                                onClick={async () => {
                                    confirm.action && (await confirm.action());
                                    confirm.close ? confirm.close() : onClose();
                                }}
                                key="primary"
                            >
                                {confirm.label}
                            </DDS.button.default>
                        ),
                        cancel && (
                            <DDS.button.default
                                className="dds button text"
                                onClick={async () => {
                                    cancel.action && (await cancel.action());
                                    onClose();
                                }}
                                key="text"
                            >
                                {cancel.label}
                            </DDS.button.default>
                        ),
                    ]}
                >
                    {props.img && (
                        <div className="imgWrapper">
                            <img src={props.img} />
                        </div>
                    )}
                    <h1 className="title">{props.title}</h1>
                    <h3 className="context">{props.context}</h3>
                    <h4 className="subContext">{props.subContext}</h4>
                </Modal>
            </>
        );
    }),
    image: observer((props) => {
        const router = useRouter();
        const { open, setOpen, confirm, cancel } = props;
        const onClose = () => {
            setOpen(false);
        };

        return (
            <>
                <Modal open={open} onCancel={onClose} className="dds modal image" footer={[]}>
                    {props.img && (
                        <div className="imgWrapper">
                            <img src={props.img} />
                        </div>
                    )}
                </Modal>
            </>
        );
    }),
};

export default Component;
