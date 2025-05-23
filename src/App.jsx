import "./App.css";

import Router from "./Router";

export default function App() {
  console.log("App is rendering");

  return (
    <div className="App min-h-screen w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 bg-fixed">
      <Router />
    </div>
  );
}
