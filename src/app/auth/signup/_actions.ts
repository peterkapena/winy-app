"use server";
import { Roles, UserModel } from "@/models/schema/User";
import { closeDBConnection, connectToDB } from "@/service/mongo";
import { FormSchema, FormSchemaType } from "./form-schema";
import { DuplicateCheck, UserService } from "@/service/user.services";
import { WineClass, WineModel } from "@/models/schema/Wine";
import { WineService } from "@/service/wine.service";

export async function initializeUser() {
  await signUp({
    confirm_password: process.env.PETER_KAPENA_PASSWORD || "",
    password: process.env.PETER_KAPENA_PASSWORD || "",
    email: process.env.PETER_KAPENA_EMAIL || "",
    username: process.env.PETER_KAPENA_EMAIL?.split("@")[0] || "",
  });

  await addSample()
  return true;
}

export async function signUp(cred: FormSchemaType): Promise<Boolean> {
  try {
    if (await connectToDB()) {
    }
    const { email, password, username } = FormSchema.parse(cred);
    console.log(cred);

    const result = await new UserService().signUp(
      {
        email,
        password,
        roles:
          email.includes("peterkapenapeter") ||
            process.env.NODE_ENV === "development"
            ? [...Object.keys(Roles)]
            : [],
        username,
      },
      DuplicateCheck.BOTH_USERNAME_EMAIL
    );
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    closeDBConnection();
  }
}

export async function addSample() {
  try {
    if (await connectToDB()) {
      if ((await WineModel.find()).length === 0) {
        const user = await UserModel.findOne({ email: process.env.PETER_KAPENA_EMAIL })
        if (user?._id) {
          let addWinePromises: Promise<WineClass>[] = []

          for (const sample of sampleData) {
            const parts = sample["Date consumed"]?.split('/');
            let date: Date | undefined;

            if (parts && parts.length > 0) {
              const year = parseInt(parts[2], 10);
              const month = parseInt(parts[0], 10) - 1;
              const day = parseInt(parts[1], 10);
              date = new Date(year, month, day);
            }

            const wine: WineClass = {
              name: sample.name,
              userId: user?.id,
              year: sample.year,
              consumed: sample.consumed.toLowerCase() === "yes",
              date_consumed: date,
              rating: sample.rating,
              type: sample.type,
              varietal: sample.varietal,
            }

            addWinePromises.push(new WineService().addWine(wine))
          }
          await Promise.allSettled(addWinePromises).then((results) => console.log("sample data added: " + results.every(wine => wine.status === "rejected")))
        }
      }
    }
  } catch (error) {
    console.error(error, "adding sample data");
    return false;
  } finally {
    closeDBConnection();
  }
}

