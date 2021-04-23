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

import { searchCategories, addCategory } from "../services/services";

const filter = createFilterOptions();

export default function WordEntry(props) {
  const { puzzle, updatePuzzle, groupIndex } = props;
  const [categoryList, setCategoryList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [dialogueOpen, setDialogueOpen] = useState(false);

  const handleAddCategory = async () => {
    const addedCategory = await addCategory({ category: newCategory });
    setCategoryList([...categoryList, addedCategory]);
    updatePuzzle(
      [...puzzle.groups[groupIndex].categories, addedCategory],
      groupIndex,
      "category"
    );
    setDialogueOpen(false);
  };

  const debounceSearch = useMemo(
    () =>
      _.throttle(async (searchTerm) => {
        const results = await searchCategories(searchTerm);
        if (results.count > 0) {
          setCategoryList(results.results);
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
        value={puzzle.groups[groupIndex].categories}
        onInputChange={(event, newValue) => {
          setInputValue(newValue);
        }}
        onChange={(event, newValue) => {
          let needsAddValue = false;
          newValue.map((value) => {
            if (value && value.inputValue) {
              setNewCategory(value.inputValue);
              setDialogueOpen(true);
              needsAddValue = true;
            }
            return null;
          });
          if (!needsAddValue) {
            updatePuzzle(newValue, groupIndex, "category");
          }
        }}
        filterOptions={(options, params) => {
          if (puzzle.groups[groupIndex].categories.length >= 3) {
            return [{ category: "Maximum of 3 Categories Allowed" }];
          }
          const filtered = filter(options, params);
          if (
            options.map((option) => option.category).includes(params.inputValue)
          ) {
            return filtered;
          }

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue.toLowerCase(),
              category: `Add "${params.inputValue.toLowerCase()}"`,
            });
          }
          return filtered;
        }}
        multiple
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={categoryList
          .concat(puzzle.groups[groupIndex].categories)
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
          return option.category;
        }}
        getOptionDisabled={(option) => {
          if (puzzle.groups[groupIndex].categories.length >= 3) {
            return true;
          }
          if (!option) return false;
          return puzzle.groups.some((group) => {
            return group.categories.some((category) => {
              return category ? category.id === option.id : false;
            });
          });
        }}
        renderOption={(option) => option.category}
        renderInput={(params) => (
          <TextField {...params} label="Enter Categories" variant="outlined" />
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
            {newCategory
              ? `Are you sure you want to add "${newCategory}" to the database?`
              : "Something went wrong ..."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogueOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCategory} color="primary">
            Add Category
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
