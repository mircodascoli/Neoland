
function Login({mensaje}) {

    return(
      <>
            <form id="formLog"/>
            
                <p id="infoMessage">{mensaje}</p>
                <input  type="email" id="emailLog"placeholder="Your email" minLength="3" required/>
                <input type="password" id="passwordLog" placeholder="Your password" minLength="3" required/>
                <button type="submit" id="loginButton" title="Login">Login</button>
            <form/>
      </>
    )
}
export default Login