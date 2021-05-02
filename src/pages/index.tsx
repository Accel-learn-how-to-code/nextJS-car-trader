import { getMakes } from "../database/getMakes";
import { Field, Form, Formik } from "formik";
import {
  Grid,
  Paper,
  makeStyles,
  Theme,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import { useRouter } from "next/router";

interface Make {
  make: string;
  count: number;
}
export interface HomeProps {
  makes: Make[];
}

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    margin: "auto",
    maxWidth: 500,
    padding: theme.spacing(3),
  },
}));

const prices = [500, 1000, 5000, 15000, 25000, 50000, 250000];
const inputNames = [
  { name: "Make", content: "All Makes" },
  { name: "Model", content: "All Model" },
  { name: "minPrice", content: "Min Price" },
  { name: "Make", content: "All Makes" },
];

export default function Home({ makes }: HomeProps) {
  const classes = useStyles();
  const { query } = useRouter();

  const initialValues = {
    make: query.make || "all",
    model: query.model || "all",
    minPrice: query.minPrice || "all",
    maxPrice: query.maxPrice || "all",
  };
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ values }) => (
        <Form>
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="searchMake">Make</InputLabel>
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

              <Grid item xs={12} sm={6}>
                MODEL
              </Grid>

              <Grid item xs={12} sm={6}>
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

              <Grid item xs={12} sm={6}>
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
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

export const getServerSideProps = async (ctx) => {
  const makes = await getMakes();
  return { props: { makes } };
};
