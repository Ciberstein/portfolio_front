const apiConfig = () => {
  return {
    endpoint: "http://localhost:3002/api/v1",
    axios: {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
      },
    },
  };
};

export default apiConfig;
