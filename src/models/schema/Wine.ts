import { getModelForClass, pre, prop, queryMethod } from "@typegoose/typegoose";
import { AsQueryMethod, ReturnModelType } from "@typegoose/typegoose/lib/types";
import { models } from "mongoose";

interface WineClassSchemaQueryHelpers {
    findAllByUser: AsQueryMethod<typeof findAllByUser>;
}
function findAllByUser(
    this: ReturnModelType<typeof WineClass, WineClassSchemaQueryHelpers>,
    userId: WineClass["userId"]
) {
    return this.findOne({ userId });
}
@queryMethod(findAllByUser)
@pre<WineClass>("save", function () {
    this.when_added = new Date().toISOString();
})
export class WineClass {
    _id?: String;
    @prop()
    userId!: String;
    @prop()
    name!: String;
    @prop()
    year!: Number;
    @prop()
    type?: String;
    @prop()
    varietal?: String;
    @prop()
    rating?: Number;
    @prop()
    consumed?: Boolean;
    @prop()
    date_consumed?: Date;
    @prop()
    when_added?: String;
}

export const WineModel =
    models.Wine ||
    getModelForClass<typeof WineClass, WineClassSchemaQueryHelpers>(
        WineClass,
        {
            options: { customName: "Wine" },
        }
    );
