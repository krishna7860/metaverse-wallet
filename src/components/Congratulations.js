import React from "react";
import { Image, Button, Card } from "antd";
import { Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

function Congratulations() {
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
        <Title
          style={{
            marginTop: "24px",
          }}
          level={1}
        >
          Congratulations
        </Title>
        <p style={{ width: "100%", textAlign: "justify", fontSize: "18px" }}>
          You passed the test - keep your Secret Recovery Phrase safe, it's your
          responsibility!
        </p>

        <div
          style={{
            width: 500,
            textAlign: "left",
            borderRadius: "12px",
            margin: "24px 0px",
          }}
        >
          <Title level={4}>Tips on storing it safely</Title>
          <Paragraph
            style={{
              fontSize: "16px",
            }}
          >
            <ul>
              <li>Save a backup in multiple places.</li>
              <li>Never share the phrase with anyone.</li>
              <li>
                Be careful of phishing! MetaMask will never spontaneously ask
                for your Secret Recovery Phrase.
              </li>
              <li>
                If you need to back up your Secret Recovery Phrase again, you
                can find it in Settings -> Security.
              </li>
            </ul>
          </Paragraph>
          <Link to="/wallet">
            <Button
              style={{ marginTop: "24px", borderRadius: "4px" }}
              type="primary"
              size={"large"}
            >
              All Done
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Congratulations;
