document.addEventListener('DOMContentLoaded',()=>{
    let socket = io('/');

    socket.emit('registerUser')

    var options = {
        maximumAge: 0
      };
      setInterval(()=>{
        navigator.geolocation.getCurrentPosition((pos)=>{
            const { latitude : lat , longitude :lng  }  = pos.coords ; 
            console.log('lat->',lat);
            console.log('long->',lng);
            socket.emit('updateLocationOfUser',{lat,lng});
        },(error)=>{
                console.log("error--->",error);
          },options)
      },2500)
})