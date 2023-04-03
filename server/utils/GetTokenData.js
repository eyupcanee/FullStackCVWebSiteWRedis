import jwt_decode from "jwt-decode";

export const GetId = async (token) => {
  try {
    return jwt_decode(token).id;
  } catch (error) {
    return null;
  }
};
