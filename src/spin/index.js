import { getAptosAccount } from "../functions/index.js";
import { HexString } from "aptos";
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
const { encodeBase64 } = naclUtil;

const makeId = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const GetSignature = async () => {
    try {
        const account = await getAptosAccount();
        const adminPrivateKey = Buffer.from(account.privateKey.toString().slice(2), 'hex');
        const keyPair = nacl.sign.keyPair.fromSeed(adminPrivateKey);
        const nonce = makeId(16);
        const message = 'Sign Up Into Loonies' + nonce;
        const messageBuffer = Buffer.from(message, 'utf-8');
        const signature = nacl.sign.detached(messageBuffer, keyPair.secretKey);
        const signatureHex = HexString.fromBuffer(signature).toString();
        const publicKey = account.publicKey.toString();
        const wallet_address = account.accountAddress.toString();
        const encodedMessage = encodeBase64(messageBuffer);
        return { message: encodedMessage, wallet_address, signature: signatureHex, publicKey };
    } catch (error) {
        console.error('Error getting signature:', error);
    }
};

export const Spin = async () => {
    let { message, wallet_address, signature, publicKey } = await GetSignature()
}
