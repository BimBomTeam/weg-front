import GET_todayRoles from "../logic/server/GET_todayRoles";

export const CHECK_ROLES = "CHECK_ROLES";

export const checkRoles = () => {
  return async (dispatch) => {
    const rolesLoaded = JSON.parse(sessionStorage.getItem("rolesLoaded"));

    if (!rolesLoaded || rolesLoaded.length === 0) {
      const fetchedRoles = await GET_todayRoles();
      dispatch(setRoles(fetchedRoles, true));
      sessionStorage.setItem("rolesLoaded", JSON.stringify(fetchedRoles));
    } else {
      dispatch(setRoles(rolesLoaded, true));
    }
  };
};

export const setRoles = (roles) => {
  return {
    type: "CHECK_ROLES",
    payload: {
      roles: roles,
    },
  };
};
