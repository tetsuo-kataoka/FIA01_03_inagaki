import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { Theme } from "./user/Theme";
import { Admin } from "./admin/Admin";
import { User } from "./user/User";
import { Questions } from "./user/Questions";
import { Answer } from "./user/Answer";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div class="wrapper">
          <section id="mainbg">
            <div class="main-image">
              <div class="main-image__text">
                <p class="main-image__text_first">Develop your perspective</p>
                <p class="main-image__text_second">
                  指針を見つけよう！
                </p>
              </div>
            </div>
          </section>

          <section id="contents">
            <div class="contents-wrapper">
              <Routes>
                {/* exactをつけると完全一致になります。Homeはexactをつけてあげます */}
                <Route exact path="/" element={<Theme />}/>
                <Route path="/admin" element={<Admin />}/>
                <Route path="/user" element={<User />}/>
                <Route path="/questions/:id" element={<Questions />}/>
                <Route path="/answer/:id" element={<Answer />}/>
              </Routes>
            </div>
          </section>

          <footer class="footer">
            <small class="copyrights">
              <Link to="/admin">Admin</Link><br/>
              copyrights 2022 Future All RIghts Reserved.
            </small>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
