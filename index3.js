
// regular spin 
const transaction = await aptos.transaction.build.simple({
  sender: sender.accountAddress,
  data: {
    function:
      "0xb588e7842f7fca80cf6d92eeb7a05db0dce6af5e02248374fb4498d96ea23236::spin::regular_spin",
    functionArguments: [],
    typeArguments: ["0x1::aptos_coin::AptosCoin"],
  },
});
