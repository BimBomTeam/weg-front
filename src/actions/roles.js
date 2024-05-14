import GET_todayRoles from "../logic/server/GET_todayRoles";

export const CHECK_ROLES = "CHECK_ROLES";

export const checkRoles = () => {
  return async (dispatch) => {
    const rolesLoaded = JSON.parse(sessionStorage.getItem("rolesLoaded"));
    console.log("rolesLoaded", rolesLoaded);

    if (!rolesLoaded || rolesLoaded.length === 0) {
      console.log("rolesLoaded 2", rolesLoaded);
      const fetchedRoles = await GET_todayRoles();
      console.log("fetchedRoles", fetchedRoles);
      dispatch(setRoles(fetchedRoles, true));
      sessionStorage.setItem("rolesLoaded", JSON.stringify(fetchedRoles));
    } else {
      dispatch(setRoles(rolesLoaded, true));
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
