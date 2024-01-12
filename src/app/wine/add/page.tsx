"use client";
import { Alert, Box, Checkbox, FormControl, FormHelperText, FormLabel, Grid, IconButton, Sheet, Typography } from "@mui/joy";
import React, { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, FormSchemaType, ValidationResult } from "./form-schema";
import { addWine } from "./_actions";
import { useSession } from "next-auth/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/SubmitButton";
import TextField from "@/components/TextField";
import SelectField from "@/components/SelectField";
import AutoCompleteField from "@/components/AutoCompleteField";
import { PAGES } from "@/common";
import { InfoOutlined } from "@mui/icons-material";

const wineTypes = ["Red", "White", "Rosé", "White Blend", "Red Blend"]
const varietal = ["Cabernet Sauvignon", "Merlot", "Shiraz", "Chenin Blanc", "Sauvignon Blanc", "Verdelho", "Chardonnay", "Durif",
  "Pinot Noir", "Zinfandel", "Malbec", "Riesling", "Tempranillo", "Grenache", "Sangiovese", "Viognier", "Moscato"]

const Page = ({ params: { id } }: { params: { id: string } }) => {
  const [result, setResult] = useState<ValidationResult>();
  const { data: session } = useSession();
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    control, watch, reset,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // date_consumed: null
    }
  });

  const consumed = watch("consumed");

  const processForm: SubmitHandler<FormSchemaType> = async (data) => {
    console.log(data)
    const result = await addWine(data, (session as any)?.user.id);

    if (!result) {
      return;
    }
    setShowSubmitButton(false);
    reset();
    setResult(result);
  };

  return (
    <Sheet sx={{ width: "70%" }}>
      <div>
        <Typography level="h2">Add a wine to your list</Typography>
      </div>
      <form onSubmit={handleSubmit(processForm)}>
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ flexGrow: 1 }}>
          <Grid xs={12} sm={12} md={6}>
            <Controller name="name" control={control} defaultValue="" render={() => (
              <TextField placeholder="e.g. Rose" fieldError={errors.name}
                fieldName="name" label="Wine name" register={register} type="text" />)}
            />
          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Controller name="year" control={control} render={() => (
              <TextField placeholder="e.g. 2021, 2019, 2015, 1998, etc.." fieldError={errors.year}
                fieldName="year" label="Wine year" register={register} type="number" />)}
            />
          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <SelectField fieldError={errors.type} label="Wine type" placeholder="select wine type"
                  options={wineTypes.map((wine) => ({ label: wine, value: wine }))} setValue={field.onChange} >
                </SelectField>
              )}
            />

          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Controller
              name="varietal"
              control={control}
              render={({ field }) => (
                <AutoCompleteField fieldError={errors.varietal} label="Varietal"
                  options={varietal.map(v => ({ label: v, value: v }))} placeholder="select varietal" setValue={field.onChange} />
              )}
            />
          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Controller name="rating" control={control} render={() => (
              <TextField placeholder="e.g. 4.5" fieldError={errors.rating}
                fieldName="rating" label="Your rating" register={register} type="number" inputMode="decimal" />)}
            />
          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Box sx={{ justifyContent: "flex-start", display: "flex", m: 0 }}>
              <Controller name="consumed" control={control} render={({ field }) => (
                <FormControl sx={{ mr: 3, my: 4 }}>
                  <FormLabel> </FormLabel>
                  <Checkbox defaultChecked={field.value} name={"consumed"} checked={field.value} onChange={field.onChange} label="Consumed" size="lg" color="warning" />
                  {errors.consumed?.message && (
                    <FormHelperText sx={{ color: "red" }}>
                      <InfoOutlined color="error" />
                      {errors.consumed.message}
                    </FormHelperText>
                  )} </FormControl>
              )}
              />
              {consumed && <TextField fieldError={errors.date_consumed} type="date" name="date_consumed"
                fieldName="date_consumed" label="Date consumed" register={register} ></TextField>}

            </Box>
          </Grid>
        </Grid>
        {showSubmitButton && <SubmitButton></SubmitButton>}
        {!showSubmitButton && result?.success && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              flexDirection: "column",
              mt: 3,
            }}
          >
            <Alert
              key={"Success"}
              sx={{ alignItems: "flex-start" }}
              startDecorator={<CheckCircleIcon />}
              variant="soft"
              color={"success"}
              endDecorator={
                <Box sx={{ display: { xs: "inline-grid", sm: "flex" } }}>
                  <IconButton
                    variant="solid"
                    color={"success"}
                    onClick={() => {
                      push(PAGES.edit + result._id);
                    }}
                    sx={{ m: 2, mb: 0, px: 1, pb: 0.5 }}
                  >
                    Go to it
                  </IconButton>
                  <IconButton
                    variant="solid"
                    color={"success"}
                    sx={{ m: 2, mb: 0, px: 1, pb: 0.5 }}
                    onClick={() => { reset(); setShowSubmitButton(true); window.location.reload() }}
                  >
                    Add one more
                  </IconButton>
                </Box>
              }
            >
              <div>
                <div>{"Success"}</div>
                <Typography level="body-sm" color={"success"}>
                  Wine has been added.
                </Typography>
              </div>
            </Alert>
          </Box>
        )}
      </form>
    </Sheet >
  );
};

export default Page;
