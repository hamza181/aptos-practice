import axios from "axios";
import { myAccountAddress, simulateTransaction } from "./index.js";

const getMyTokens = async () => {
  const url = `https://asset.wapal.io/api/fungible-assets/balance/${myAccountAddress}?page=1&take=50`;

  try {
    const response = await axios.get(url, {
      maxBodyLength: Infinity,
    });

    return response.data;
  } catch (error) {
    // console.error(error);
    return []; // Return empty array if the request fails
  }
};

const tokens = await getMyTokens();
const senderToken = tokens?.[0];
const recipientToken = tokens?.[1];
const senderValue = 1000;

const getSwapInfoPanora = async () => {
  const url = "https://api.panora.exchange/swap?fromTokenAddress=0x1::aptos_coin::AptosCoin&toTokenAddress=0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b&toWalletAddress=0x8b884f225a161f7ecb89bd62f77b4abe01f5b5ee4e9d33c2c525a330a54a6d75&fromTokenAmount=0.1";

  const end_point = "https://api.panora.exchange/swap";
  const query = {
    // fromTokenAddress: senderToken?.assetType,
    // toTokenAddress: recipientToken?.assetType,
    fromTokenAddress: '0x1::aptos_coin::AptosCoin',
    toTokenAddress: '0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b',
    toWalletAddress: myAccountAddress,
    fromTokenAmount: +senderValue,
  };
  const headers = {
    "x-api-key":
      "a4^KV_EaTf4MW#ZdvgGKX#HUD^3IFEAOV_kzpIE^3BQGA8pDnrkT7JcIy#HNlLGi",
  };

  const queryString = new URLSearchParams(query).toString();
  // const url = `${end_point}?${queryString}`;

  try {
    const response = await axios.post(url, null, {
      maxBodyLength: Infinity,
      headers: headers,
    });

    return response.data; // returning result array with the data
  } catch (error) {
    // console.error(error);
    return []; // return empty array on failure
  }
};

const getSwapInfoPetra = async () => {
  try {
    const query = {
      aggregator: "kana",
      amountIn: senderValue,
      assetIn: senderToken?.assetType,
      assetOut: recipientToken?.assetType,
      destAddress: myAccountAddress,
      network: "mainnet",
      slippage: 0.5,
    };

    const queryString = new URLSearchParams(query).toString();
    // const url = `https://petra-pricing.petra-wallet.workers.dev/swaps/quote?${queryString}`;
    const url = `https://petra-pricing.petra-wallet.workers.dev/swaps/quote?aggregator=kana&amountIn=0.001&assetIn=0xa&assetOut=0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b&destAddress=0x8b884f225a161f7ecb89bd62f77b4abe01f5b5ee4e9d33c2c525a330a54a6d75&network=mainnet&slippage=0.5`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    // console.error(error);
    return {};
  }
};

// const swapInfoPetra = await getSwapInfoPetra();

const swapToken = async () => {
  const swapInfoPanora = await getSwapInfoPanora();

  const payload = {
    function: swapInfoPanora.quotes[0].txData.function,
    typeArguments: swapInfoPanora.quotes[0].txData.type_arguments,
    functionArguments: swapInfoPanora.quotes[0].txData.arguments,
  };
  console.log('🚀 ~ swapToken ~ payload:', payload);
  // const payload = {
  //   function: swapInfoPetra?.quotes[0]?.payload?.function,
  //   typeArguments: swapInfoPetra?.quotes[0]?.payload?.typeArguments,
  //   functionArguments: swapInfoPetra?.quotes[0]?.payload?.functionArguments,
  // };
  const res = await simulateTransaction(payload, {
    maxGasAmount: 20,
  });
  return res;
};

const swapTransaction = await swapToken();
console.log('🚀 ~ swapTransaction:', swapTransaction);
const networkFee = swapTransaction.gas_used * swapTransaction.gas_unit_price;
