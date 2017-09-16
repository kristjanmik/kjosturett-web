export const USER_UPDATE = 'USER_UPDATE';

export function updateUser(user) {
  return {
    type: USER_UPDATE,
    payload: {
      ...user
    }
  };
}
