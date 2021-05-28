const Joi = require("@hapi/joi")

const TRILLION = 10 ** 12

const schema = Joi.object({
	symbol: Joi.string()
		.max(100)
		.required(),
	name: Joi.string()
		.max(100)
		.required(),
	memo: Joi.string()
		.max(100)
		.optional(),
	supply: Joi.number()
		.positive()
		.max(TRILLION)
		.min(1)
		.required(),
	requires_kyc: Joi.bool().default(false),
	can_freeze: Joi.bool().default(false)
}).options({ allowUnknown: true })

function createTokenRequest(candidate = {}) {
	const validation = schema.validate(candidate || {})

	if (validation.error) {
		return validation.error.details.map(error => error.message)
	}
}

export default createTokenRequest
