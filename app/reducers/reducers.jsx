import { combineReducers } from 'redux';


function sideElements(state = [], selectedOne) {
	return state.map((name, selected) => {
			if (name.text == selectedOne.text) {
				name.selected = true;
			} else {
				name.selected = false;
			}
		})
}

const GlobalState = combineReducers({sideElements});

export default GlobalState;