// const { AccountAddress, Account } = require("@aptos-labs/ts-sdk");
import {
  AccountAddress,
  Account,
  Ed25519PrivateKey,
  Aptos,
  AptosConfig,
  Network,
} from "@aptos-labs/ts-sdk";

const aptos = new Aptos(new AptosConfig({ network: Network.MAINNET }));

// Reuse same Aptos instance to utilize cookie based sticky routing
function aptosClient() {
  return aptos;
}

const myPrivateKey =
  "0xe9f94eac16236da45918a07e228ebd1f05523e0880a10d65194108ae30317980";

const myAccountAddress =
  "0x8b884f225a161f7ecb89bd62f77b4abe01f5b5ee4e9d33c2c525a330a54a6d75";

const getAptosAccount = async () => {
  const privateKey = new Ed25519PrivateKey(myPrivateKey);
  const address = AccountAddress.from(myAccountAddress);
  if (!privateKey || !address) {
    throw new Error("No private key or address found in local storage");
  }
  const account = Account.fromPrivateKey({ privateKey, address });
  return account;
};

const simulateTransaction = async (payload) => {
  try {
    const aptos = aptosClient();
    const aptosAccount = await getAptosAccount();

    const transaction = await aptos.transaction.build.simple({
      sender: aptosAccount?.accountAddress,
      data: {
        ...payload,
      },
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

const getAptosBalance = async (accountAddress) => {
  try {
    let amount = 0;
    amount = await aptos.getAccountAPTAmount({
      accountAddress,
    });
    return amount * Math.pow(10, -8);
  } catch (error) {
    console.log(error);
  }
};

const myBalance = await getAptosBalance(myAccountAddress);
console.log("🚀 ~ index.js:64 ~ myBalance:", myBalance);

const sendingAmount = 0.001 * Math.pow(10, 8);

console.log('🚀 ~ index.js:72 ~ sendingAmount:', sendingAmount);

let payload = {
  function: "0x1::aptos_account::transfer_coins",
  functionArguments: [
    "0x403dfa404945d8711f9ea7477ac36a283cdf6a9515c19af4a8f7b9fc1e5ba094",
    sendingAmount,
  ],
  typeArguments: ["0x1::aptos_coin::AptosCoin"],
};

let simulateResult = await simulateTransaction(payload);

console.log("🚀 ~ index.js:73 ~ simulateResult:", simulateResult);
