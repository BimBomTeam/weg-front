import GET_todayRoles from "../logic/server/GET_todayRoles";

export const CHECK_ROLES = "CHECK_ROLES";

export const checkRoles = () => {
  return async (dispatch) => {
    const rolesLoaded = sessionStorage.getItem("rolesLoaded");

    if (rolesLoaded) {
      dispatch(setRoles(rolesLoaded, true));
    }
    if (!rolesLoaded) {
      const fetchedRoles = await GET_todayRoles();
      dispatch(setRoles(fetchedRoles, true));
      sessionStorage.setItem("rolesLoaded", JSON.stringify(fetchedRoles)); 
    }
  };
};

export const setRoles = (roles, hasRoles) => {
  return {
    type: "CHECK_ROLES",
    payload: {
      hasRoles: hasRoles,
      roles: roles,
    },
  };
};

