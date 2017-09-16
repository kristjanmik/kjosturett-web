export const RECIPES_UPDATE = 'RECIPES_UPDATE';

export function updateRecipes(recipes) {
  return {
    type: RECIPES_UPDATE,
    payload: {
      ...recipes
    }
  };
}

export function getRecipes(options) {
  return async (dispatch, getState, { fetch }) => {
    try {
      let url = `/api/recipe?`;

      if (options.review) {
        url += '&review=true';
      }

      const request = await fetch(url, {
        method: 'GET'
      });

      if (!request.ok) {
        return console.error('Could not fetch recipes');
      }

      const body = await request.json();

      return dispatch({
        type: RECIPES_UPDATE,
        payload: {
          data: body.data
        }
      });
    } catch (e) {
      console.error('Could not get messages data', e);
    }
  };
}
