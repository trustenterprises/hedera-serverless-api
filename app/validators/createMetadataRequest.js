const Joi = require("@hapi/joi")

/**
 * TODO: WIP
 * 
 * 😬 This is a relatively strict schema of validation for HIP 412
 * to ensure that the data is in the correct format for a given range
 * of scenarios before uploading to IPFS
 */
const schema = Joi.object().keys({
	name: Joi.string().required(),
	creator: Joi.string().optional(),
	description: Joi.string().optional(),
	image: Joi.string().optional(),
	format: Joi.string().optional(),
	type: Joi.string().when('image', {
		is: Joi.string().exist(),
		then: Joi.required(),
		otherwise: Joi.forbidden(),
	}),
	properties: Joi.object().optional()

}).options({ allowUnknown: false })

function createNftRequest(candidate = {}) {
	const validation = schema.validate(candidate || {})

	if (validation.error) {
		return validation.error.details.map(error => error.message)
	}
}

export default createNftRequest
