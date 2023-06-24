import React, { useEffect } from 'react';
import { Button, Modal } from 'antd';
import './style.less';

interface PropsData {
  onModalClose: Function;
  onModalConfirm: Function;
  loading?: boolean;
  title: string;
  modalVisible: boolean;
  width?: number;
  children: any;
  hiddenCancel?: boolean;
  hiddenConfirm?: boolean;
}

function ConfirmModal(props: PropsData) {
  const handlerClose = (e) => {
    e.stopPropagation();
    props.onModalClose && props.onModalClose();
  };

  const handlerConfirm = (e) => {
    e.stopPropagation();
    props.onModalConfirm && props.onModalConfirm();
  };

  //适配问题啊

  return (
    <Modal
      wrapClassName="modal-content-wrapper"
      title={props.title}
      open={props.modalVisible}
      width={Math.max(props?.width || 0, 400)}
      centered
      footer={null}
      closable={props.hiddenCancel}
      onCancel={handlerClose}
    >
      <div>{props.children}</div>

      {!props?.hiddenCancel && !props?.hiddenConfirm && <div className="modal-button-layout margin-top-40">
        {!props?.hiddenCancel && (
          <Button onClick={handlerClose} className={'cancel-btn'}>
            Cancel
          </Button>
        )}
        {!props?.hiddenConfirm && <Button
          onClick={handlerConfirm}
          className={`confirm-btn ${props.hiddenCancel ? 'all-btn' : ''}`}
          loading={props.loading}
        >
          Confirm
        </Button>}
      </div>}
    </Modal>
  );
}

export default ConfirmModal;
