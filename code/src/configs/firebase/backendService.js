import { collection, getFirestore } from "firebase/firestore";
import app from "./app.js";

class BackendService 
{
  constructor() {
    this.app = app;
    this.firestore = getFirestore(this.app);
  }

  getApp() { return this.app; }
  getFirestore() { return this.firestore; }

  createCollection(collectionName) {
    return collection(this.firestore, collectionName)
  }
}

const DB = new BackendService();
export default DB;