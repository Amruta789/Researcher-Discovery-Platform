import "./App.css";
import { Button, Grid } from "@mui/material";
import axios from "axios";

import Typography from "@mui/material/Typography";

import { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import SearchField from "./SearchField";
const uri = process.env.REACT_APP_BACKEND_URI;

function App() {
  const [researchArea, setResearchArea] = useState("");
  const [results, setResults] = useState(null);
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState("");
  
  // This functions retrieves and displays first ten researchers for the home page.
  const startResults = async ()=>{
    let res = await axios.get(
      uri+"/api/researchers",
      { withCredentials: true }
    );
    setResults(res.data.slice(0, 10));
  }

  // Retrieves the array of all unique research areas from database
  const getAllInterests = async ()=>{
    let res = await axios.get(uri + "/api/researchers/interests", {withCredentials: true});
    setInterests(res.data);
  }
  useEffect(() => {
   startResults();
   getAllInterests();
  }, [])

  // Given a research area in the search bar, this fucntion retrieves all profiles with that area from database API.
  const getResults = async () => {
    if(researchArea.length === 0){
      setError("Please enter something to show the results");
      return;
    }
    setError("");
    let res = await axios.get(
      `${uri}/api/researchers/search?query=${researchArea}`,
      { withCredentials: true }
    );
    setResults(res.data);
  };

  return (
    <div>
      <div style={{ margin: "3%" }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={10}>
            <SearchField researchInterests={interests} researchArea={researchArea} setResearchArea={setResearchArea} errorMsg={error} setErrorMsg={setError} getResults={getResults}/>
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={getResults}
              variant="contained"
              type="submit"
              color="success"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </div>
      <div className="profiles">
        {(() => {
            if (results != null && results.length === 0) {
              return (
                <div style={{"textAlign": "center", "marginTop": "10%"}}>
                <Typography variant="h2" style={{"color": "orange"}}>
                  No results found....!!
                </Typography>
              </div>
              )
            } else {
              return (
                <Grid
                  container
                  spacing={4}
                  justifyContent="space-evenly"
                  alignItems="center"
                >
                  {results != null && results.map((result) => (
                    <ProfileCard  result={result}/>
                  ))}
                </Grid>
              );
            }
          })()}
      </div>
    </div>
  );
}

export default App;
