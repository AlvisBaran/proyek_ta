export default class Category {
  constructor(data) {
    this._id = data._id ?? undefined;
    this.label = data.label;
  }
}