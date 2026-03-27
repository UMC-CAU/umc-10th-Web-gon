import { createContext, useState, useContext, type ReactNode } from "react";

type Theme = "LIGHT" | "DARK";

interface IThemeContext {
  theme: Theme;                
  toggleTheme: () => void;      
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {

  const [theme, setTheme] = useState<Theme>("LIGHT");

 
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "LIGHT" ? "DARK" : "LIGHT"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme은 무조건 ThemeProvider 우산 안에서 써야 합니다!");
  }
  return context;
};