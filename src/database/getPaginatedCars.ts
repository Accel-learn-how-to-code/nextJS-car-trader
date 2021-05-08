import { CarModel } from "../../api/Car";
import { getAsString } from "../getAsString";
import { openDB } from "../openDB";

const mainQuery = `
  from car
  where (@make is NULL or @make = make) 
  and (@model is NULL or @model = model) 
  and (@minPrice is NULL or @minPrice <= price) 
  and (@maxPrice is NULL or @maxPrice >= price)`;

export async function getPaginatedCars(query) {
  const db = await openDB();

  const page = getValueNumber(query.page) || 1;
  const rowsPerPage = getValueNumber(query.rowsPerPage) || 4;
  const offset = (page - 1) * rowsPerPage;

  const dbParams = {
    "@make": getValueStr(query.make),
    "@model": getValueStr(query.model),
    "@minPrice": getValueNumber(query.minPrice),
    "@maxPrice": getValueNumber(query.maxPrice),
  };

  const carsPromise = db.all<CarModel[]>(
    `select * ${mainQuery} limit @rowsPerPage offset @offset`,
    {
      ...dbParams,
      "@rowsPerPage": rowsPerPage,
      "@offset": offset,
    }
  );

  const totalRowsPromise = db.get<{ count: number }>(
    `select COUNT(*) as count ${mainQuery}`,
    { ...dbParams }
  );

  const [cars, totalRows] = await Promise.all([carsPromise, totalRowsPromise]);

  return { cars, totalPages: Math.ceil(totalRows.count / rowsPerPage) };
}

function getValueNumber(value: string | string[]) {
  const str = getValueStr(value);
  const number = parseInt(str);
  return isNaN(number) ? null : number;
}

function getValueStr(value: string | string[]) {
  const str = getAsString(value);
  return !str || str.toLowerCase() === "all" ? null : str;
}
