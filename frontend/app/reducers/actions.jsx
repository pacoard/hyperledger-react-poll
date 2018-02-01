export function selectSideElement(sideElement) {
	return {
		type: 'SELECT_SIDE_ELEMENT',
		sideElementName: sideElement.props.name,
	};
} 
