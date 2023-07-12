const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "moviesData.db");

const app = express();
app.use(express.json());

let db = null;

const initializeDataBaseServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB error:${error.message}`);
    process.exit(1);
  }
};

initializeDataBaseServer();

//api1

app.get("/movies/", async (request, response) => {
  const moviesQuery = `
    SELECT movie_name FROM movie;
    `;
  const moviesArray = await db.all(moviesQuery);
  response.send(
    moviesArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});

//api2

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const addMovieQuery = `
        INSERT INTO movie(director_id,movie_Name,lead_Actor)
        VALUES ('${directorId}','${movieName}','${leadActor}');`;
  await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});

module.exports = app;
