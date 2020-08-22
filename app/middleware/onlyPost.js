import Request from "app/constants/request"
import Response from "app/response"

function onlyPost(handler) {
	return async (req, res) => {
		if (req.method === Request.POST) {
			return handler(req, res)
		}

		return Response.methodNotAllowed(res, req.method)
	}
}

export default onlyPost
