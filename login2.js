import dotenv from "dotenv";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
const { encodeBase64 } = naclUtil;
import { Account, Ed25519PrivateKey, PrivateKey } from "@aptos-labs/ts-sdk";
import { HexString } from "aptos";
// require("dotenv").config(
//   { path: `.env.${env}` }
// );
dotenv.config({
  path: `.env`,
});

export const { PRIVATE_KEY } = process.env;


const makeId = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const privateKey = PRIVATE_KEY;
const adminPrivateKey = Buffer.from(privateKey.slice(2), "hex");
const keyPair = nacl.sign.keyPair.fromSeed(adminPrivateKey);

const nonce = makeId(16);

const message = "Sign Up Into Loonies" + nonce;

const messageBuffer = Buffer.from(message, "utf-8");

const signature = nacl.sign.detached(messageBuffer, keyPair.secretKey);

const account = Account.fromPrivateKey({ privateKey });
const signatureHex = HexString.fromBuffer(signature).toString();
const publicKey = account.publicKey.toString();
const wallet_address = account.accountAddress.toString();

const encodedMessage = nacl.util.encodeBase64(messageBuffer);
