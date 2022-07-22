// import logo from "./logo.svg";
import "./App.css";
import { Layout } from "antd";
import { Routes, Route, Link } from "react-router-dom";
import Main from "./components/Main";
import GetStarted from "./components/GetStarted";
import ImportWallet from "./components/ImportWallet";
import CreateWallet from "./components/CreateWallet";
import Congratulations from "./components/Congratulations";
import Wallet from "./components/Wallet";
import { useState } from "react/cjs/react.development";
import { useEffect } from "react";
import ImportSecretPhrase from "./components/ImportSecretPhrase";

function App() {
  const [isWalletLoaded, setIsWalletLoaded] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem("wallet") &&
      localStorage.getItem("privateKeyHash")
    ) {
      setIsWalletLoaded(true);
    }
  }, []);

  return (
    <div className="App">
      <Layout
        style={{
          height: "100vh",
          background: "white",
        }}
      >
        <Routes>
          <Route path="/get-started" element={<GetStarted />}></Route>
          <Route path="/import-wallet" element={<ImportWallet />}></Route>
          <Route path="/import-secret" element={<ImportSecretPhrase />}></Route>
          <Route path="/create-wallet" element={<CreateWallet />}></Route>
          <Route path="/congratulations" element={<Congratulations />}></Route>
          <Route path="/wallet" element={<Wallet />}></Route>
          <Route
            path="/"
            element={isWalletLoaded ? <Wallet /> : <Main />}
          ></Route>
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
