// export interface IFirebaseAuthErrorState {
//   fieldName: string
//   code: string
//   message: string
// }

export const authErrorTranslater = (errorCode) => {
  let fieldName = "unknown";
  let message = "Unknown Error Code!";
  if (errorCode === "auth/user-not-found") { fieldName = "user"; message = "Email belum terdaftar!"; }
  else if (errorCode === "auth/email-already-in-use") { fieldName = "email"; message = "Email telah digunakan!"; }
  else if (errorCode === "auth/weak-password") { fieldName = "password"; message = "Password minimal 6 karakter!"; }
  else if (errorCode === "auth/wrong-password") { fieldName = "password"; message = "Password salah!"; }
  else if (errorCode === "auth/admin-restricted-operation") { fieldName = "admin"; message = "Restricted Admin Opertaions!"; }
  return { fieldName, code: errorCode, message }
}