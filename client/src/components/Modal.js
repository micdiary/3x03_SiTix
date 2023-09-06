import React from "react";
import { Modal } from "antd";

const CustomModal = ({
    modal2Open,
    closeModal,
    modalTitle,
    modalContent,
    onOk,
}) => {
    return (
        <Modal
            title={modalTitle}
            centered
            open={modal2Open}
            onOk={() => {
                closeModal(false);
                if (onOk) {
                    onOk();
                }
            }}
            onCancel={() => closeModal(false)}
        >
            {modalContent}
        </Modal>
    );
};

export default CustomModal;
