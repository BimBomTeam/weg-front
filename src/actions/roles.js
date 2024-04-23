import GET_todayRoles from "../logic/server/GET_todayRoles";

export const CHECK_ROLES = "CHECK_ROLES";

export const checkRoles = () => {
  // return async (dispatch, getState) => {
  return async (dispatch) => {
    // const rolesExist = getState().roles;
    const rolesLoaded = sessionStorage.getItem("rolesLoaded");

    if (rolesLoaded) {
      dispatch(setRoles(rolesLoaded));
    }
    if (!rolesLoaded) {
      const fetchedRoles = await GET_todayRoles();
      dispatch(setRoles(fetchedRoles));
      sessionStorage.setItem("rolesLoaded", JSON.stringify(fetchedRoles)); // Преобразуем объект в строку перед сохранением
    }
  };
};

export const setRoles = (roles) => {
  return {
    type: "SET_ROLES",
    payload: roles,
  };
};

