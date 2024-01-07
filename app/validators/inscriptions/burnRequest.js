const Joi = require("@hapi/joi")

const schema = Joi.object({
	from: Joi.string().required(),
	amount: Joi.number().required(),
	memo: Joi.string(),
	topic_id: Joi.string()
})

function burnRequest(candidate = {}) {
	const validation = schema.validate(candidate || {}, { abortEarly: false })

	if (validation.error) {
		return validation.error.details.map(error => error.message)
	}
}

export default burnRequest
