import { Grid } from "@material-ui/core";
import Search from ".";
import { getModels, Model } from "../database/getModels";
import { getMakes, Make } from "../database/getMakes";
import { getAsString } from "../getAsString";
import { CarModel } from "../../api/Car";
import { getPaginatedCars } from "../database/getPaginatedCars";
import { useRouter } from "next/router";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import { PaginationRenderItemParams } from "@material-ui/lab";
import { ParsedUrlQuery, stringify } from "querystring";
import Link from "next/link";
import { forwardRef, useState } from "react";
import useSWR from "swr";
import deepEqual from "fast-deep-equal";
import { CarPagination } from "../components/CarPagination";
import React from "react";
import { CarCard } from "../components/CarCard";

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
  const { query } = useRouter();
  const [serverQuery] = useState(query);
  // SWR sẽ hoạt động từ lần request thứ 2 trở đi nhờ initialData
  // Lần đầu sẽ do getServerSideProps
  const { data } = useSWR("/api/cars?" + stringify(query), {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery)
      ? { cars, totalPages }
      : undefined,
  });
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>
      <Grid container item xs={12} sm={7} md={9} lg={10} spacing={3}>
        <Grid item xs={12}>
          <CarPagination totalPages={data?.totalPages} />
        </Grid>

        {(data ? data.cars : cars).map((car) => (
          <Grid item key={car.id} xs={12} sm={6}>
            <CarCard car={car} />
          </Grid>
        ))}
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
