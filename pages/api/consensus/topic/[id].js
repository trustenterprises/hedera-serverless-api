import Request from "app/constants/request"
import Response from "app/response"
import denyPost from "app/middleware/denyPost"
import withAuthentication from "app/middleware/withAuthentication"
import useHashgraphContext from "app/context/useHashgraphContext"
import prepare from "app/utils/prepare"
import TopicInfoHandler from "app/handler/topicInfoHandler"
import UpdateTopicHandler from "app/handler/updateTopicHandler"
import DeleteTopicHandler from "app/handler/deleteTopicHandler"

const EditTopicResourceHandlers = {
	[Request.GET]: TopicInfoHandler,
	[Request.PUT]: UpdateTopicHandler,
	[Request.DELETE]: DeleteTopicHandler // WIP
}

function EditTopicResource(req, res) {
	const selectHandler = EditTopicResourceHandlers[req.method]

	if (selectHandler) {
		return selectHandler(req, res)
	}

	// This is the catch all for PATCH and others
	return Response.methodNotAllowed(res, req.method)
}

export default prepare(
	denyPost,
	withAuthentication,
	useHashgraphContext
)(EditTopicResource)
