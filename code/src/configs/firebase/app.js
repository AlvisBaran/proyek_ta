import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

var app;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? undefined
};
// console.log(firebaseConfig)

if (getApps().length) {
  app = getApp();
} else { 
  app = initializeApp(firebaseConfig);
  // if (typeof window !== 'undefined') {
  //   if ("measurementId" in firebaseConfig) {
  //     const analytics = getAnalytics(app);
  //   }
  // }
  // const appCheck = initializeAppCheck(app, {
  //   // provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_SECRET ?? "gktnazarethpondokindahappsecret"),
  //   provider: new ReCaptchaV3Provider("arielsukamakannasigoreng"),
  //   isTokenAutoRefreshEnabled: true,
  // })
}

export const storage = getStorage(app);

export default app;