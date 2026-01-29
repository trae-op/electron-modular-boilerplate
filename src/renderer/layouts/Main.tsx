import { usePaletteModeSelector } from "@composites/LightDarkMode";
import { cn } from "@utils/classes";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  const mode = usePaletteModeSelector();

  const wrapperClassName = cn(
    "w-full min-h-screen overflow-x-hidden",
    mode === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900",
  );

  return (
    <div className={wrapperClassName}>
      <div className="flex flex-col mx-auto w-full min-h-screen">
        <div className="flex flex-1 justify-center items-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
