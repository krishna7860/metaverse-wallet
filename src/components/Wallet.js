import React, { useEffect, useState } from "react";
import {
  Image,
  Button,
  Card,
  Input,
  message,
  Tag,
  Badge,
  Tooltip,
  Spin,
  List,
} from "antd";
import { Typography } from "antd";
import { ethers } from "ethers";
import Common, { Chain, Hardfork } from "@ethereumjs/common";
import { FeeMarketEIP1559Transaction, Transaction } from "@ethereumjs/tx";
import {
  CheckCircleOutlined,
  SearchOutlined,
  SendOutlined,
} from "@ant-design/icons";
import CryptoJS from "crypto-js";
const bip39 = require("bip39");
const { hdkey } = require("ethereumjs-wallet");

const { Title } = Typography;

function Wallet() {
  const [wallet, setWallet] = useState({});
  const [balance, setBalance] = useState(0);
  const [isValidAddress, setValidAddress] = useState(true);
  const [toWalletAddress, setToWalletAddress] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [pendingState, setPendingState] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [extraAction, setExtraAction] = useState(false);
  const [activeTxData, setActiveTxData] = useState({});
  const [wallets, setAllWallets] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const wallet = JSON.parse(localStorage.getItem("wallet"));
    setWallet(wallet);
    const provider = new ethers.getDefaultProvider(4);
    let etherscan = new ethers.providers.EtherscanProvider("rinkeby");
    let history = await etherscan.getHistory(wallet?.address);
    setAllTransaction(history.sort((a, b) => b.nonce - a.nonce));
    let balance = await provider.getBalance(wallet.address);
    const formatedBalance = Number(ethers.utils.formatEther(balance._hex));
    console.log(formatedBalance);
    setBalance(formatedBalance.toFixed(4));
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const provider = new ethers.getDefaultProvider(4);
    let etherscan = new ethers.providers.EtherscanProvider("rinkeby");
    let history = await etherscan.getHistory(wallet?.address);
    setAllTransaction(history.sort((a, b) => b.nonce - a.nonce));
    let balance = await provider.getBalance(wallet.address);
    const formatedBalance = Number(ethers.utils.formatEther(balance._hex));
    console.log(formatedBalance);
    setBalance(formatedBalance.toFixed(4));
  }, [wallet]);

  useEffect(() => {
    fetchAllWallet();
  }, []);

  const fetchAllWallet = () => {
    let wallets = JSON.parse(localStorage.getItem("privateKeyHashes")) || [];
    console.log(wallets);
    const password = localStorage.getItem("password");

    const fetchedWallets = [];

    wallets.forEach(async (key) => {
      var bytes = CryptoJS.AES.decrypt(key, password);
      const privateKey = CryptoJS.enc.Utf8.stringify(bytes);
      const wallet = new ethers.Wallet(privateKey);
      console.log(wallet);
      fetchedWallets.push(wallet);
    });
    console.log(fetchedWallets);
    setAllWallets(fetchedWallets);
  };

  const verifyWalletAddress = (e) => {
    const walletAddress = e.target.value;
    setToWalletAddress(walletAddress);

    if (!walletAddress) {
      console.log("demo");
      setValidAddress(true);
      return;
    }

    try {
      const isValidAddress = ethers.utils.getAddress(walletAddress);
      if (isValidAddress) {
        setValidAddress(true);
      }
    } catch (e) {
      setValidAddress(false);
    }

    console.log(isValidAddress);
  };

  const calculateGasFees = async (e) => {
    let etheramount = e.target.value;
    if (e.target.value == "") {
      return;
    }
    setAmountToSend(etheramount);
  };

  const createAccount = async () => {
    const hashedSeed = localStorage.getItem("seedPhrase");
    const password = localStorage.getItem("password");
    const child = JSON.parse(localStorage.getItem("privateKeyHashes")).length;

    var bytes = CryptoJS.AES.decrypt(hashedSeed, password);
    const seedPhrase = CryptoJS.enc.Utf8.stringify(bytes);

    console.log(seedPhrase);

    const binarySeed = await bip39.mnemonicToSeed(seedPhrase);

    const hdwallet = hdkey.fromMasterSeed(binarySeed);

    const path = "m/44'/60'/0'/0";
    const wallet = hdwallet.derivePath(path).deriveChild(child).getWallet();
    const address = `0x${wallet.getAddress().toString("hex")}`;

    const privateKey = wallet.getPrivateKey().toString("hex");
    var privateKeyHash = CryptoJS.AES.encrypt(privateKey, password).toString();

    const privateKeyHashes = localStorage.getItem("privateKeyHashes")
      ? JSON.parse(localStorage.getItem("privateKeyHashes"))
      : [];

    privateKeyHashes.push(privateKeyHash);

    localStorage.setItem("privateKeyHashes", JSON.stringify(privateKeyHashes));
    fetchAllWallet();
  };

  const setMax = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/475c41bbac2b4a3887d436654a951c6b",
      4
    );
    const signer = new ethers.VoidSigner(wallet.address, provider);

    const gasFees = await signer.getFeeData();

    const baseGas = ethers.BigNumber.from("21000");

    console.log(gasFees.gasPrice.toNumber(), baseGas.toNumber());

    let gasPrice = gasFees.gasPrice.mul(baseGas._hex);

    console.log(gasPrice.toNumber());

    setAmountToSend(ethers.utils.formatEther(balance, "gwei") - gasPrice);
  };

  const speedUpTransaction = async () => {
    const common = new Common({
      chain: Chain.Rinkeby,
      hardfork: Hardfork.London,
    });

    const txParams = activeTxData;
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/475c41bbac2b4a3887d436654a951c6b",
      4
    );

    console.log(activeTransaction);
    const gasFees = activeTransaction.gasPrice;

    let gasPrice = gasFees.add(gasFees.div(5));

    console.log(gasPrice.toString());
    txParams.gasPrice = gasPrice._hex;

    console.log(gasFees.toNumber(), gasPrice.toNumber());

    console.log(gasPrice.toNumber(), "fast Transaction");

    const tx = Transaction.fromTxData(txParams, { common });

    const pk = localStorage.getItem("privateKey")
      ? localStorage.getItem("privateKey").slice(2)
      : "ecbc1c5fcb582c701a378ec77295d96198a231cbe01863717c9a38977c35504e";

    console.log(pk);

    const privateKey = Buffer.from(pk, "hex");

    const signedTx = tx.sign(privateKey);

    const serializedTx = signedTx.serialize().toString("hex");
    let transaction = await provider.sendTransaction("0x" + serializedTx);
    setActiveTransaction(transaction);
    message.success("Transaction speedup");
    setPendingState(true);
    setLoading(false);
    setTimeout(() => {
      setExtraAction(true);
    }, 1000);
    try {
      await transaction.wait();

      setPendingState(false);
      setToWalletAddress("");
      setAmountToSend("");
      setTimeout(async () => {
        let etherscan = new ethers.providers.EtherscanProvider("rinkeby");
        let history = await etherscan.getHistory(wallet?.address);
        setAllTransaction(history.sort((a, b) => b.nonce - a.nonce));
        setActiveTransaction(null);
      }, 2000);
    } catch (e) {
      message.warning("Previous transaction cancelled");
    }
  };

  const cancelTransaction = async () => {
    const common = new Common({
      chain: Chain.Rinkeby,
      hardfork: Hardfork.London,
    });

    const txParams = activeTxData;
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/475c41bbac2b4a3887d436654a951c6b",
      4
    );

    const gasFees = activeTransaction.gasPrice;

    let gasPrice = gasFees.add(gasFees.div(5));

    console.log(gasPrice.toString());
    txParams.gasPrice = gasPrice._hex;

    const amount = ethers.BigNumber.from(ethers.utils.parseEther("0"));
    txParams.value = amount._hex;

    const tx = Transaction.fromTxData(txParams, { common });

    const pk = localStorage.getItem("privateKey")
      ? localStorage.getItem("privateKey").slice(2)
      : "ecbc1c5fcb582c701a378ec77295d96198a231cbe01863717c9a38977c35504e";

    console.log(pk);

    const privateKey = Buffer.from(pk, "hex");

    const signedTx = tx.sign(privateKey);

    const serializedTx = signedTx.serialize().toString("hex");
    let transaction = await provider.sendTransaction("0x" + serializedTx);
    setActiveTransaction(transaction);
    message.success("Transaction speedup");
    setPendingState(true);
    setLoading(false);
    setTimeout(() => {
      setExtraAction(true);
    }, 1000);
    try {
      await transaction.wait();
      message.success("transaction cancelled");
      setPendingState(false);
      setToWalletAddress("");
      setAmountToSend("");
      setTimeout(async () => {
        let etherscan = new ethers.providers.EtherscanProvider("rinkeby");
        let history = await etherscan.getHistory(wallet?.address);
        setAllTransaction(history.sort((a, b) => b.nonce - a.nonce));
        setActiveTransaction(null);
      }, 2000);
    } catch (e) {
      message.warning("Previous transaction cancelled");
    }
  };

  const sendEther = async () => {
    if (toWalletAddress || amountToSend) {
      setLoading(true);
      console.log(wallet);
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rinkeby.infura.io/v3/475c41bbac2b4a3887d436654a951c6b",
        4
      );
      const signer = new ethers.VoidSigner(wallet.address, provider);

      const amount = ethers.BigNumber.from(
        ethers.utils.parseEther(amountToSend)
      );

      const gasFees = await signer.getFeeData();
      const nonce = await signer.getTransactionCount();
      console.log(wallet, nonce);
      console.log(gasFees, amount, nonce);

      const common = new Common({
        chain: Chain.Rinkeby,
        hardfork: Hardfork.London,
      });

      const lowPrice = ethers.BigNumber.from("10");

      let gasPrice = gasFees.gasPrice.sub(lowPrice._hex);

      console.log(gasPrice.toNumber(), "Normal Transaction");
      const txParams = {
        nonce,
        gasPrice: gasPrice._hex,
        gasLimit: "0xc350",
        to: toWalletAddress,
        value: amount._hex,
        data: "0x00",
      };

      console.log(txParams);

      setActiveTxData(txParams);

      const tx = Transaction.fromTxData(txParams, { common });

      const pk = wallet.privateKey
        ? wallet.privateKey.slice(2)
        : "ecbc1c5fcb582c701a378ec77295d96198a231cbe01863717c9a38977c35504e";

      console.log(pk);

      const privateKey = Buffer.from(pk, "hex");

      const signedTx = tx.sign(privateKey);

      const serializedTx = signedTx.serialize().toString("hex");
      let transaction = await provider.sendTransaction("0x" + serializedTx);
      setActiveTransaction(transaction);
      setPendingState(true);
      setLoading(false);
      setTimeout(() => {
        setExtraAction(true);
      }, 1000);
      try {
        await transaction.wait();
        setPendingState(false);

        setToWalletAddress("");
        setAmountToSend("");
        setTimeout(async () => {
          let etherscan = new ethers.providers.EtherscanProvider("rinkeby");
          let history = await etherscan.getHistory(wallet?.address);
          setAllTransaction(history.sort((a, b) => b.nonce - a.nonce));
          setActiveTransaction(null);
        }, 2000);
      } catch (e) {
        message.warning("Previous transaction cancelled");
      }
    } else {
      message.error("Please enter required fields");
    }
  };

  return (
    <div
      style={{
        margin: "auto",
        padding: "24px",
      }}
    >
      <div
        style={{
          margin: "auto",
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexDirection: "row",
              margin: "0px 24px",
              width: "500px",
            }}
          >
            <Title style={{ margin: "0px 8px" }} level={2}>
              All Wallets
            </Title>
            <Button onClick={createAccount}>Create Account</Button>
          </div>
          <div>
            <List
              itemLayout="horizontal"
              dataSource={wallets}
              renderItem={(item) => (
                <List.Item
                  style={{ cursor: "pointer" }}
                  onClick={() => setWallet(item)}
                >
                  <div style={{ textAlign: "left" }}>
                    address: {item.address}
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Card>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-around",
            flexDirection: "column",
            margin: "0px  24px",
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
          <Title level={3}>Welcome to Metaverse Wallet</Title>
          <p style={{ width: "50%", textAlign: "justify" }}></p>

          <Card
            style={{
              width: 500,
              textAlign: "left",
              borderRadius: "12px",
            }}
          >
            <Tag color="success">
              <Badge status="success" />
              Rinkeby
            </Tag>

            <Title style={{ marginTop: "24px" }} level={5}>
              Account 1
            </Title>
            <p style={{ color: "grey" }}>{wallet.address}</p>

            <Title level={2}>{balance} ETH</Title>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Input
                style={{ margin: "16px 0px", borderRadius: "8px" }}
                type="text"
                placeholder="Enter Wallet Address"
                onChange={verifyWalletAddress}
                value={toWalletAddress}
              ></Input>
              {isValidAddress ? null : (
                <span style={{ color: "red" }}>
                  Please enter a valid etherium address
                </span>
              )}
              <Input
                style={{ margin: "16px 0px", borderRadius: "8px" }}
                type="number"
                min={0}
                placeholder="Enter Amount ETH"
                onChange={calculateGasFees}
                value={amountToSend}
              ></Input>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Button
                size="large"
                disabled={!isValidAddress}
                onClick={setMax}
                loading={loading}
              >
                Set Max
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Tooltip title="Send">
                <Button
                  shape="circle"
                  type="primary"
                  icon={<SendOutlined />}
                  size="large"
                  disabled={!isValidAddress}
                  onClick={sendEther}
                  loading={loading}
                />
              </Tooltip>
              <p>Send ETH</p>
            </div>
          </Card>
          {activeTransaction && (
            <div>
              <p>nonce: {activeTransaction.nonce}</p>
              <p>hash: {activeTransaction.hash}</p>
              <p>gasFees: {activeTransaction.gasPrice.toNumber()}</p>
              <p>
                {pendingState ? (
                  <span>
                    Pending <Spin />
                  </span>
                ) : (
                  <Tag color="success">
                    <Badge status="success" />
                    success
                  </Tag>
                )}
              </p>
              <p>
                {extraAction && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button onClick={speedUpTransaction}>Speed Up</Button>
                    <Button onClick={cancelTransaction}>
                      Cancel Transaction
                    </Button>
                  </div>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
      <Card
        style={{
          maxHeight: "550px",
          overflowY: "scroll",
          minWidth: "600px",
          borderRadius: "12px",
          marginLeft: "24px",
          marginTop: "24px",
        }}
      >
        <Title level={3}>Transaction</Title>
        <List
          itemLayout="horizontal"
          dataSource={allTransaction}
          renderItem={(item) => (
            <List.Item>
              <div style={{ textAlign: "left" }}>
                <b style={{ display: "flex" }}>
                  {item.to === wallet.address ? "Recieve" : "Send"}{" "}
                  <p style={{ marginLeft: "12px" }}>nonce: {item.nonce}</p>
                </b>

                <p>hash: {item.hash}</p>
                <p>from: {item.from}</p>
                <p>to: {item.to}</p>
                <p>created: {Date(item.timestamp)}</p>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default Wallet;
