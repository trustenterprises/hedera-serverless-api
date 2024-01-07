const Joi = require("@hapi/joi")

const schema = Joi.object({
	name: Joi.string().required(),
	ticker: Joi.string().required(),
	max: Joi.number().required(),
	limit: Joi.string(),
	metadata: Joi.string(),
	memo: Joi.string(),
	topic_id: Joi.string()
})

function deployRequest(candidate = {}) {
	const validation = schema.validate(candidate || {}, { abortEarly: false })

	if (validation.error) {
		return validation.error.details.map(error => error.message)
	}
}

export default deployRequest
