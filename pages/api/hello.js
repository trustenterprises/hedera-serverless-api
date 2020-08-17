// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

function HelloHandler(req, res) {
	res.statusCode = 200
	res.json({ name: "Matt" })
}

export default HelloHandler
