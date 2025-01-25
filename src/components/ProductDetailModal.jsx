import { useEffect, useState, useRef } from "react";
// import "./assets/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
// import axios from "axios";
import { Modal } from "bootstrap";

function ProductDetailModal({ tempProduct, getProducts, isOpen, setIsOpen }) {
  const ProductDetailModalRef = useRef(null);
  useEffect(() => {
    new Modal(ProductDetailModalRef.current, {
      backdrop: false,
    });
  }, []);

  //關閉 查看細節Modal
  const handleCloseProductDetailModal = () => {
    const modalInstance = Modal.getInstance(ProductDetailModalRef.current);
    modalInstance.hide();
    setIsOpen(false);
  };
  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(ProductDetailModalRef.current);
      modalInstance.show();
    }
  }, [isOpen]);

  return (
    <div className="modal" ref={ProductDetailModalRef} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{tempProduct.title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleCloseProductDetailModal}
            ></button>
          </div>
          <div className="modal-body">
            <img
              src={tempProduct.imageUrl}
              className="card-img-top primary-image"
              alt="主圖"
            />
            <div className="card-body">
              <h5 className="card-title">
                {tempProduct.title}
                <span className="badge bg-primary ms-2">
                  {tempProduct.category}
                </span>
              </h5>
              <p className="card-text">商品描述：{tempProduct.description}</p>
              <p className="card-text">商品內容：{tempProduct.content}</p>
              <div className="d-flex">
                <p className="card-text text-secondary">
                  <del>{tempProduct.origin_price}</del>
                </p>
                元 / {tempProduct.price} 元
              </div>

              <h5 className="mt-3">更多圖片：</h5>
              <div className="d-flex flex-wrap">
                {tempProduct.imagesUrl?.map((url, index) => (
                  <img key={index} src={url} className="images" />
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={handleCloseProductDetailModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductDetailModal;
