import { UPDATE_CONTENT } from '../constants/actionTypes';
import { Action } from 'redux';

export function updateContent(content: string): Action & { payload: { content: string } } {
  return {
    type: UPDATE_CONTENT,
    payload: {
      content,
    },
  };
}
