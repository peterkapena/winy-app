import { prop, pre, queryMethod, index } from "@typegoose/typegoose";
import bcrypt from "bcrypt";
import { AsQueryMethod, ReturnModelType } from "@typegoose/typegoose/lib/types";
import base_model from "./base_model";
import { models } from "mongoose";
import { getModelForClass } from "@typegoose/typegoose";

function find_by_email(
  this: ReturnModelType<typeof User, UserClassQueryHelpers>,
  email: User["email"]
) {
  return this.findOne({ email });
}
function find_by_username(
  this: ReturnModelType<typeof User, UserClassQueryHelpers>,
  username: User["username"]
) {
  return this.findOne({ username });
}
export interface UserClassQueryHelpers {
  find_by_email: AsQueryMethod<typeof find_by_email>;
  find_by_username: AsQueryMethod<typeof find_by_username>;
}

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password.toString(), salt);
  this.created_on = new Date().toISOString();
})
@index({ email: 1 })
@queryMethod(find_by_username)
@queryMethod(find_by_email)
export default class User extends base_model {
  @prop({ type: String, unique: true })
  email!: string;

  @prop({ required: true, unique: true })
  username!: string;

  @prop({ type: String })
  password!: string;

  @prop({ type: [String], default: [], required: false })
  roles?: string[];
}

const UserModel =
  models.Users ||
  getModelForClass<typeof User, UserClassQueryHelpers>(User, {
    options: { customName: "Users" },
  });

export { UserModel, User };

export const Roles = {
  Admin: "1",
  PartnersGenerate: "2",
  LiteratureOrder: "3",
};
