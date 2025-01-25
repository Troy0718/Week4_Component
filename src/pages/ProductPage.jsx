import { useEffect, useState, useRef } from "react";
// import "./assets/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import axios from "axios";
import { Modal } from "bootstrap";
import Pagination from "../components/Pagination";
import ProductModal from "../components/ProductModal";
import DelProductModal from "../components/DelProductModal";
import ProductDetailModal from "../components/ProductDetailModal";
const url = import.meta.env.VITE_URL;
const path = import.meta.env.VITE_PATH;
let defaultModalState = {
  id: "",
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: false,
  imagesUrl: [],
};

function ProductPage({ setisAuth }) {
  const [pageInfo, setPageInfo] = useState({});
  const [modalMode, setModalMode] = useState(null);
  const [products, setProducts] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);

  const [isProductDetailModalOpen, setIsProductDetailModalOpen] =
    useState(false);

  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const handlePageChange = (page) => {
    getProducts(page);
  };

  //取得productModal的Dom元素

  //取得產品資料串接 GET API
  const getProducts = async function (page = 1) {
    try {
      const response = await axios.get(
        `${url}/api/${path}/admin/products?page=${page}`
      );
      setProducts(response.data.products);
      setPageInfo(response.data.pagination);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  //打開 刪除產品Modal
  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);
    setIsDelProductModalOpen(true);
  };

  //打開 查看細節Modal
  const handleOpenProductDetailModal = (product) => {
    setTempProduct(product);
    setIsProductDetailModalOpen(true);
  };

  //打開 編輯、新增產品Modal
  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    switch (mode) {
      case "create":
        setTempProduct(defaultModalState);
        // console.log(tempProduct);
        break;
      case "edit":
        setTempProduct(product);
        // console.log(tempProduct);
        break;
      default:
        break;
    }
    // setTempProduct(product);
    setIsProductModalOpen(true);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row mt-5">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2>產品列表</h2>
              <button
                className="btn btn-primary"
                onClick={() => handleOpenProductModal("create")}
                type="button"
              >
                建立新的產品
              </button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="120">是否啟用</th>
                  <th width="120">編輯</th>
                  <th width="120">查看細節</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.category}</td>
                      <td>{product.title}</td>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>
                        {product.is_enabled ? (
                          <span className="text-success">啟用</span>
                        ) : (
                          <span>未啟用</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() =>
                              handleOpenProductModal("edit", product)
                            }
                          >
                            編輯
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              handleOpenDelProductModal(product);
                            }}
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleOpenProductDetailModal(product)}
                        >
                          查看細節
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">尚無產品資料</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/**頁碼 */}
        <Pagination
          pageInfo={pageInfo}
          handlePageChange={handlePageChange}
        ></Pagination>
      </div>

      {/** 新增、編輯按鈕跳出的Modal */}
      <ProductModal
        tempProduct={tempProduct}
        modalMode={modalMode}
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
        getProducts={getProducts}
      />

      {/**刪除按鈕跳出的Modal */}
      <DelProductModal
        tempProduct={tempProduct}
        getProducts={getProducts}
        isOpen={isDelProductModalOpen}
        setIsOpen={setIsDelProductModalOpen}
      />
      {/** 顯示產品細節Modal */}
      <ProductDetailModal
        tempProduct={tempProduct}
        getProducts={getProducts}
        isOpen={isProductDetailModalOpen}
        setIsOpen={setIsProductDetailModalOpen}
      />
    </>
  );
}

export default ProductPage;
