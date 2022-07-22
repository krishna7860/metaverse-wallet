import React, { useState } from "react";
import { Image, Button, Card, Input, message } from "antd";
import { Typography } from "antd";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function ImportWallet() {
  const [privateKey, setPrivateKey] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const importWallet = () => {
    setLoading(true);
    if (!privateKey || !password) {
      message.error("Please input required fields");
      setLoading(false);
    }

    const wallet = new ethers.Wallet(privateKey);

    var privateKeyHash = CryptoJS.AES.encrypt(privateKey, password).toString();
    localStorage.setItem("privateKeyHash", privateKeyHash);
    localStorage.setItem("wallet", JSON.stringify(wallet));
    setTimeout(() => {
      setLoading(false);
      navigate("/congratulations");
    }, 1000);
  };

  return (
    <div style={{ margin: "auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-around",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginBottom: "24px",
          }}
        >
          <Image
            width={50}
            src="https://seeklogo.com/images/M/meta-icon-new-facebook-2021-logo-83520C311D-seeklogo.com.png"
          />
          <Title style={{ margin: "0px 8px" }} level={2}>
            Metaverse
          </Title>
        </div>
        <Title level={1}>Import a wallet with Secret Private Key</Title>
        <p style={{ width: "50%", textAlign: "justify" }}>
          Only the first account on this wallet will auto load. After completing
          this process, to add additional accounts, click the drop down menu,
          then select Create Account.
        </p>

        <Card
          style={{
            width: 500,
            textAlign: "left",
            borderRadius: "12px",
          }}
        >
          <Title level={4}>Enter Secret Private Key</Title>
          <Input.Password
            size="large"
            placeholder="Enter private key"
            onChange={(event) => setPrivateKey(event.target.value)}
          />

          <Title style={{ marginTop: "24px" }} level={4}>
            Enter Password
          </Title>
          <Input.Password
            onChange={(event) => setPassword(event.target.value)}
            size="large"
            placeholder="Enter password"
          />

          <Button
            style={{ marginTop: "24px", borderRadius: "4px" }}
            type="primary"
            size={"large"}
            onClick={importWallet}
            loading={loading}
          >
            Import Wallet
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default ImportWallet;
