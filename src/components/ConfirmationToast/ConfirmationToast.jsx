import React from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ConfirmationToast.module.scss'
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const ConfirmationToast = ({ message, onConfirm, onCancel }) => {

  const handleConfirm = () => {
    toast.dismiss();
    onConfirm();
  }

  const handleCancel = () => {
    toast.dismiss();
    onCancel();
  }

  return (
    <div className={cx("confirm-toast-wrapper")}>
      <h4>{message}</h4>
      <div className={cx("confirm-toast-wrapper__btn")}>
        <button 
          className={cx("confirm-toast-wrapper__btn-ok")} 
          onClick={handleConfirm}
        >
          OK
        </button>
        <button 
          className={cx("confirm-toast-wrapper__btn-cancel")} 
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default ConfirmationToast;