const sampleData = [
  {
    "id": "001",
    "name": "Charx",
    "year": 2020,
    "type": "red",
    "varietal": "cab sav",
    "rating": 3,
    "consumed": "no"
  },
  {
    "id": "002",
    "name": "Boden",
    "year": 2017,
    "type": "red blend",
    "varietal": "cab sav,merlot,durif",
    "rating": 4.3,
    "consumed": "yes",
    "Date consumed": "27\/11\/2023"
  },
  {
    "id": "003",
    "name": "kidge",
    "year": 2012,
    "type": "white",
    "varietal": "chenin",
    "rating": 4.7,
    "consumed": "no"
  },
  {
    "id": "004",
    "name": "kidge",
    "year": 2009,
    "type": "red blend",
    "varietal": "cab sav,merlot,shiraz,durif",
    "rating": 4.9,
    "consumed": "yes",
    "Date consumed": "18\/11\/2023"
  },
  {
    "id": "005",
    "name": "Sine",
    "year": 2022,
    "type": "white blend",
    "varietal": "chard, verdelho",
    "rating": 4.2,
    "consumed": "no"
  },
  {
    "id": "006",
    "name": "Boden",
    "year": 2015,
    "type": "red blend",
    "varietal": "chenin, Malbec, Cabernet Sauvignon",
    "rating": 4,
    "consumed": "yes",
    "Date consumed": "26\/12\/2020"
  },
  {
    "id": "007",
    "name": "kidge",
    "year": 2006,
    "type": "red blend",
    "varietal": "chard, verdelho",
    "rating": 3.3,
    "consumed": "yes",
    "Date consumed": "21\/07\/2021"
  },
  {
    "id": "008",
    "name": "Boden",
    "year": 2018,
    "type": "red",
    "varietal": "Pinotage",
    "rating": 2.9,
    "consumed": "no"
  },
  {
    "id": "009",
    "name": "kidge",
    "year": 2023,
    "type": "white blend",
    "varietal": "Chardonnay, Sangiovese",
    "rating": 3.3,
    "consumed": "yes",
    "Date consumed": "20\/08\/2020"
  },
  {
    "id": "010",
    "name": "kidge",
    "year": 2004,
    "type": "red",
    "varietal": "Sauvignon blanc, Syrah, Pinotage",
    "rating": 4.4,
    "consumed": "yes",
    "Date consumed": "08\/12\/2021"
  },
  {
    "id": "011",
    "name": "kidge",
    "year": 2016,
    "type": "red blend",
    "varietal": "Sémillon, cab sav,merlot,shiraz,durif, chard, verdelho",
    "rating": 3,
    "consumed": "yes",
    "Date consumed": "12\/11\/2021"
  },
  {
    "id": "012",
    "name": "kidge",
    "year": 2020,
    "type": "white",
    "varietal": "chenin, Gamay",
    "rating": 2.5,
    "consumed": "no"
  },
  {
    "id": "013",
    "name": "kidge",
    "year": 2019,
    "type": "red",
    "varietal": "Syrah, Malbec, Tempranillo",
    "rating": 2.9,
    "consumed": "no"
  },
  {
    "id": "014",
    "name": "Boden",
    "year": 2007,
    "type": "red blend",
    "varietal": "Merlot, Syrah",
    "rating": 4.7,
    "consumed": "yes",
    "Date consumed": "02\/09\/2023"
  },
  {
    "id": "015",
    "name": "kidge",
    "year": 2018,
    "type": "red",
    "varietal": "Gamay, Chardonnay",
    "rating": 3,
    "consumed": "yes",
    "Date consumed": "30\/09\/2023"
  },
  {
    "id": "016",
    "name": "kidge",
    "year": 2006,
    "type": "red",
    "varietal": "Pinotage, Merlot, Malbec",
    "rating": 3,
    "consumed": "yes",
    "Date consumed": "09\/05\/2021"
  },
  {
    "id": "017",
    "name": "kidge",
    "year": 2005,
    "type": "white blend",
    "varietal": "Sémillon, Gamay, cab sav,merlot,shiraz,durif",
    "rating": 4.4,
    "consumed": "yes",
    "Date consumed": "11\/11\/2020"
  },
  {
    "id": "018",
    "name": "kidge",
    "year": 2006,
    "type": "white blend",
    "varietal": "Malbec, Chenin blanc",
    "rating": 4.4,
    "consumed": "no"
  },
  {
    "id": "019",
    "name": "kidge",
    "year": 2015,
    "type": "white blend",
    "varietal": "Syrah",
    "rating": 4.3,
    "consumed": "yes",
    "Date consumed": "17\/07\/2022"
  },
  {
    "id": "020",
    "name": "kidge",
    "year": 2001,
    "type": "white blend",
    "varietal": "Mourvèdre, Tempranillo, Gamay",
    "rating": 3.2,
    "consumed": "no"
  },
  {
    "id": "021",
    "name": "kidge",
    "year": 2004,
    "type": "red blend",
    "varietal": "Zinfandel, cab sav,merlot,durif, Pinotage",
    "rating": 3.2,
    "consumed": "yes",
    "Date consumed": "10\/05\/2021"
  },
  {
    "id": "022",
    "name": "kidge",
    "year": 2001,
    "type": "white blend",
    "varietal": "Grenache, Zinfandel, Tempranillo",
    "rating": 3.5,
    "consumed": "yes",
    "Date consumed": "06\/01\/2023"
  },
  {
    "id": "023",
    "name": "Sine",
    "year": 2008,
    "type": "red blend",
    "varietal": "Grenache, Chardonnay",
    "rating": 3,
    "consumed": "no"
  },
  {
    "id": "024",
    "name": "kidge",
    "year": 2012,
    "type": "red blend",
    "varietal": "cab sav,merlot,durif, Pinotage, chenin",
    "rating": 4.4,
    "consumed": "no"
  },
  {
    "id": "025",
    "name": "Boden",
    "year": 2005,
    "type": "red blend",
    "varietal": "Gewürztraminer, Pinotage, Barbera",
    "rating": 4.3,
    "consumed": "no"
  },
  {
    "id": "026",
    "name": "kidge",
    "year": 2000,
    "type": "red blend",
    "varietal": "Pinot noir",
    "rating": 3.2,
    "consumed": "no"
  },
  {
    "id": "027",
    "name": "kidge",
    "year": 2004,
    "type": "white",
    "varietal": "Carménère",
    "rating": 4.9,
    "consumed": "no"
  },
  {
    "id": "028",
    "name": "kidge",
    "year": 2001,
    "type": "white",
    "varietal": "Carignan, Gamay, Pinot noir",
    "rating": 4.7,
    "consumed": "yes",
    "Date consumed": "04\/01\/2020"
  },
  {
    "id": "029",
    "name": "Boden",
    "year": 2011,
    "type": "white blend",
    "varietal": "chard, verdelho, Merlot",
    "rating": 4.9,
    "consumed": "no"
  },
  {
    "id": "030",
    "name": "kidge",
    "year": 2008,
    "type": "red blend",
    "varietal": "Muscat, Gamay",
    "rating": 2.9,
    "consumed": "yes",
    "Date consumed": "30\/10\/2022"
  },
  {
    "id": "031",
    "name": "kidge",
    "year": 2019,
    "type": "white",
    "varietal": "Gamay, Syrah",
    "rating": 2.8,
    "consumed": "yes",
    "Date consumed": "15\/12\/2021"
  },
  {
    "id": "032",
    "name": "kidge",
    "year": 2022,
    "type": "white blend",
    "varietal": "Chenin blanc, Cabernet Sauvignon",
    "rating": 3.9,
    "consumed": "yes",
    "Date consumed": "28\/05\/2020"
  },
  {
    "id": "033",
    "name": "Boden",
    "year": 2006,
    "type": "red blend",
    "varietal": "Carignan, Malbec, Grenache",
    "rating": 2.7,
    "consumed": "yes",
    "Date consumed": "03\/11\/2022"
  },
  {
    "id": "034",
    "name": "kidge",
    "year": 2020,
    "type": "red blend",
    "varietal": "Mourvèdre, Gewürztraminer",
    "rating": 4.7,
    "consumed": "no"
  },
  {
    "id": "035",
    "name": "kidge",
    "year": 2012,
    "type": "red blend",
    "varietal": "Muscat, Malbec",
    "rating": 4.2,
    "consumed": "yes",
    "Date consumed": "10\/02\/2022"
  }
]