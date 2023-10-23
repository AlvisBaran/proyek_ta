import { Timestamp } from "firebase/firestore";

export default class Membership {
  constructor(data) {
    this._id = data._id ?? undefined;
    this.name = data.name;
    this.banner = data.banner;
    this.description = data.description;
    this.price = data.price;
    this.created_at = (data.join_date instanceof Timestamp) ? data.join_date.toDate() : (data.join_date ?? new Date());
    this.updated_at = (data.join_date instanceof Timestamp) ? data.join_date.toDate() : (data.join_date ?? null);
  }
}