"use client";
import { Box, Checkbox, FormControl, FormLabel, Grid, Sheet, Typography } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { SubmitButton } from "@/components/SubmitButton";
import TextField from "@/components/TextField";
import SelectField from "@/components/SelectField";
import AutoCompleteField from "@/components/AutoCompleteField";
import { IS_DEVELOPER } from "@/common";
import { GetWineReturn } from "@/service/wine.service";
import { edit, getWine } from "../../add/_actions";
import { FormSchemaType, FormSchema } from "../../add/form-schema";
import { Notice } from "@/components/Notice";

const wineTypes = ["Red", "White", "Rosé", "White Blend", "Red Blend"]
const varietal = ["Cabernet Sauvignon", "Merlot", "Shiraz", "Chenin Blanc", "Sauvignon Blanc", "Verdelho", "Chardonnay", "Durif",
  "Pinot Noir", "Zinfandel", "Malbec", "Riesling", "Tempranillo", "Grenache", "Sangiovese", "Viognier", "Moscato"]


const Page = ({ params: { id } }: { params: { id: string } }) => {
  const [result, setResult] = useState<Boolean>();
  const { data: session } = useSession();
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [wine, setWine] = useState<GetWineReturn>()

  useEffect(() => {
    getWine(id).then((strWine) => {
      const wine: GetWineReturn = JSON.parse(strWine);
      setWine(wine);
      IS_DEVELOPER && console.log(wine)
    });
  }, []);

  const {
    register,
    handleSubmit,
    control, watch,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: wine?.name
    }
  });

  const consumed = watch("consumed", wine?.consumed);

  const processForm: SubmitHandler<FormSchemaType> = async (data) => {
    console.log(data)
    const result = await edit(data, (session as any)?.user.id, id);

    if (!result) {
      return;
    }
    setShowSubmitButton(false);
    // reset();
    setResult(result);
  };

  return (
    <Sheet sx={{ width: "70%" }}>
      <div>
        <Typography level="h2">Add a wine to your list</Typography>
      </div>
      <form onSubmit={handleSubmit(processForm)}>
        {wine?.name && <Grid container spacing={{ xs: 2, md: 3 }} sx={{ flexGrow: 1 }}>
          <Grid xs={12} sm={12} md={6}>
            <Controller name="name" control={control} defaultValue={wine.name} render={({ field }) => (
              <TextField placeholder="e.g. Rose" fieldError={errors.name} defaultValue={wine.name}
                fieldName="name" label="Wine name" register={register} type="text" />)}
            />
          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Controller name="year" control={control} defaultValue={wine.year} render={() => (
              <TextField placeholder="e.g. 2021, 2019, 2015, 1998, etc.." defaultValue={wine.year} fieldError={errors.year}
                fieldName="year" label="Wine year" register={register} type="number" />)}
            />
          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Controller
              name="type"
              control={control} defaultValue={wine.type}
              render={({ field }) => (
                <SelectField fieldError={errors.type} defaultValue={wine.type} label="Wine type" placeholder="select wine type"
                  options={wineTypes.map((wine) => ({ label: wine, value: wine }))} setValue={field.onChange} >
                </SelectField>
              )}
            />

          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Controller
              name="varietal"
              control={control} defaultValue={wine.varietal}
              render={({ field }) => (
                <AutoCompleteField fieldError={errors.varietal} label="Varietal" defaultValue={wine.varietal}
                  options={varietal.map(v => ({ label: v, value: v }))} placeholder="select varietal" setValue={field.onChange} />
              )}
            />
          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Controller name="rating" control={control} defaultValue={wine.rating} render={() => (
              <TextField placeholder="e.g. 4.5" fieldError={errors.rating} defaultValue={wine.rating}
                fieldName="rating" label="Your rating" register={register} type="number" />)}
            />
          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Box sx={{ justifyContent: "flex-start", display: "flex", m: 0 }}>
              <Controller name="consumed" control={control} defaultValue={wine.consumed} render={({ field }) => (
                <FormControl sx={{ mr: 3, my: 4 }}>
                  <FormLabel> </FormLabel>
                  <Checkbox name={"consumed"} defaultChecked={wine.consumed} checked={field.value} onChange={field.onChange} label="Consumed" size="lg" color="warning" />
                </FormControl>
              )}
              />
              {
                consumed && <TextField fieldError={errors.date_consumed} type="date" name="date_consumed"
                  fieldName="date_consumed" label="Date consumed"
                  defaultValue={
                    wine.date_consumed
                      ? new Date(wine.date_consumed).toISOString().split('T')[0]
                      : ''
                  }

                  register={register} ></TextField>
              }
            </Box>
          </Grid>
        </Grid>}
        {showSubmitButton && <SubmitButton></SubmitButton>}
        {!showSubmitButton && result && (
          <Notice messages={["Edit was successful"]} isSuccess={Boolean(result)} onClose={() => { setShowSubmitButton(true); }} />
        )}
      </form>
    </Sheet >
  );
};

export default Page;
