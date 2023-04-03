import jwt_decode from "jwt-decode";

export const AdminAuthorize = async (token) => {
  try {
    if ((await jwt_decode(token).role) === "admin") return true;
    else return false;
  } catch (error) {
    return false;
  }
};
