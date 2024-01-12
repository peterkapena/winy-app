import User from "@/models/schema/User";
import { WineClass, WineModel } from "@/models/schema/Wine";

export interface GetWineReturn {
    _id: string,
    userId: string,
    name: string,
    year: number,
    type: "Red" | "White" | "Rosé" | "White Blend" | "Red Blend" | undefined,
    varietal: string,
    rating: number,
    consumed: boolean,
    date_consumed: Date,
}

export class WineService {
    async addWine(wine: WineClass): Promise<WineClass> {
        const create_wine = await WineModel.create(wine);
        return create_wine;
    }
    async getWineByUser(userId: string): Promise<GetWineReturn[]> {
        const wines = await WineModel.find({ userId }).sort({ when_created: -1 });
        const rtn = wines.map(wine => ({
            _id: wine?._id.toString(),
            userId: wine?.userId?.toString(),
            name: wine?.name,
            year: wine?.year,
            type: wine?.type,
            varietal: wine?.varietal,
            rating: wine?.rating,
            consumed: wine?.consumed,
            date_consumed: wine?.date_consumed,
        })).filter(wine => wine !== undefined);

        return rtn;
    }
    async getWine(_id: String): Promise<GetWineReturn> {
        const rtn = await WineModel.findOne({ _id });
        return rtn;
    }
    async edit(input: WineClass, id: string): Promise<Boolean> {
        // console.log(id);
        const rtn = await WineModel.updateOne(
            { _id: id },
            {
                name: input.name,
                year: input.year,
                type: input.type,
                varietal: input.varietal,
                rating: input.rating,
                consumed: input.consumed,
                date_consumed: input.date_consumed,
            }
        );
        return rtn.acknowledged;
    }
    async delete(id: String): Promise<boolean> {
        return (await WineModel.deleteOne({ _id: id })).deletedCount > 0;
    }
}
