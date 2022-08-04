import onlyPost from "app/middleware/onlyPost"
import withAuthentication from "app/middleware/withAuthentication"
import prepare from "app/utils/prepare"
import CreateMetadataHandler from "app/handler/createMetadataHandler"
import ensureNftStorageAvailable from "app/middleware/ensureNftStorageAvailable"

export default prepare(
	onlyPost,
	withAuthentication,
	ensureNftStorageAvailable
)(CreateMetadataHandler)
