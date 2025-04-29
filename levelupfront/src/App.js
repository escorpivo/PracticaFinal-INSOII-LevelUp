
import './App.css';
import CardsHolder from './Components/UI_CardsHolder';
import TopNav from "./Components/UI_TopNav";
import Sidebar from "./Components/UI_Sidebar";

import { Box } from "@mui/material";


function App() {
  return (
    <div className="App">
      <Box display="flex" flexDirection="column" height="100vh">
            <TopNav />
            <Box display="flex" flexGrow={1}>
                <Sidebar />
                <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                    <CardsHolder />
                </Box>
            </Box>
        </Box>
    </div>
  );
}

export default App;
