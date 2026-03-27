import ThemeToggleButton from "./ThemeToggleButton";
import { useTheme } from "../contexts/ThemeContext";
import clsx from "clsx";

const ContextPage = () => {
  const { theme } = useTheme();
  const isLightMode = theme === "LIGHT";

  return (
    <div 
      className={clsx(
        "flex flex-col items-center justify-center min-h-screen w-full transition-colors duration-300",
        isLightMode ? "bg-white text-black" : "bg-gray-800 text-white"
      )}
    >
      <h1 className="text-3xl font-bold mb-8">
        현재 모드: {isLightMode ? "라이트 모드 ☀️" : "다크 모드 🌙"}
      </h1>
      <ThemeToggleButton />
    </div>
  );
};

export default ContextPage;