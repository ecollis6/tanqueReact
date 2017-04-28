export const IMPORT_USER = 'data/users/IMPORT_USER';
export const EXPORT_USER = 'data/users/EXPORT_USER';

export const importUser = json => ({ type: IMPORT_USER, json });
export const exportUser = json => ({ type: EXPORT_USER, json });

export function getUserForUid(uid) {
  return (dispatch, getState) => {
    const state = getState();
    const userData = state.data.users;
    const users = userData.records;
    const user = users.find(u => u.uid === uid);

    return user;
  };
}