import React from "react";
import { Modal } from "antd";

const Modals = ({ modal2Open, closeModal, modalTitle, modalContent, onOk }) => {
    return (
        <Modal
            title={modalTitle}
            centered
            open={modal2Open}
            onOk={() => {
                if (onOk) {
                    onOk();
                }
            }}
            onCancel={() => closeModal(false)}
            okText="Submit"
            okButtonProps={{
                style: {
                    height: "50px",
                    background: "black",
                    borderColor: "black",
                    color: "white",
                    borderRadius: "30px",
                },
            }}
            cancelButtonProps={{
                style: {
                    height: "50px",
                    background: "white",
                    borderColor: "black",
                    color: "black",
                    borderRadius: "30px",
                },
            }}
        >
            {modalContent}
        </Modal>
    );
};

export default Modals;
