import React from "react";
import { Image, Button, Card } from "antd";
import { Typography } from "antd";
import { Link } from "react-router-dom";
import { AppstoreAddOutlined, ImportOutlined } from "@ant-design/icons";

const { Title } = Typography;

function GetStarted() {
  return (
    <div style={{ margin: "auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "column",
        }}
      >
        <Title style={{ margin: "24px 0px" }} level={2}>
          New to Metaverse
        </Title>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "row",
        }}
      >
        <Card
          style={{
            width: 500,
            margin: "0px 16px",
            borderRadius: "12px",
          }}
          hoverable
        >
          <ImportOutlined style={{ fontSize: "32px", marginBottom: "16px" }} />
          <Title level={3}>No, I already have a Secret Phrase</Title>
          <p>Import your existing wallet using a Secret Recovery Phrase</p>
          <Link to="/import-secret">
            <Button
              style={{ margin: "18px 0px" }}
              type="primary"
              shape="round"
              size={"large"}
            >
              Import Wallet
            </Button>
          </Link>
        </Card>
        <Card
          style={{
            width: 400,
            margin: "0px 16px",
            borderRadius: "12px",
          }}
          hoverable
        >
          <ImportOutlined style={{ fontSize: "32px", marginBottom: "16px" }} />
          <Title level={3}>No, I already have a private key</Title>
          <p>Import your existing wallet using a Private Key</p>
          <Link to="/import-wallet">
            <Button
              style={{ margin: "18px 0px" }}
              type="primary"
              shape="round"
              size={"large"}
            >
              Import Wallet
            </Button>
          </Link>
        </Card>
        <Card
          style={{
            width: 400,
            margin: "0px 16px",
            borderRadius: "12px",
          }}
          hoverable
        >
          <AppstoreAddOutlined
            style={{ fontSize: "32px", marginBottom: "16px" }}
          />
          <Title level={3}>Yes, let’s get set up!</Title>
          <p>This will create a new wallet and Secret Recovery Phrase</p>
          <Link to="/create-wallet">
            <Button
              style={{ margin: "18px 0px" }}
              type="primary"
              shape="round"
              size={"large"}
            >
              Create Wallet
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default GetStarted;
