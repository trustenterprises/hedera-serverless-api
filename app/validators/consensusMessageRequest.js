const Joi = require("@hapi/joi")

const schema = Joi.object({
	message: Joi.string()
		.min(1)
		.required(),
	topic_id: Joi.string().required(),
	reference: Joi.string(),
	allow_synchronous_consensus: Joi.boolean().sensitive()
})

function consensusMessageRequest(candidate = {}) {
	const validation = schema.validate(candidate || {})

	if (validation.error) {
		return validation.error.details.map(error => error.message)
	}
}

export default consensusMessageRequest
