import { useEffect, useState, useRef } from "react";
// import "./assets/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import axios from "axios";
import { Modal } from "bootstrap";

const url = import.meta.env.VITE_URL;
const path = import.meta.env.VITE_PATH;

function ProductModal({
  modalMode,
  tempProduct,
  isOpen,
  setIsOpen,
  getProducts,
}) {
  const productModalRef = useRef(null);
  const [modalData, setModalData] = useState(tempProduct);
  useEffect(() => {
    setModalData({
      ...tempProduct,
    });
  }, [tempProduct]);

  useEffect(() => {
    new Modal(productModalRef.current, {
      backdrop: false,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(productModalRef.current);
      modalInstance.show();
    }
  }, [isOpen]);

  //新增產品POST API
  const createProduct = async () => {
    try {
      await axios.post(`${url}/api/${path}/admin/product`, {
        data: {
          ...modalData,
          origin_price: Number(modalData.origin_price),
          price: Number(modalData.price),
          is_enabled: modalData.is_enabled ? 1 : 0,
        },
      });
      // console.log(res);
    } catch (error) {
      console.error("Error during product creation:", error);
      alert(
        "新增產品失敗：" +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  //更新產品PUT API
  const updateProduct = async () => {
    try {
      await axios.put(`${url}/api/${path}/admin/product/${modalData.id}`, {
        data: {
          ...modalData,
          origin_price: Number(modalData.origin_price),
          price: Number(modalData.price),
          is_enabled: modalData.is_enabled ? 1 : 0,
        },
      });
    } catch (error) {
      alert(
        "編輯產品失敗" +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };
  //Modal input:text輸入框
  function handleModalInputChange(e) {
    const { name, value, checked, type } = e.target;
    setModalData({
      // 完整覆蓋
      ...modalData, //展開，把原始物件展開帶入
      [name]: type === "checkbox" ? checked : value,
    });
    console.log(modalData);
  }

  //Modal 副圖網址輸入框
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...modalData.imagesUrl];
    newImages[index] = value;
    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  //Modal 新增圖片
  const handleAddImage = () => {
    const newImages = [...modalData.imagesUrl, ""];
    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  //綁定Modal的確認按鈕觸發新增 更新產品
  const handleUpdateProduct = async () => {
    try {
      const apiCall = modalMode == "create" ? createProduct : updateProduct;
      await apiCall();
      getProducts();
      handleCloseProductModal();
    } catch (error) {
      alert(error.response ? error.response.data.message : error.message);
    }
  };

  const handleFileChange = async (e) => {
    console.log(e.target);
    const file = e.target.files[0];
    const formImgData = new FormData();
    formImgData.append("file-to-upload", file);
    console.log(formImgData);
    try {
      const response = await axios.post(
        `${url}/api/${path}/admin/upload`,
        formImgData
      );
      const uploadedImageUrl = response.data.imageUrl;
      setModalData({
        ...modalData,
        imageUrl: uploadedImageUrl,
      });
    } catch (error) {
      console.error(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  //Modal 刪除圖片
  const handleRemoveImage = () => {
    const newImages = [...modalData.imagesUrl];
    newImages.pop();
    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  //關閉 刪除產品Modal
  const handleCloseProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);

    modalInstance.hide();
    setIsOpen(false);
  };

  return (
    <div
      className="modal fade"
      id="productModal"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
      ref={productModalRef}
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div className={`modal-header border-bottom `}>
            <h5 id="productModalLabel" className="modal-title">
              <span>{modalMode === "create" ? "新增產品" : "編輯產品"}</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleCloseProductModal}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-sm-4">
                <div className="mb-2">
                  <div className="mb-5">
                    <label htmlFor="fileInput" className="form-label">
                      {" "}
                      圖片上傳{" "}
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="form-control"
                      id="fileInput"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">
                      主圖
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="imageUrl"
                      placeholder="請輸入圖片連結"
                      name="imageUrl"
                      value={modalData.imageUrl}
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <img
                    className="img-fluid"
                    src={modalData.imageUrl} // 確保 imageUrl 不為 undefined
                    alt={modalData.title} // 確保 title 也不為undefined undefined
                  />
                </div>
                {/**副圖 */}
                <div className="border border-2 border-dashed rounded-3 p-3">
                  {modalData.imagesUrl?.map((image, index) => (
                    <div key={index} className="mb-2">
                      <label
                        htmlFor={`imagesUrl-${index + 1}`}
                        className="form-label"
                      >
                        副圖 {index + 1}
                      </label>
                      <input
                        id={`imagesUrl-${index + 1}`}
                        name={`imagesUrl-${index + 1}`}
                        type="text"
                        value={image}
                        onChange={(e) => handleImageChange(e, index)}
                        placeholder={`圖片網址 ${index + 1}`}
                        className="form-control mb-2"
                      />
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className="img-fluid mb-2"
                        />
                      )}
                    </div>
                  ))}
                  {/** 副圖最後一圖為空表示無圖，仍可新增 */}
                  <div className="d-flex justify-content-between">
                    {modalData.imagesUrl?.length < 5 &&
                      modalData.imagesUrl[modalData.imagesUrl.length - 1] !==
                        "" && (
                        <button
                          className="btn btn-outline-primary btn-sm w-100"
                          onClick={handleAddImage}
                        >
                          新增圖片
                        </button>
                      )}
                    {/** 副圖只要大於一圖時可刪圖 */}
                    {modalData.imagesUrl?.length > 1 && (
                      <button
                        className="btn btn-outline-danger btn-sm w-100"
                        onClick={handleRemoveImage}
                      >
                        取消圖片
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-sm-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                    name="title"
                    value={modalData.title}
                    onChange={handleModalInputChange}
                  />
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      id="category"
                      type="text"
                      name="category"
                      className="form-control"
                      placeholder="請輸入分類"
                      value={modalData.category}
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      id="unit"
                      name="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                      value={modalData.unit}
                      onChange={handleModalInputChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      id="origin_price"
                      name="origin_price"
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="請輸入原價"
                      value={modalData.origin_price}
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="請輸入售價"
                      value={modalData.price}
                      onChange={handleModalInputChange}
                    />
                  </div>
                </div>
                <hr />
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    placeholder="請輸入產品描述"
                    value={modalData.description}
                    onChange={handleModalInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    className="form-control"
                    placeholder="請輸入說明內容"
                    value={modalData.content}
                    onChange={handleModalInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      id="is_enabled"
                      name="is_enabled"
                      className="form-check-input"
                      type="checkbox"
                      value={modalData.is_enabled}
                      checked={modalData.is_enabled}
                      onChange={handleModalInputChange}
                    />
                    <label className="form-check-label" htmlFor="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
              onClick={handleCloseProductModal}
            >
              取消
            </button>
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateProduct}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductModal;
