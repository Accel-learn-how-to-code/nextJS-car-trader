import { CarModel } from "../../../../api/Car";
import { openDB } from "../../../openDB";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      margin: "auto",
      maxWidth: "60%",
    },
    img: {
      margin: "auto",
      display: "block",
      maxWidth: "100%",
      maxHeight: "100%",
    },
  })
);

interface CarDetailProps {
  car: CarModel;
}

export default function CarDetail({ car }: CarDetailProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={5}>
            <img
              className={classes.img}
              alt={car.make + car.model}
              src={car.photoUrl}
            />
          </Grid>
          
          <Grid item xs={12} sm={12} md={7} container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h4">
                  {car.make + " " + car.model}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  ${car.price}
                </Typography>
                <Typography variant="body2" gutterBottom color="textSecondary">
                  Year: {car.year}
                </Typography>
                <Typography variant="body2" gutterBottom color="textSecondary">
                  KMs: {car.kilometers}
                </Typography>
                <Typography variant="body2" gutterBottom color="textSecondary">
                  Fuel Type: {car.fuelType}
                </Typography>
                <Typography variant="body2" gutterBottom color="textSecondary">
                  Details: {car.details}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const id = ctx.params.id;
  const db = await openDB();
  const car = await db.get("select * from Car where id = ?", id);
  return { props: { car: car || null } };
};
