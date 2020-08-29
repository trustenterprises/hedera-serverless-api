const Joi = require("@hapi/joi")

const schema = Joi.object({
	memo: Joi.string().max(100),
	enable_private_submit_key: Joi.boolean().sensitive()
})

function createTopicRequest(candidate = {}) {
	const validation = schema.validate(candidate || {})

	if (validation.error) {
		return validation.error.details.map(error => error.message)
	}
}

export default createTopicRequest
