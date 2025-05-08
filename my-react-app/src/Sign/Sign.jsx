import { useState } from 'react'
function ListaElementos({lista}) {
    return (
      <ul>
        {lista.map(item =><ElementoLista valor={item} key={item}/>)}
        
      </ul>
    )
  }

  function ListaUsuarios({lista}) {
 
     if (lista.length === 0) {
    return <p>No hay usuarios</p>
  }
  return (
    <ul>
      {lista.map((item, index) => <UsuarioLista name={item.name} email={item.email} key={index} />)}
    </ul>
  )
  
  }


function ElementoLista({valor}) {
    return (
      <li>Elemento de la lista{valor}</li>
    )
  }
function UsuarioLista({name, email}) {
    return (
      <li>Usuario: {name} - Email: {email}</li>
    )
}
function Sign({mensaje}) {
  const lista = ['uno', 'dos', 'tres', 'cuatro', 'cinco'];
  const [listaUsuarios, setListaUsuarios] = useState([])
  const [loginAttempts, setLoginAttempts] = useState(0)

    return(
      <>
      <p>{mensaje}</p>
             <form id="signInForm" onSubmit={_onSubmit}>
        <p id="infoMessage">LOGIN ATTEMPTS: {loginAttempts}</p>
        <input
          type="text"
          id="name"
          placeholder="Nombre de usuario"
          required />
        <input
          type="email"
          id="email"
          placeholder="Email"
          required />
        <button type="submit">Sign In</button>
      </form>
            <ListaUsuarios lista={listaUsuarios} />
            <ListaElementos lista={lista} />
      </>
    )
    function _onSubmit(e) {
      e.preventDefault()
      const name = e.target.name.value
      const email = e.target.email.value
      setListaUsuarios([...listaUsuarios, { name, email }])
      setLoginAttempts(loginAttempts + 1)
    }
  }

export default Sign