import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import Files from "./files";
// import Test from "./redistest";

import HeadBar from "./HeadBar";

export default function App() {
	return (
		<Router>
			<HeadBar />
			<Routes>
				<Route exact path="/" element={<Files />} />
			</Routes>
		</Router>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
