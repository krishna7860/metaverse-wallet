import React, { useState } from "react";
import { Image, Button, Card, Input, message } from "antd";
import { Typography } from "antd";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function CreateWallet() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createWallet = () => {
    setLoading(true);
    if (!password) {
      message.error("Please input required fields");
      setLoading(false);
    }

    const wallet = ethers.Wallet.createRandom();

    console.log(wallet.privateKey);

    var privateKeyHash = CryptoJS.AES.encrypt(
      wallet.privateKey,
      password
    ).toString();

    localStorage.setItem("privateKeyHash", privateKeyHash);
    localStorage.setItem("wallet", JSON.stringify(wallet));
    localStorage.setItem("privateKey", wallet.privateKey);

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
        <Title level={1}>Create Wallet</Title>
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
          <Title style={{ marginTop: "24px" }} level={4}>
            Enter Password
          </Title>
          <Input.Password
            onChange={(event) => setPassword(event.target.value)}
            size="large"
            placeholder="Enter password"
          />
          <Link to="/get-started">
            <Button
              style={{ marginTop: "24px", borderRadius: "4px" }}
              type="primary"
              size={"large"}
              onClick={createWallet}
              loading={loading}
            >
              Create Wallet
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default CreateWallet;
