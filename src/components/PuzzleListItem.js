import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { useHistory } from "react-router";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function PuzzleListItem(props) {
  const classes = useStyles();
  const { puzzle } = props;
  const history = useHistory();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          jvm986
        </Typography>
        <Typography variant="h5" component="h2">
          {puzzle.puzzle}
        </Typography>
        <Box mt={1} mb={1}>
          <Rating value={2} readOnly={true} />
        </Box>
        <Typography variant="body2" component="p">
          Difficulty: Easy
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => history.push(`/puzzle/${puzzle.id}`)}
        >
          Play
        </Button>
      </CardActions>
    </Card>
  );
}
