import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.scss";
import RoomsPage from "./pages/RoomsPage";
import RoomPage from "./pages/RoomPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import WelcomePage from "./pages/WelcomePage";
import AppLayout from "./components/layouts/AppLayout";

function App() {
  return (
    <div className="app">
      <Router>
        <AppLayout>
          <Switch>
            <Route exact path="/welcome">
              <WelcomePage />
            </Route>

            <Route exact path="/auth">
              <AuthPage />
            </Route>

            <Route exact path="/profiles/:username">
              <ProfilePage />
            </Route>

            <Route exact path="/room">
              <RoomPage />
            </Route>

            <Route path="/">
              <RoomsPage />
            </Route>
          </Switch>
        </AppLayout>
      </Router>
    </div>
  );
}

export default App;
