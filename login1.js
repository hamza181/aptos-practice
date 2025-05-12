import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
const { encodeBase64 } = naclUtil;
import { Account, Ed25519PrivateKey, PrivateKey } from "@aptos-labs/ts-sdk";
import { HexString } from "aptos";

const makeId = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const login = async (privateKeyHex) => {
  try {
    const privateKeyBytes = Buffer.from(privateKeyHex, "hex");
    console.log(
      "🚀 ~ index2.js:19 ~ login ~ privateKeyBytes:",
      privateKeyBytes
    );
    const privateKey = new Ed25519PrivateKey(privateKeyBytes);
    console.log("🚀 ~ index2.js:21 ~ login ~ privateKey:", privateKey);
    // const privateKey = "0x256ad3fffd801360eb40d65d00fdb2eec7f15fcc5569a82e0a4a78609b75843e"
    const account = Account.fromPrivateKey({ privateKey });
    const publicKey = account.publicKey.toString();
    console.log("🚀 ~ index2.js:25 ~ login ~ account:", account);
    const walletAddress = account.accountAddress.toString();

    const nonce = makeId(16);
    const message = `Sign Up Into Loonies${nonce}`;
    const messageBuffer = Buffer.from(message, "utf-8");

    const signature = nacl.sign.detached(messageBuffer, privateKeyBytes);
    const signatureHex = HexString.fromBuffer(signature).toString(); // includes 0x prefix
    const encodedMessage = encodeBase64(messageBuffer);

    return {
      signatureHex: signatureHex.slice(2),
      encodedMessage,
      publicKey,
      walletAddress,
    };
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

// const privateKeyHex = await PrivateKey('0x256ad3fffd801360eb40d65d00fdb2eec7f15fcc5569a82e0a4a78609b75843e');
// console.log('🚀 ~ index2.js:49 ~ privateKeyHex:', privateKeyHex);

login("0x256ad3fffd801360eb40d65d00fdb2eec7f15fcc5569a82e0a4a78609b75843e")
  .then((result) => {
    if (result) {
      console.log("Login successful:", result);
    } else {
      console.log("Login failed");
    }
  })
  .catch((error) => {
    console.error("Error during login:", error);
  });
