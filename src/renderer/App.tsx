import { LoadingSpinner } from "@components/LoadingSpinner";
import { ProviderLightDarkMode } from "@composites/LightDarkMode";
import { PrivateRoute, PublicRoute } from "@composites/Routes";
import { ProviderAuth } from "@conceptions/Auth";
import { MainLayout } from "@layouts/Main";
import { Suspense, lazy } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

const LazyHomeWindow = lazy(() => import("./windows/home/Home"));
const LazyUpdaterWindow = lazy(() => import("./windows/updater/Updater"));
const LazyLogInWindow = lazy(() => import("./windows/logIn/LogIn"));

export const App = () => {
  return (
    <ProviderAuth>
      <ProviderLightDarkMode>
        <HashRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route element={<PublicRoute />}>
                  <Route path="/sign-in" element={<LazyLogInWindow />} />
                </Route>
                <Route element={<PrivateRoute />}>
                  <Route path="/window:main" element={<LazyHomeWindow />} />
                </Route>

                <Route
                  path="/window:update-app"
                  element={<LazyUpdaterWindow />}
                />
              </Route>
            </Routes>
          </Suspense>
        </HashRouter>
      </ProviderLightDarkMode>
    </ProviderAuth>
  );
};
