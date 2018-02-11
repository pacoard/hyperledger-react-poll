import { combineReducers } from 'redux';
import { SIDE_ELEMENTS } from '../constants/constants';

function sideElementsReducer(state = SIDE_ELEMENTS, action) {
	switch(action.type) {
		case 'SELECT_SIDE_ELEMENT':
			console.log('(action) SELECT_SIDE_ELEMENT')
			let newstate = state;
			newstate.forEach(function (element) {
				if (element.name == action.sideElementName) {
					element.selected = true;
					console.log("Selected: "+element.name);
				} else {
					element.selected = false
				}
			})
			return newstate;
			break;
		default: return state;
	}
	
}

const GlobalState = combineReducers({sideElements: sideElementsReducer});

export default GlobalState;