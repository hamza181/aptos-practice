import dotenv from 'dotenv';
dotenv.config();

export const constants = {
    walletAddress: "0xcb4c842efdde18072d22c03d34a886fed5c4e79e41ba8d31948900c04782b680",
    privateKey: process.env.PRIVATE_KEY || "",
}
