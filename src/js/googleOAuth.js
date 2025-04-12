// @ts-no-check
window.handleGoogleLogin = handleGoogleLogin

function handleGoogleLogin(response){
    let jwt = response.credential;
    console.log('JWT: ', jwt);
    // el payload del token viene en base64,hay que decodificarlo
    let payload = JSON.parse(atob(jwt.split('.')[1]));
    console.log('PAYLOAD: ', payload);

   /*  let user = {
        _id: payload.sub,
        name: payload.name,
        email: payload.email,
        rol: payload.rol,
        token: jwt
    } */


       
    }
