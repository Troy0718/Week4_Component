import { useEffect, useState, useRef } from "react";
// import "./assets/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import axios from "axios";
import { Modal } from "bootstrap";
const url = import.meta.env.VITE_URL;
const path = import.meta.env.VITE_PATH;

function DelProductModal({ tempProduct, getproducts, isOpen, setIsOpen }) {
  const delProductModalRef = useRef(null);
  //刪除產品DELETE API
  const deleteProduct = async () => {
    try {
      await axios.delete(`${url}/api/${path}/admin/product/${tempProduct.id}`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0,
        },
      });
    } catch (error) {
      alert(
        "編輯刪除失敗" +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };
  useEffect(() => {
    new Modal(delProductModalRef.current, {
      backdrop: false,
    });
  }, []);

  //綁定刪除Modal的刪除按鈕觸發delete api 刪除產品
  const handleDelProduct = async () => {
    try {
      await deleteProduct();
      getProducts();
      handleCloseDelProductModal();
    } catch (error) {
      console.error(
        "刪除失敗" +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };
  //關閉 編輯、新增產品Modal
  const handleCloseDelProductModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();
    setIsOpen(false);
  };
  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(delProductModalRef.current);
      modalInstance.show();
    }
  }, [isOpen]);
  return (
    <div
      ref={delProductModalRef}
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">刪除產品</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleCloseDelProductModal}
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除
            <span className="text-danger fw-bold">{tempProduct.title}</span>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseDelProductModal}
            >
              取消
            </button>
            <button
              onClick={handleDelProduct}
              type="button"
              className="btn btn-danger"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DelProductModal;
