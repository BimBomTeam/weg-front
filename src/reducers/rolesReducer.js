const initialState = {
  roles: [],
  currentRole: null,
};

const rolesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_ROLES":
      return {
        ...state,
        roles: action.payload.roles,
      };
    case "SET_CURRENT_ROLE":
      return {
        ...state,
        currentRole: action.payload,
      };
    default:
      return state;
  }
};

export default rolesReducer;
