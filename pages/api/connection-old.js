// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const {
	Client,
	Ed25519PrivateKey,
	AccountCreateTransaction,
	AccountBalanceQuery
} = require("@hashgraph/sdk")
// const checkEnvironment = require('app/middleware/checkEnvironment')

import Environment from "app/middleware/checkEnvironment"

async function connectionHandler(req, res) {
	//Grab your Hedera testnet account ID and private key
	const myAccountId = process.env.HEDERA_ACCOUNT_ID
	const myPrivateKey = process.env.HEDERA_PRIVATE_KEY

	// If we weren't able to grab it, we should throw a new error
	if (myAccountId == null || myPrivateKey == null) {
		throw new Error(
			"Environment variables myAccountId and myPrivateKey must be present"
		)
	}

	console.log(Environment.checkEnvironment)
	console.log(Environment.checkEnvironment())

	res.statusCode = 200
	// res.json({ name: myAccountId, mid: checkEnvironment.checkEnvironment() })
	res.json({ name: myAccountId })
}

export default connectionHandler
