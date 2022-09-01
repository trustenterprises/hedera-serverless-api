const Joi = require("@hapi/joi")

/**
 * 😬 This is a relatively stricter schema validation for HIP 412
 * to ensure that the data is in the correct format for a given range
 * of scenarios before uploading to IPFS.
 *
 * Using this HIP as a point of reference: https://hips.hedera.com/hip/hip-412
 *
 * This could be considered "off-spec" as the optional sub-objects have required
 * properties and don't allow any thing additional.
 */
const schema = Joi.object()
	.keys({
		name: Joi.string().required(),

		creator: Joi.string().optional(),

		creatorDid: Joi.string().optional(),

		description: Joi.string().optional(),

		image: Joi.string().optional(),

		format: Joi.string().optional(),

		type: Joi.string().when("image", {
			is: Joi.string().exist(),
			then: Joi.required(),
			otherwise: Joi.forbidden()
		}),

		files: Joi.array().items(
			Joi.object()
				.keys({
					uri: Joi.string().required(),
					type: Joi.string().required(),
					metadata_uri: Joi.string().required()
				})
				.optional()
		),

		attributes: Joi.array().items(Joi.object().optional()),

		// Properties seems like a free-for-all 😂
		properties: Joi.object()
			.keys({
				type: Joi.string().optional(),
				description: Joi.string().optional()
			})
			.optional()
			.options({ allowUnknown: true }),

		localization: Joi.array().items(
			Joi.object()
				.keys({
					uri: Joi.string().required(),
					locale: Joi.string().required()
				})
				.optional()
		)
	})
	.options({ allowUnknown: false })

function createNftRequest(candidate = {}) {
	const validation = schema.validate(candidate || {}, { abortEarly: false })

	if (validation.error) {
		return validation.error.details.map(error => error.message)
	}
}

export default createNftRequest
