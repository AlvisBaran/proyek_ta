import {
  Timestamp,
  getDoc,
} from "firebase/firestore";

import Membership from "./Membership";
import Category from "./Category";

export default class Content {
  constructor(data) {
    this._id = data._id ?? undefined;
    this.creator_ref = data.creator_ref;
    this.type = data.type ?? "public";
    this.gallery = data.gallery ?? [];
    this.title = data.title;
    this.body = data.body;
    this.status = data.status ?? "draft";
    this.membership_tags_ref = data.membership_tags_ref ?? [];
    this.membership_tags = undefined;
    this.categories_ref = data.categories_ref ?? [];
    this.categories = undefined;
    this.like_counter = data.like_counter ?? 0;
    this.share_counter = data.share_counter ?? 0;
    this.created_at = (data.join_date instanceof Timestamp) ? data.join_date.toDate() : (data.join_date ?? new Date());
    this.updated_at = (data.join_date instanceof Timestamp) ? data.join_date.toDate() : (data.join_date ?? null);
    this.published_at = (data.join_date instanceof Timestamp) ? data.join_date.toDate() : (data.join_date ?? null);
    this.deleted_at = (data.join_date instanceof Timestamp) ? data.join_date.toDate() : (data.join_date ?? null);
  }

  async loadMembershipTags() {
    let temp_membership_tags_ref = [];
    for (let i = 0; i < this.membership_tags_ref.length; i++) {
      const currRef = membership_tags_ref[i];
      let tempMembership = await currRef.get();
      if (tempMembership.exists) temp_membership_tags_ref.push(new Membership({...tempMembership.data(), _id: tempMembership.id}));
    }
    this.membership_tags = temp_membership_tags_ref;
  }

  async loadCategories() {
    let temp_categories = [];
    for (let i = 0; i < this.categories.length; i++) {
      const currRef = categories[i];
      let tempCategory = await currRef.get();
      if (tempCategory.exists) temp_categories.push(new Category({...tempCategory.data(), _id: tempCategory.id}));
    }
    this.categories = temp_categories;
  }
}