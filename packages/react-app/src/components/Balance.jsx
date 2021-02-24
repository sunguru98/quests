import styles from "./Balance.module.scss"
import React, { useState } from "react";
import { formatEther } from "@ethersproject/units";
import { usePoller } from "eth-hooks";

/*

  <Balance
    address={selectedAddress}
    provider={props.provider}
    dollarMultiplier={props.price}
  />

*/


export default function Balance(props) {
  const [dollarMode, setDollarMode] = useState(true);
  const [balance, setBalance] = useState();

  const getBalance = async () => {
    if (props.address && props.provider) {
      try {
        const newBalance = await props.provider.getBalance(props.address);
        setBalance(newBalance);
      } catch (e) {
        console.log(e);
      }
    }
  };

  usePoller(
    () => {
      getBalance();
    },
    props.pollTime ? props.pollTime : 1999,
  );

  let floatBalance = parseFloat("0.00");

  let usingBalance = balance;

  if (typeof props.balance !== "undefined") {
    usingBalance = props.balance;
  }

  if (usingBalance) {
    const etherBalance = formatEther(usingBalance);
    parseFloat(etherBalance).toFixed(2);
    floatBalance = parseFloat(etherBalance);
  }

  let displayBalance = floatBalance.toFixed(4) + " ETH";

  if (props.dollarMultiplier && dollarMode) {
    displayBalance = "$" + (floatBalance * props.dollarMultiplier).toFixed(2);
  }

  return (
    <span
      style={{ fontSize: props.size ? props.size : 24 }}
      className={`${styles.balance} p-8`}
      onClick={() => {
        setDollarMode(!dollarMode);
      }}
    >
      {displayBalance}
    </span>
  );
}
