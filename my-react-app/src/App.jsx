import './App.css'
import Sign from './Sign/Sign.jsx'
import Login from './Login/Login.jsx'
function App() {
const mensaje = "registrarse"
  return (
    <>
     
      <Sign mensaje={mensaje}/>
      <Login mensaje={mensaje}/>

    </>
  )
}

export default App
