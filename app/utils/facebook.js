export const getFacebookPicture = (id) => `https://graph.facebook.com/${id}/picture?type=large`;
export const getFacebookUrl = (id) => `https://facebook.com/${id}`;
export const getFacebookLinks = (id) => new Promise((resolve) => { resolve({ picture: getFacebookPicture(id), url: getFacebookUrl(id) }); });
