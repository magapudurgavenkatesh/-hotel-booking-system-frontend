export function getAuthConfig() {
  const auth = localStorage.getItem("auth");

  if (!auth) {
    return {};
  }

  return {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  };
}