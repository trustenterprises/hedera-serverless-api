import HashgraphClient from "app/hashgraph/client"

// This test will be removed

test("The HashgraphClient should not throw on creation", () => {
	expect(() => {
		new HashgraphClient()
	}).toThrow();
})
