import { GET_PROFILE, PROFILE_ERROR } from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};

export const profile = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILE:
      console.log("Getting Profile");
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      console.log("Getting Profile ERROR");
      return {
        ...state,
        error: payload,
        loading: false,
      };

    default:
      return state;
  }
};
