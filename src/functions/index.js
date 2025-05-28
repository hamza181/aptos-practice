import { Account, Ed25519PrivateKey, AccountAddress, PrivateKey } from "@aptos-labs/ts-sdk";
import { constants } from "../constants/index.js";

export const getAptosAccount = async () => {
    const privateKey = new Ed25519PrivateKey(constants.privateKey);
    // const privateKey = PrivateKey.formatPrivateKey(constants.privateKey, 'ed25519');
    const address = AccountAddress.from(constants.walletAddress);
    if (!privateKey || !address) {
        throw new Error("No private key or address found in local storage");
    }
    const account = Account.fromPrivateKey({ privateKey });
    return account;
};
