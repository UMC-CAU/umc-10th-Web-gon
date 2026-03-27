import { useTheme } from "../contexts/ThemeContext";
import clsx from "clsx";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  
  const isLightMode = theme === "LIGHT";

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "px-4 py-2 mt-4 rounded-md transition-all duration-300 font-bold",
        isLightMode 
          ? "bg-black text-white" 
          : "bg-white text-black"
      )}
    >
      {isLightMode ? "다크 모드로 전환 🌙" : "라이트 모드로 전환 ☀️"}
    </button>
  );
};

export default ThemeToggleButton;