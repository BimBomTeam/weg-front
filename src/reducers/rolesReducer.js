const initialState = {
  roles: [],
};

const rolesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_ROLES":
      return {
        ...state,
        roles: action.payload,
      };
    default:
      return state;
  }
};

export default rolesReducer;