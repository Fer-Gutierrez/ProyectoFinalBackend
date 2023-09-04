export class UserDTO {
  constructor(payload) {
    this.id = payload._id;
    this.first_name = payload.first_name;
    this.last_name = payload.last_name;
    this.email = payload.email;
    this.role = payload.role;
  }
}
