export const getErrorMsg = (err: any, callback = "오류가 발생했습니다.") => {
  const backendMsg = err?.response?.data?.message;

  if (backendMsg) return backendMsg;

  const axiosMsg = err?.message;
  if (axiosMsg) return axiosMsg;

  return callback;
};
