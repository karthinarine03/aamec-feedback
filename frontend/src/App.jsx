import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import RegisterStudent from './components/RegisterStudent'
import SubmitReview from './components/SubmitReview'
import { Toaster, toast } from 'react-hot-toast'
import SubjectsList from './components/SubjectsList'

import Onestaffreview from './components/Onestaffreview'
import Header from './layout/Header'
import Footer from './layout/Footer'
import AdminSubjectEditor from "./components/AdminSubjectEditor"
function App() {

  return(
    <Router>
      <div>
        <Header/>
        <Toaster/>

        <main className="background">
        <div className='container '>
          <div className='row'>
            <Routes>
              <Route path='/'element={<RegisterStudent/>}/>
              <Route path='/submitReview/:id'element={<SubmitReview/>}/>
              <Route path='/subjectList/:id'element={<SubjectsList/>}/>
        
              <Route path="/onestaff-reviews" element={<Onestaffreview />} />
              <Route path="/admin" element={<AdminSubjectEditor />} />
            </Routes>
          </div>
        </div>

        </main>
        <Footer/>
      </div>
    </Router>
  )
}

export default App
