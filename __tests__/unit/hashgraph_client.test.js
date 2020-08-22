import HashgraphClient from "app/hashgraph/client"

test("The HashgraphClient should not throw on creation", () => {
	expect(() => {
		new HashgraphClient()
	}).not.toThrow();
})
