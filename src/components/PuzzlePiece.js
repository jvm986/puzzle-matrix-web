import { makeStyles, Paper } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  puzzlePiece: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  selected: {
    background: theme.palette.grey[400],
  },
  unselected: {
    background: theme.palette.grey[300],
  },
  solved1: {
    background: theme.palette.gradient.b.light,
  },
  solved2: {
    background: theme.palette.gradient.c.light,
  },
  solved3: {
    background: theme.palette.gradient.d.light,
  },
  solved4: {
    background: theme.palette.gradient.e.light,
  },
}));

export default function PuzzlePiece(props) {
  const classes = useStyles();
  const { word, index, handleGuess } = props;

  return (
    <React.Fragment>
      <Paper
        elevation={word.selected ? 1 : 2}
        className={
          word.selected
            ? `${classes.puzzlePiece} ${classes.selected}`
            : word.solved
            ? `${classes.puzzlePiece} ${
                classes[`solved${word.groupIndex + 1}`]
              }`
            : `${classes.puzzlePiece} ${classes.unselected}`
        }
        onClick={() => handleGuess(index, word)}
      >
        {word.word}
      </Paper>
    </React.Fragment>
  );
}
