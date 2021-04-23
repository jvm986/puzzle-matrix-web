import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { getPuzzle, submitPuzzle } from "../services/services";
import WordEntry from "./WordEntry";
import CategoryEntry from "./CategoryEntry";

export default function PuzzleEntry() {
  const { puzzleId } = useParams();
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [puzzle, setPuzzle] = useState({
    puzzle: "",
    groups: [
      {
        group: "test",
        categories: [],
        words: [],
      },
      {
        group: "test",
        categories: [],
        words: [],
      },
      {
        group: "test",
        categories: [],
        words: [],
      },
      {
        group: "test",
        categories: [],
        words: [],
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      const response = await getPuzzle(puzzleId);
      setPuzzle(response);
      setLoading(false);
    }
    const puzzleIdInt = parseInt(puzzleId);
    puzzleIdInt ? fetchData() : setLoading(false);
  }, [puzzleId]);

  const updatePuzzle = (value, groupIndex, updateType) => {
    const newPuzzle = { ...puzzle };
    switch (updateType) {
      case "word":
        newPuzzle.groups[groupIndex].words = value;
        break;
      case "category":
        newPuzzle.groups[groupIndex].categories = value;
        break;
      case "name":
        newPuzzle.puzzle = value;
        break;
      default:
        break;
    }
    setPuzzle(newPuzzle);
    let complete = true;
    puzzle.groups.map((group) => {
      complete = complete = group.categories.length > 0;
      return group.words.map((word) => {
        return (complete = complete && (word ? true : false));
      });
    });
    setPuzzleComplete(complete);
  };

  const handleSubmit = async () => {
    const newPuzzle = puzzle;
    newPuzzle.groups = puzzle.groups.map((group) => {
      group.words = group.words.map((word) => {
        return word.id;
      });
      group.categories = group.categories.map((category) => {
        return category.id;
      });
      return group;
    });
    const submittedPuzzle = await submitPuzzle(newPuzzle);
    history.push(`/puzzle/${submittedPuzzle.id}`);
  };

  return (
    <React.Fragment>
      {loading ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "35%",
            transform: "translate(-50%, -35%)",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Container maxWidth="sm">
          <TextField
            label="Puzzle Name"
            value={puzzle.puzzle}
            onChange={(event) => {
              return updatePuzzle(event.target.value, null, "name");
            }}
          ></TextField>
          {Array.from(Array(4)).map((value, groupIndex) => {
            return (
              <React.Fragment key={groupIndex}>
                <Box mt={2}>
                  <Typography variant="h5">{`Group ${
                    groupIndex + 1
                  }`}</Typography>
                </Box>
                <Box mt={1}>
                  <WordEntry
                    puzzle={puzzle}
                    groupIndex={groupIndex}
                    updatePuzzle={updatePuzzle}
                  />
                </Box>
                <Box mt={2}>
                  <CategoryEntry
                    puzzle={puzzle}
                    groupIndex={groupIndex}
                    updatePuzzle={updatePuzzle}
                  />
                </Box>
              </React.Fragment>
            );
          })}
          <Box mt={2}>
            <Button disabled={!puzzleComplete} onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Container>
      )}
    </React.Fragment>
  );
}
