import dotenv from "dotenv";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
const { encodeBase64 } = naclUtil;
import { Account, AccountAddress, Ed25519PrivateKey, PrivateKey } from "@aptos-labs/ts-sdk";
import { HexString } from "aptos";

dotenv.config({
  path: `.env`,
});

export const { PRIVATE_KEY } = process.env;
const walletAddress =
  "0xcb4c842efdde18072d22c03d34a886fed5c4e79e41ba8d31948900c04782b680";

const makeId = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const getAptosAccount = async () => {
  const privateKey = new Ed25519PrivateKey(PRIVATE_KEY);
  const address = AccountAddress.from(walletAddress);
  if (!privateKey || !address) {
    throw new Error("No private key or address found in local storage");
  }
  const account = Account.fromPrivateKey({ privateKey });
  return account;
};

const privateKey = PRIVATE_KEY;
const adminPrivateKey = Buffer.from(privateKey.slice(2), "hex");
const keyPair = nacl.sign.keyPair.fromSeed(adminPrivateKey);
const nonce = makeId(16);
const message = "Sign Up Into Loonies" + nonce;
console.log('🚀 ~ message:', message);

const messageBuffer = Buffer.from(message, "utf-8");
const signature = nacl.sign.detached(messageBuffer, keyPair.secretKey);
const account = await getAptosAccount();
const signatureHex = HexString.fromBuffer(signature).toString();
console.log('🚀 ~ signatureHex:', signatureHex);
const publicKey = account.publicKey.toString();
const wallet_address = account.accountAddress.toString();
// const encodedMessage = nacl.util.encodeBase64(messageBuffer);
const encodedMessage = encodeBase64(messageBuffer);
console.log('🚀 ~ login2.js:52 ~ encodedMessage:', encodedMessage);
