const Joi = require("@hapi/joi")

const schema = Joi.object({
	cid: Joi.string()
		.min(20)
		.required(),
	amount: Joi.number()
		.positive()
		.min(1)
		.max(10)
		.default(1)
		.optional()
}).options({ allowUnknown: false })

function mintNftRequest(candidate = {}) {
	const validation = schema.validate(candidate || {}, { abortEarly: false })

	if (validation.error) {
		return validation.error.details.map(error => error.message)
	}
}

export default mintNftRequest
