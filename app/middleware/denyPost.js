import Request from "app/constants/request"
import Response from "app/response"

function denyPost(handler) {
	return async (req, res) => {
		if (req.method === Request.POST) {
			return Response.methodNotAllowed(res, req.method)
		}

		return handler(req, res)
	}
}

export default denyPost
