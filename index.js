// import {
//   AccountAddress,
//   Account,
//   Ed25519PrivateKey,
//   Aptos,
//   AptosConfig,
//   Network,
// } from "@aptos-labs/ts-sdk";

import { constants } from "./src/constants/index.js";
import { Spin } from "./src/spin/index.js";
import dotenv from 'dotenv';
dotenv.config();

// import dotenv from "dotenv";

// dotenv.config({
//   path: `.env`,
// });

// export const { PRIVATE_KEY } = process.env;

// const aptos = new Aptos(new AptosConfig({ network: Network.MAINNET }));

// const myPrivateKey = PRIVATE_KEY;

// export const myAccountAddress =
//   "0xcb4c842efdde18072d22c03d34a886fed5c4e79e41ba8d31948900c04782b680";

// const receiverAddress =
//   "0x403dfa404945d8711f9ea7477ac36a283cdf6a9515c19af4a8f7b9fc1e5ba094";

// const getAptosAccount = async () => {
//   const privateKey = new Ed25519PrivateKey(myPrivateKey);
//   const address = AccountAddress.from(myAccountAddress);
//   if (!privateKey || !address) {
//     throw new Error("No private key or address found in local storage");
//   }
//   const account = Account.fromPrivateKey({ privateKey });
//   return account;
// };

// export const simulateTransaction = async (payload, options) => {
//   try {
//     const aptosAccount = await getAptosAccount();

//     const transaction = await aptos.transaction.build.simple({
//       sender: aptosAccount?.accountAddress,
//       data: {
//         ...payload,
//       },
//       options,
//     });
//     const [userTransactionResponse] = await aptos.transaction.simulate.simple({
//       signerPublicKey: aptosAccount?.publicKey,
//       transaction,
//     });
//     return userTransactionResponse;
//   } catch (error) {
//     console.log("Error in simulating transaction:", error);
//   }
// };

// const getAptosBalance = async (accountAddress) => {
//   try {
//     let amount = 0;
//     amount = await aptos.getAccountAPTAmount({
//       accountAddress,
//     });
//     // return amount * Math.pow(10, -8);
//     return amount;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const myBalance = await getAptosBalance(myAccountAddress);
// // const sendingAmount = 0.001 * Math.pow(10, 8);
// const sendingAmount = 1000; // 0.00001 APT
// let payload = {
//   //   function: "0x1::aptos_account::transfer_coins",
//   function: "0x1::coin::transfer",
//   functionArguments: [receiverAddress, sendingAmount],
//   typeArguments: ["0x1::aptos_coin::AptosCoin"],

// };

// const options = {
//   // maxGasAmount: myBalance - (sendingAmount + 1000),
//   maxGasAmount: 20,
// };

// let simulateResult = await simulateTransaction(payload, options);
// const networkFee = simulateResult.gas_used * simulateResult.gas_unit_price;

Spin();
