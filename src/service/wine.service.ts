import User from "@/models/schema/User";
import { WineClass, WineModel } from "@/models/schema/Wine";

interface GetWinesReturn {
    _id: string | undefined,
    userId: string | undefined,
    name: string,
    year: number | undefined,
    type: string,
    varietal: string | undefined,
    rating: number | undefined,
    consumed: boolean | undefined,
    date_consumed: Date | undefined,
}

export class WineService {
    async addWine(wine: WineClass): Promise<WineClass> {
        const create_wine = await WineModel.create(wine);
        return create_wine;
    }
    async getWineByUser(userId: string): Promise<GetWinesReturn[]> {
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
}
