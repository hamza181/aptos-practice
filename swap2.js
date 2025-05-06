import axios from "axios";
import {
  AccountAddress,
  Account,
  Ed25519PrivateKey,
  Aptos,
  AptosConfig,
  Network,
} from "@aptos-labs/ts-sdk";

import dotenv from "dotenv";


dotenv.config({
  path: `.env`,
});
const { PRIVATE_KEY } = process.env;

const aptos = new Aptos(new AptosConfig({ network: Network.MAINNET }));

const myPrivateKey = PRIVATE_KEY;

export const myAccountAddress =
  "0xcb4c842efdde18072d22c03d34a886fed5c4e79e41ba8d31948900c04782b680";

const receiverAddress =
  "0x403dfa404945d8711f9ea7477ac36a283cdf6a9515c19af4a8f7b9fc1e5ba094";

const getAptosAccount = async () => {
  const privateKey = new Ed25519PrivateKey(myPrivateKey);
  const address = AccountAddress.from(myAccountAddress);
  if (!privateKey || !address) {
    throw new Error("No private key or address found in local storage");
  }
  const account = Account.fromPrivateKey({ privateKey });
  return account;
};
const calculateMaxGasAmountWithSwap = async (
  address,
  swapAmountAPT,
  maxGasCap = 20000
) => {
  const balanceOctas = await getAptosBalance(address); // in Octas
  const gasPrices = await aptos.getGasPriceEstimation();
  const gas_unit_price = gasPrices.prioritized_gas_estimate;

  const swapAmountOctas = Math.floor(swapAmountAPT * 1e8);
  const remainingOctas = balanceOctas - swapAmountOctas;

  if (remainingOctas <= 0) {
    throw new Error(`Not enough APT for gas after allocating ${swapAmountAPT} APT for the swap.`);
  }

  const usableOctas = remainingOctas * 0.9;
  const maxGasFromBalance = Math.floor(usableOctas / gas_unit_price);
  const maxGasAmount = Math.min(maxGasFromBalance, maxGasCap);

  const totalCost = swapAmountOctas + (gas_unit_price * maxGasAmount);
  if (totalCost > balanceOctas) {
    throw new Error(
      `Total cost exceeds available balance. Swap=${swapAmountAPT} APT, Gas=${(gas_unit_price * maxGasAmount / 1e8).toFixed(6)} APT, Balance=${(balanceOctas / 1e8).toFixed(6)} APT`
    );
  }

  return { maxGasAmount, gas_unit_price, swapAmountAPT };
};


const getAptosBalance = async (accountAddress) => {
  try {
    let amount = 0;
    amount = await aptos.getAccountAPTAmount({
      accountAddress,
    });
    console.log("🚀 ~ getAptosBalance ~ amount:", amount);
    // return amount * Math.pow(10, -8);
    return amount;
  } catch (error) {
    console.log(error);
  }
};
const simulateTransaction = async (payload, options) => {
  try {
    const aptosAccount = await getAptosAccount();

    const transaction = await aptos.transaction.build.simple({
      sender: aptosAccount?.accountAddress,
      data: {
        ...payload,
      },
      options,
    });
    const [userTransactionResponse] = await aptos.transaction.simulate.simple({
      signerPublicKey: aptosAccount?.publicKey,
      transaction,
    });
    return userTransactionResponse;
  } catch (error) {
    console.log("Error in simulating transaction:", error);
  }
};

const swapToken = async () => {
  const end_point = "https://api.panora.exchange/swap";
  const swapAmountAPT = 0.01; // Amount of APT to swap
  const query = {
    fromTokenAddress: '0x1::aptos_coin::AptosCoin',       // aptos address
    toTokenAddress: '0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b',   // usdt address
    toWalletAddress: '0xcb4c842efdde18072d22c03d34a886fed5c4e79e41ba8d31948900c04782b680',
    fromTokenAmount: swapAmountAPT,
  };
  const headers = {
    "x-api-key":
      "a4^KV_EaTf4MW#ZdvgGKX#HUD^3IFEAOV_kzpIE^3BQGA8pDnrkT7JcIy#HNlLGi",
  };

  const queryString = new URLSearchParams(query).toString();
  const url = `${end_point}?${queryString}`;

  const response = await axios.post(url, null, {
    maxBodyLength: Infinity,
    headers,
  });

  const swapInfo = response.data.quotes[0].txData;

  const payload = {
    function: swapInfo.function,
    typeArguments: swapInfo.type_arguments,
    functionArguments: swapInfo.arguments,
  };
  const { maxGasAmount, gas_unit_price } =
    await calculateMaxGasAmountWithSwap(myAccountAddress, swapAmountAPT);
  const res = await simulateTransaction(payload, {
    maxGasAmount: maxGasAmount,
  });
  return res;
};

const swapTransaction = await swapToken();
console.log('🚀 ~ swapTransaction:', swapTransaction);
