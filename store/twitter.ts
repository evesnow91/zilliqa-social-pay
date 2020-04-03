import { createDomain } from 'effector';
import { NotificationManager } from 'react-notifications';

import { fetchTweetsUpdate } from 'utils/update-tweets';
import { fetchTweets } from 'utils/get-tweets';
import { toUnique } from 'utils/to-unique';
import { Twitte } from 'interfaces';

export const TwitterDomain = createDomain();
export const update = TwitterDomain.event<any[]>();
export const clear = TwitterDomain.event();
export const getTweets = TwitterDomain.effect<null, any[] | any, Error>();

export const updateTweets = TwitterDomain.effect<string, any, Error>();

updateTweets.use(fetchTweetsUpdate);
getTweets.use(fetchTweets);

const initalState: { error?: boolean; tweets: Twitte[]; } = {
  error: undefined,
  tweets: []
};

export const store = TwitterDomain.store(initalState)
  .on(update, (state, tweets) => ({ ...state, tweets }))
  .on(updateTweets.done, (state, { result }) => {
    if (Array.isArray(result.tweets) && result.tweets.length > 0) {
      NotificationManager.info(`SocialPay has been found ${result.tweets.length} tweets.`);

      return {
        ...state,
        error: undefined,
        tweets: toUnique(state.tweets.concat(result.tweets), 'idStr')
      };
    }

    return {
      ...state
    };
  })
  .on(getTweets.done, (state, { result }) => {
    if (Array.isArray(result)) {
      return {
        error: undefined,
        tweets: toUnique(state.tweets.concat(result), 'idStr')
      };
    }

    return {
      ...state,
      error: true
    };
  })
  .on(clear, () => initalState);

export default {
  store,
  update,
  updateTweets,
  getTweets,
  clear
};
