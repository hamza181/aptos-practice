import {
  Account,
  Aptos,
  AptosConfig,
  Network,
  Ed25519PrivateKey,
} from "@aptos-labs/ts-sdk";

const { PRIVATE_KEY } = process.env;
/**
 * Script to simulate a specific APT transfer using the provided private key
 */
async function simulateSpecificTransfer() {
  try {
    // Initialize Aptos client with mainnet configuration
    const config = new AptosConfig({ network: Network.MAINNET });
    const aptos = new Aptos(config);

    // Private key and addresses
    const receiverAddress =
      "0x8b884f225a161f7ecb89bd62f77b4abe01f5b5ee4e9d33c2c525a330a54a6d75";

    // Convert private key hex to Ed25519PrivateKey object
    const privateKey = new Ed25519PrivateKey(PRIVATE_KEY);

    // Create account from private key
    const senderAccount = await Account.fromPrivateKey({ privateKey });

    // Set amount to transfer (0.00001 APT = 1000 octas)
    const amountInOctas = 1000; // 0.00001 APT

    // Define custom max gas amount
    const customMaxGas = 20;

    // Get the sender's address
    const senderAddress = senderAccount.accountAddress;
    console.log(`Sender address: ${senderAddress}`);

    // Check sender balance
    try {
      const accountAPTAmount = await aptos.getAccountAPTAmount({
        accountAddress: senderAddress,
      });

      console.log(
        `Current balance: ${accountAPTAmount} octas (${
          accountAPTAmount / 100_000_000
        } APT)`
      );
    } catch (error) {
      console.error("Error checking balance:", error);
    }

    const payload = {
      function: "0x1::coin::transfer",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: [receiverAddress, amountInOctas],
    };

    console.log('🚀 ~ index1.js:61 ~ simulateSpecificTransfer ~ payload:', payload);

    // Create transaction for transfer
    console.log("Creating transaction...");
    const transaction = await aptos.transaction.build.simple({
      sender: senderAddress,
      data: payload,
      options: {
        maxGasAmount: customMaxGas, // Using number directly, not BigInt
      },
    });

    // Simulate the transaction
    console.log("Simulating transaction...");

    const simulationResults = await aptos.transaction.simulate.simple({
      signerPublicKey: senderAccount.publicKey,
      transaction,
    });

    console.log('🚀 ~ index1.js:77 ~ simulateSpecificTransfer ~ simulationResults:', simulationResults);


    // Process and display simulation results
    console.log("\nTransaction simulation results:" + simulationResults[0]);

    if (simulationResults.length > 0) {
      const result = simulationResults[0];
      console.log(`Gas used: ${result.gas_used} units`);
      console.log(`Success: ${result.success}`);

      if (result.success) {
        console.log(
          "Simulation successful - transaction would succeed if submitted"
        );

        // Calculate final values
        const gasUsed = Number(result.gas_used);
        const gasCostInOctas = gasUsed;
        const totalCostInOctas = amountInOctas + gasCostInOctas;

        console.log("\nTransaction Summary:");
        console.log(
          `Transfer amount: ${amountInOctas} octas (${
            amountInOctas / 100_000_000
          } APT)`
        );
        console.log(
          `Gas cost: ${gasCostInOctas} octas (${
            gasCostInOctas / 100_000_000
          } APT)`
        );
        console.log(
          `Total cost: ${totalCostInOctas} octas (${
            totalCostInOctas / 100_000_000
          } APT)`
        );
      } else {
        console.log("Simulation failed:");
        console.log("VM Status:", result.vm_status);

        if (
          result.vm_status &&
          result.vm_status.includes &&
          result.vm_status.includes("INSUFFICIENT_BALANCE")
        ) {
          console.log(
            "\nInsufficient balance error detected. Consider reducing the amount or getting more funds."
          );
        }
      }
    } else {
      console.log("No simulation results returned.");
    }

    return simulationResults;
  } catch (error) {
    console.error("Error in simulation:", error);
    throw error;
  }
}

// Execute the simulation
simulateSpecificTransfer()
  .then(() => {
    console.log("Simulation complete.");
  })
  .catch((error) => {
    console.error("Simulation failed with error:", error);
  });
