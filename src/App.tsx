import ContextPage from "./components/ContextPage";
import { ThemeProvider } from "./contexts/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <ContextPage />
    </ThemeProvider>
  );
};

export default App;