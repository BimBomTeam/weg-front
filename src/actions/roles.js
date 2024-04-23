import GET_todayRoles from "../logic/server/GET_todayRoles";

export const CHECK_ROLES = "CHECK_ROLES";

export const checkRoles = () => {
  return async (dispatch, getState) => {
    const rolesExist = getState().roles;

    if (!rolesExist || !rolesExist.length) { // Проверяем наличие элементов в массиве
      console.log("(!rolesExist)");
      const fetchedRoles = await GET_todayRoles(); // Добавляем await, чтобы дождаться завершения запроса
      dispatch(setRoles(fetchedRoles));
    }
  };
};


export const setRoles = (roles) => {
  return {
    type: "SET_ROLES",
    payload: roles,
  };
};

export const SAVE_ROLES = "SAVE_ROLES";

export const saveRoles = (roles) => ({
  type: SAVE_ROLES,
  payload: roles,
});
