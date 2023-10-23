export const errorList = [
  {
    code: "auth/user-not-found",
    defaultMessage: "There is no user record corresponding to the provided identifier.",
    message: "Belum ada user dengan identitas tersebut.",
  },
];

export const getMessageByCode = (code) => {
  return errorList.find(error => {
    if (error.code === code) return error.message;
  });
}

export const getDefMsgByCode = (code) => {
  return errorList.find(error => {
    if (error.code === code) return error.defaultMessage;
  });
}