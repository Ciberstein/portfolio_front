import appError from "../utils/appError";
import api from "../api/axios";

const disconnect = async () => {
  const url = '/api/v1/auth/logout';
  await api
    .post(url)
    .then(() => location.reload())
    .catch((err) => appError(err))
};

const refresh = async () => {
  const url = `/api/v1/auth/refresh`;
  await api.post(url, {}, { withCredentials: true })
    .then((res) => console.log(res.data.message))
    .catch(async () => await disconnect())
};

const validate = async () => {
  let response = false;

  const url = '/api/v1/auth/validate';
  await api.post(url)
    .then((res) => response = res.data.auth)
    .catch((err) => appError(err))

  return response;
};

const auth = { disconnect, refresh, validate };

export default auth;