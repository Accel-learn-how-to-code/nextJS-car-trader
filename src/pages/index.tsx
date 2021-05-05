import { getMakes, Make } from "../database/getMakes";
import { Field, Form, Formik, useField, useFormikContext } from "formik";
import {
  Grid,
  Paper,
  makeStyles,
  Theme,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectProps,
  Button,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { getModels, Model } from "../database/getModels";
import { getAsString } from "../getAsString";
import useSWR from "swr";

export interface SearchProps {
  makes: Make[];
  models: Model[];
  singleColumn?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    margin: "auto",
    maxWidth: 500,
    padding: theme.spacing(3),
  },
}));

const prices = [500, 1000, 5000, 15000, 25000, 50000, 250000];

export default function Search({ makes, models, singleColumn }: SearchProps) {
  const router = useRouter();
  const classes = useStyles();
  const { query } = useRouter();
  const smValue = singleColumn ? 12 : 6;

  const initialValues = {
    make: getAsString(query.make) || "all",
    model: getAsString(query.model) || "all",
    minPrice: getAsString(query.minPrice) || "all",
    maxPrice: getAsString(query.maxPrice) || "all",
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        //shallow routing
        router.push(
          {
            pathname: "/cars",
            query: { ...values, page: 1 },
          },
          undefined,
          { shallow: true }
        );
      }}
    >
      {({ values }) => (
        <Form>
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={smValue}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="searchMake">Makes</InputLabel>
                  <Field
                    name="make"
                    as={Select}
                    labelId="searchMake"
                    label="Make"
                  >
                    <MenuItem value="all">
                      <em>All Makes</em>
                    </MenuItem>
                    {makes.map((x, index) => (
                      <MenuItem key={index} value={x.make}>
                        {`${x.make} (${x.count})`}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={smValue}>
                <ModelSelect name="model" make={values.make} models={models} />
              </Grid>

              <Grid item xs={12} sm={smValue}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="searhMinPrices">Min Prices</InputLabel>
                  <Field
                    name="minPrice"
                    as={Select}
                    labelId="searhMinPrices"
                    label="Min Price"
                  >
                    <MenuItem value="all">
                      <em>No Min</em>
                    </MenuItem>
                    {prices.map((x, index) => (
                      <MenuItem key={index} value={x}>
                        {x}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={smValue}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="searhMaxPrice">Max Prices</InputLabel>
                  <Field
                    name="maxPrice"
                    as={Select}
                    labelId="searhMaxPrice"
                    label="Max Price"
                  >
                    <MenuItem value="all">
                      <em>No Max</em>
                    </MenuItem>
                    {prices.map((x, index) => (
                      <MenuItem key={index} value={x}>
                        {x}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}
// export interface ModelSelectProps extends SelectProps {
//   name: string;
//   models: Model[];
//   make: string;
// }

export function ModelSelect({ models, make, ...props }) {
  const { setFieldValue } = useFormikContext();
  const [field] = useField({
    name: props.name,
  });
  //need research
  const { data } = useSWR<Model[]>("/api/models?make=" + make, {
    dedupingInterval: 60000,
    onSuccess: (newValues) => {
      if (!newValues.map((a) => a.model).includes(field.value)) {
        setFieldValue("model", "all");
      }
    },
  });
  const newModels = data || models;
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="searchMake">Models</InputLabel>
      <Select
        name="model"
        labelId="searchMake"
        label="Model"
        {...field}
        {...props}
      >
        <MenuItem value="all">
          <em>All Model</em>
        </MenuItem>
        {newModels.map((x, index) => (
          <MenuItem key={index} value={x.model}>
            {`${x.model} (${x.count})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export const getServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  const [makes, models] = await Promise.all([getMakes(), getModels(make)]);
  // const makes = await getMakes();
  // const models = await getModels(make);
  return { props: { makes, models } };
};
