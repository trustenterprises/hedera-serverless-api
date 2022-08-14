const Joi = require("@hapi/joi")

const MAXIMUM_POWER = 10 ** 18

const schema = Joi.object({
	collection_name: Joi.string()
		.max(100)
		.required(),
	symbol: Joi.string()
		.max(100)
		.required(),
	supply: Joi.number()
		.positive()
		.max(MAXIMUM_POWER)
		.min(1)
		.required(),

	// Optional fields
	allow_custom_fees: Joi.bool().default(true),
	royalty_fee: Joi.number()
		.precision(2)
		.default(0.05),
	fallback_fee: Joi.number()
		.max(10000)
		.default(0),

	// 🚨 Danger Will Robinson 🚨
	enable_unsafe_keys: Joi.bool().default(false)
}).options({ allowUnknown: true })

function createNftRequest(candidate = {}) {
	const validation = schema.validate(candidate || {}, { abortEarly: false })

	if (validation.error) {
		return validation.error.details.map(error => error.message)
	}
}

export default createNftRequest
