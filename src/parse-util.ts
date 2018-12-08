export function parseAdjacentSiblingValue($: any, key: string): string {
	/* Todo: re-write this block, it's a tad messy */
	let query = Array.from($("td.para1"))
		.map(function (node: any) { node.children[0] })
		.filter(function (node: any) {
			const sanitize = function (value: string) { value.toLocaleLowerCase().trim(); }
			return node && node.data ? sanitize(key) === sanitize(node.data) : false;
		})
		.map(function (node: any) {
			let currentNode = node.parent;
			/* keep moving until we hit an adjacent sibling */
			do {
				currentNode = currentNode.next;
			} while (currentNode.type != "tag");

			return currentNode.children[0].data;
		});

	return query.length > 0 ? query[0] : null;
}
