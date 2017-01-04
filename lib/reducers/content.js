import {createReducer} from 'redux-create-reducer';

import {UPDATE_CONTENT} from '../constants/actionTypes';

export default createReducer('', {

    [UPDATE_CONTENT]: (state, action) => action.payload.content

});
