import React from "react";
import { Image, Button } from "antd";
import { Typography } from "antd";
import { Link } from "react-router-dom";
const { Title } = Typography;

function Main() {
  return (
    <div style={{ width: 500, margin: "auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "column",
        }}
      >
        <Image
          width={100}
          src="https://seeklogo.com/images/M/meta-icon-new-facebook-2021-logo-83520C311D-seeklogo.com.png"
        />
        <Title style={{ margin: "24px 0px" }} level={2}>
          Welcome to Metaverse
        </Title>
        <p style={{ fontSize: "18px" }}>
          Connecting you to Ethereum and the Decentralized Web. We’re happy to
          see you.
        </p>
        <Link to="/get-started">
          <Button
            style={{ margin: "18px 0px" }}
            type="primary"
            shape="round"
            size={"large"}
          >
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Main;
