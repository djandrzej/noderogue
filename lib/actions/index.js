import {UPDATE_CONTENT} from '../constants/actionTypes';

export function updateContent(content) {
    return {
        type: UPDATE_CONTENT,
        payload: {
            content
        }
    };
}
