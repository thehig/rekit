import initialState from './initialState';
import { reducer as counterPlusOne } from './counterPlusOne';
import { reducer as counterMinusOne } from './counterMinusOne';
import { reducer as resetCounter } from './resetCounter';
import { reducer as fetchRedditReactjsList } from './fetchRedditReactjsList';
import { reducer as fetchRedditBySaga } from './fetchRedditBySaga';

const reducers = [
  counterPlusOne,
  counterMinusOne,
  resetCounter,
  fetchRedditReactjsList,
  fetchRedditBySaga,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Put global reducers here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
