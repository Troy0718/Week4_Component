import { useState, useEffect } from "react";
// import "./assets/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import axios from "axios";

const url = import.meta.env.VITE_URL;
const path = import.meta.env.VITE_PATH;

function LoginPage({ getProducts, setisAuth }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  //登入串接 POST API
  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/admin/signin`, formData);
      //儲存token
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(
        expired
      )}; path=/`;
      axios.defaults.headers.common.Authorization = token;
      // getProducts();
      setisAuth(true);
    } catch (error) {
      alert("登入失敗: " + error.response.data.message);
    }
  };

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      // 完整覆蓋
      ...formData, //展開，把原始物件展開帶入
      [name]: value,
    });
  }

  //驗證登入串接 POST API
  //1.會全部套用預設值
  //2.需要再執行其他需要驗證程式碼前加入
  //3.當呼叫其他API時需要移除
  const checkLogin = async () => {
    try {
      // const token = document.cookie.replace(
      //   /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      //   "$1"
      // );
      // axios.defaults.headers.common["Authorization"] = token;
      //1.會全部套用預設值
      //2.需要再執行其他需要驗證程式碼前加入
      //3.當呼叫其他API時需要移除
      await axios.post(`${url}/api/user/check`);
      getProducts();
      setisAuth(true);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // useEffect 只會執行一次，不會因為觸發事件而重新執行
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    checkLogin();
  }, []);
  return (
    <div className="container login">
      <div className="row d-flex justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal text-center">請先登入</h1>
        <div className="col">
          <form id="form" className="form-signin" onSubmit={login}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                name="username"
                id="username"
                placeholder="name@example.com"
                value={formData.username}
                onChange={handleInputChange}
                required
                autoFocus
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <button
              className="btn btn-lg btn-primary w-100 mt-3"
              type="submit"
              onClick={checkLogin}
            >
              登入
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
