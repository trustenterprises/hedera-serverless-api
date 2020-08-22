// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// This can be deleted.

const {
	Client,
	Ed25519PrivateKey,
	AccountCreateTransaction,
	AccountBalanceQuery
} = require("@hashgraph/sdk")

async function accountCreateHandler(req, res) {
	//Grab your Hedera testnet account ID and private key
	const myAccountId = process.env.HEDERA_ACCOUNT_ID
	const myPrivateKey = process.env.HEDERA_PRIVATE_KEY

	// If we weren't able to grab it, we should throw a new error
	if (myAccountId == null || myPrivateKey == null) {
		throw new Error(
			"Environment variables myAccountId and myPrivateKey must be present"
		)
	}

	res.statusCode = 200
	res.json({ name: myAccountId })

	// console.log(myAccountId, myPrivateKey);
	//
	// // Create our connection to the Hedera network
	// // The Hedera JS SDK makes this reallyyy easy!
	// const client = Client.forTestnet();
	//
	// client.setOperator(myAccountId, myPrivateKey);
	//
	// //Create new keys
	// const newAccountPrivateKey = await Ed25519PrivateKey.generate();
	// const newAccountPublicKey = newAccountPrivateKey.publicKey;
	//
	// //Create a new account with 1,000 tinybar starting balance
	// const newAccountTransactionId = await new AccountCreateTransaction()
	//     .setKey(newAccountPublicKey)
	//     .setInitialBalance(1000)
	//     .execute(client);
	//
	// //Get the account ID
	// const getReceipt = await newAccountTransactionId.getReceipt(client);
	// const newAccountId = getReceipt.getAccountId();
	//
	// console.log("The new account ID is: " +newAccountId);
	//
	//
	// res.statusCode = 200
	// res.json({ name: newAccountId })
}

export default accountCreateHandler
