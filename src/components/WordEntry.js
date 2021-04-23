import React, { useEffect, useMemo, useState } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";

import _ from "lodash";

import { searchWords, addWord } from "../services/services";

const filter = createFilterOptions();

export default function WordEntry(props) {
  const { puzzle, updatePuzzle, groupIndex } = props;
  const [wordList, setWordList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [newWord, setNewWord] = useState("");
  const [dialogueOpen, setDialogueOpen] = useState(false);

  const handleAddWord = async () => {
    const addedWord = await addWord({ word: newWord });
    setWordList([...wordList, addedWord]);
    updatePuzzle(
      [...puzzle.groups[groupIndex].words, addedWord],
      groupIndex,
      "word"
    );
    setDialogueOpen(false);
  };

  const debounceSearch = useMemo(
    () =>
      _.throttle(async (searchTerm) => {
        const results = await searchWords(searchTerm);
        if (results.count > 0) {
          setWordList(results.results);
        }
      }, 200),
    []
  );

  useEffect(() => {
    if (inputValue) {
      debounceSearch(inputValue);
    }
  }, [inputValue, debounceSearch]);

  return (
    <React.Fragment>
      <Autocomplete
        value={puzzle.groups[groupIndex].words}
        onInputChange={(event, newValue) => {
          setInputValue(newValue);
        }}
        onChange={(event, newValue) => {
          let needsAddValue = false;
          newValue.map((value) => {
            if (value && value.inputValue) {
              setNewWord(value.inputValue);
              setDialogueOpen(true);
              needsAddValue = true;
            }
            return null;
          });
          if (!needsAddValue) {
            updatePuzzle(newValue, groupIndex, "word");
          }
        }}
        filterOptions={(options, params) => {
          if (puzzle.groups[groupIndex].words.length >= 4) {
            return [{ word: "Maximum of 4 Words Allowed" }];
          }
          const filtered = filter(options, params);
          if (
            options.map((option) => option.word).includes(params.inputValue)
          ) {
            return filtered;
          }

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue.toLowerCase(),
              word: `Add "${params.inputValue.toLowerCase()}"`,
            });
          }
          return filtered;
        }}
        multiple
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={wordList
          .concat(puzzle.groups[groupIndex].words)
          .reduce((acc, current) => {
            const x = acc.find((item) => item.id === current.id);
            if (!x) {
              return acc.concat([current]);
            }
            return acc;
          }, [])}
        getOptionSelected={(option, selectedValue) => {
          return option.id === selectedValue.id;
        }}
        getOptionLabel={(option) => {
          if (typeof option === "string" || !option) {
            return option;
          }
          if (option && option.inputValue) {
            return option.inputValue;
          }
          return option.word;
        }}
        getOptionDisabled={(option) => {
          if (puzzle.groups[groupIndex].words.length >= 4) {
            return true;
          }
          if (!option) return false;
          return puzzle.groups.some((group) => {
            return group.words.some((word) => {
              return word ? word.id === option.id : false;
            });
          });
        }}
        renderOption={(option) => option.word}
        renderInput={(params) => (
          <TextField {...params} label="Enter Words" variant="outlined" />
        )}
      />
      <Dialog
        open={dialogueOpen}
        onClose={() => setDialogueOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {newWord
              ? `Are you sure you want to add "${newWord}" to the database?`
              : "Something went wrong ..."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogueOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddWord} color="primary">
            Add Word
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
