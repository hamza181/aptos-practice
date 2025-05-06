import axios from "axios";
import { simulateTransaction } from "./index.js";

const swapToken = async () => {
  const end_point = "https://api.panora.exchange/swap";
  const query = {
    fromTokenAddress: '0x1::aptos_coin::AptosCoin',       // aptos address
    toTokenAddress: '0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b',   // usdt address
    toWalletAddress: '0xcb4c842efdde18072d22c03d34a886fed5c4e79e41ba8d31948900c04782b680',
    fromTokenAmount: 0.01,
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
  const res = await simulateTransaction(payload, {
    maxGasAmount: 20,
  });
  return res;
};

const swapTransaction = await swapToken();
console.log('🚀 ~ swapTransaction:', swapTransaction);
