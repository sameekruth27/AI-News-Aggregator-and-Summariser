import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Summary } from "./components/About";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

function App() {
  axios.post("https://minorproject-alpha.vercel.app/")
  return (
    <div className="App">
      <NavBar />
      <Banner />
      <Summary />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
