import Config from "../../app/config"

export default function(authenticationKey) {
	return Config.authenticationKey === authenticationKey
}
