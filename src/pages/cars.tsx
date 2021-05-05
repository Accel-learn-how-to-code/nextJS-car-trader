import { Grid } from "@material-ui/core";
import Search from ".";
import { getModels, Model } from "../database/getModels";
import { getMakes, Make } from "../database/getMakes";
import { getAsString } from "../getAsString";
import { CarModel } from "../../api/Car";
import { getPaginatedCars } from "../database/getPaginatedCars";

export interface CarsListProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
}

export default function CarList({
  makes,
  models,
  cars,
  totalPages,
}: CarsListProps) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>
      <Grid item xs={12} sm={7} md={9} lg={10}>
        <pre>{JSON.stringify({ totalPages, cars }, null, 4)}</pre>
      </Grid>
    </Grid>
  );
}
export const getServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query),
  ]);
  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPages: pagination.totalPages,
    },
  };
};
