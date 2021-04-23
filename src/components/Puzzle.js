import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getPuzzle } from "../services/services";
import PuzzlePiece from "./PuzzlePiece";
import _ from "lodash";

export default function Puzzle() {
  const { puzzleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState();
  const [wordList, setWordList] = useState([]);
  const [guessList, setGuessList] = useState([]);
  const [gameState, setGameState] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await getPuzzle(puzzleId);
      setPuzzle(response);
      shuffleWords(response);
      setLoading(false);
    }
    fetchData();
  }, [puzzleId]);

  const shuffleWords = (puzzle) => {
    let unshuffled = [];
    puzzle.groups.map((group, index) => {
      return group.words.map((word) => {
        word.group = group.id;
        word.groupIndex = index;
        word.selected = false;
        word.solved = false;
        return unshuffled.push(word);
      });
    });

    const shuffled = _.shuffle(unshuffled);
    setWordList(shuffled);
  };

  useEffect(() => {
    let complete = true;
    wordList.map((word) => {
      return (complete = complete && word.solved);
    });
    setGameState(complete);
  }, [wordList]);

  const handleGuess = (index) => {
    let newWordList = [...wordList];
    let newGuessList = [...guessList];
    if (
      !guessList.some((guess) => guess === index) &&
      !wordList[index].solved
    ) {
      newGuessList.push(index);
      newWordList[index].selected = true;
    } else {
      newGuessList = newGuessList.filter((obj) => obj !== index);
      newWordList[index].selected = false;
    }
    setGuessList([...newGuessList]);
    if (newGuessList.length === 4) {
      let groupList = [];
      guessList.map((guess) => {
        return groupList.push(wordList[guess].group);
      });
      if (groupList.every((val, i, arr) => val === arr[0])) {
        newGuessList.map((guess) => {
          return (newWordList[guess].solved = true);
        });
      }
      let solvedWords = newWordList.filter((word) => word.solved);
      const unsolvedWords = newWordList.filter((word) => !word.solved);
      solvedWords = _.orderBy(solvedWords, ["group"]);
      newWordList = solvedWords.concat(unsolvedWords);
      const count = newWordList.filter((word) => {
        return word.solved;
      });

      newWordList.map((word, index) => {
        if (count.length >= 12) newWordList[index].solved = true;
        return (newWordList[index].selected = false);
      });
      setGuessList([]);
    }
    setWordList([...newWordList]);
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
        <React.Fragment>
          <Typography variant="h2">{puzzle.puzzle}</Typography>
          <Box mt={5}>
            <Grid container spacing={2}>
              {wordList.map((word, index) => {
                return (
                  <Grid key={index} item xs={3}>
                    <PuzzlePiece
                      word={word}
                      index={index}
                      handleGuess={handleGuess}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          <Box mt={5}>
            <Typography variant="h2">{gameState ? "Complete" : ""}</Typography>
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
