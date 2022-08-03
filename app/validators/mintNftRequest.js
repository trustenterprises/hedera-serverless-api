const Joi = require("@hapi/joi")

const schema = Joi.object({
	token_id: Joi.string()
		.required(),
	cid: Joi.string()
		.min(20)
		.required(),
	amount: Joi.number()
		.positive()
		.min(1)
		.max(10)
		.default(1)
		.required(),
}).options({ allowUnknown: false })

function mintNftRequest(candidate = {}) {
	const validation = schema.validate(candidate || {})

	if (validation.error) {
		return validation.error.details.map(error => error.message)
	}
}

export default mintNftRequest
