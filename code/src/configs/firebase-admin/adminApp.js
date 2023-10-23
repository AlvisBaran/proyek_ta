import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount = require('./private-key-dev.json');

var adminApp = null;

if (getApps().length) {
  adminApp = getApp();
}
else {
  adminApp = initializeApp({
    credential: cert(serviceAccount)
  });
}

export const adminDB = getFirestore();

export const adminAuth = getAuth(adminApp);

export const adminStorage = getStorage(adminApp);

export default adminApp;