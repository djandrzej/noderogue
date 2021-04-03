import { UPDATE_CONTENT } from '../constants/actionTypes';
import { Action } from 'redux';

export default function reducer(
  state: string = '',
  action: Action & { payload?: { content: string } } = { type: '' },
): string {
  switch (action.type) {
    case UPDATE_CONTENT:
      return action.payload.content;
  }
  return state;
}
