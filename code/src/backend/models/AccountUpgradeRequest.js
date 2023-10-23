import { adminDB } from "@/configs/firebase-admin/adminApp";
import { Timestamp } from "firebase-admin/firestore";
import User from "./User";

export default class AccountUpgradeRequest {
  constructor(data) {
    this._id = data._id ?? undefined;
    this.applicant_ref = data.applicant_ref ?? null;
    this.applicant = data.applicant ?? undefined;
    this.status = data.status ?? "requested";
    this.new_username = data.new_username ?? null;
    this.admin_note = data.admin_note ?? null;
    this.modified_at = (data.modified_at instanceof Timestamp) ? data.modified_at.toDate() : (data.modified_at ?? null);
    this.requested_at = (data.requested_at instanceof Timestamp) ? data.requested_at.toDate() : (data.requested_at ?? new Date());
  }

  async loadApplicant(option) {
    let tempApplicantRef = await this.applicant_ref.get();
    if (tempApplicantRef.exists) {
      let tempApplicant = new User({...tempApplicantRef.data(), _id: tempApplicantRef.id});
      
      option.restrict = option.restrict ?? "extra";
      if (option.restrict === "normal") {
        tempApplicant = {
          ...tempApplicant,
          saldo: undefined,
        }
      }
      if (option.restrict === "extra") {
        tempApplicant = {
          ...tempApplicant,
          role: undefined,
          email: undefined,
          ban_status: undefined,
          last_banned: undefined,
          socials: undefined,
        }
      }

      this.applicant = tempApplicant;
    }
  }
}