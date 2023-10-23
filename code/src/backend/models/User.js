import { Timestamp } from "firebase-admin/firestore";

const defaultProfilePicture = {
  src: "https://t4.ftcdn.net/jpg/05/62/99/31/360_F_562993122_e7pGkeY8yMfXJcRmclsoIjtOoVDDgIlh.jpg",
  alt: "...", label: "Profile Picture",
}

export default class User {
  constructor(data) {
    // Normal User
    this._id = data._id ?? undefined;
    this.role = data.role ?? "normal";
    this.email = data.email;
    this.password = data.password ?? undefined;
    this.saldo = data.saldo ?? 0;
    this.display_name = data.display_name ?? "no-name";
    this.email = data.email ?? null;
    this.profile_picture = data.profile_picture ?? null;
    this.socials = data.socials ?? [];
    this.ban_status = data.ban_status ?? "clean";
    this.last_banned = (data.last_banned instanceof Timestamp) ? data.last_banned.toDate() : (data.last_banned ?? null);
    this.join_date = (data.join_date instanceof Timestamp) ? data.join_date.toDate() : (data.join_date ?? new Date());
    
    // Creator User
    this.c_username = data.c_username ?? null;
    this.bio = data.bio ?? undefined;
    this.about = data.about ?? undefined;
    this.theme_color = data.theme_color ?? this.role==="creator"?"#eee":undefined;
    this.banner = data.banner ?? undefined;
  }
}