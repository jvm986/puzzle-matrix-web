import { Box, CircularProgress, Container, Grid } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { getPuzzleList } from "../services/services";
import PuzzleListItem from "./PuzzleListItem";

export default function PuzzleList() {
  const [puzzleList, setPuzzleList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await getPuzzleList(page);
      setPuzzleList(response);
      setLoading(false);
    }
    fetchData();
  }, [page]);

  return (
    <div>
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
        <Container>
          <Grid container spacing={2}>
            {puzzleList.results.map((puzzle) => {
              return (
                <Grid item key={puzzle.id} xs={12} md={3}>
                  <PuzzleListItem key={puzzle.id} puzzle={puzzle} />
                </Grid>
              );
            })}
          </Grid>
          <Box mt={5}>
            <Grid container alignItems="center" justify="center">
              <Grid item>
                <Pagination
                  count={Math.ceil(puzzleList.count / 12)}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                />
              </Grid>
            </Grid>
          </Box>
        </Container>
      )}
    </div>
  );
}
