const Joi = require("@hapi/joi")

const schema = Joi.object({
	to: Joi.string().required(),
	amount: Joi.number().required(),
	memo: Joi.string(),
	topic_id: Joi.string()
})

function mintRequest(candidate = {}) {
	const validation = schema.validate(candidate || {}, { abortEarly: false })

	if (validation.error) {
		return validation.error.details.map(error => error.message)
	}
}

export default mintRequest
