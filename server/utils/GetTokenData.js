import jwt_decode from "jwt-decode";

export const GetAdminId = async ({ token }) => {
  try {
    if ((await jwt_decode(token).role) === "admin") {
      return jwt_decode(token).id;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
