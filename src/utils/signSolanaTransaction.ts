import { Keypair, Transaction, VersionedTransaction } from "@solana/web3.js";

export const signTransactionClientSide = async (transactionBase64: string) => {
  try {
    const privateKeyHex = localStorage.getItem("privateKey");
    if (!privateKeyHex) throw new Error("No private key found");

    const keypair = Keypair.fromSecretKey(Buffer.from(privateKeyHex, "hex"));
    const txBuffer = Buffer.from(transactionBase64, "base64");

    // Deserialize transaction
    let transaction;
    try {
      transaction = VersionedTransaction.deserialize(txBuffer);
    } catch {
      transaction = Transaction.from(txBuffer);
    }

    // Sign the transaction
    if (transaction instanceof VersionedTransaction) {
      transaction.sign([keypair]);
    } else {
      transaction.sign(keypair);
    }

    // Convert back to base64
    const serializedTx = transaction.serialize();
    return Buffer.from(serializedTx).toString("base64");

  } catch (error: any) {
    console.error("Signing failed:", error);
    throw new Error(`Transaction signing failed: ${error.message}`);
  }
};
