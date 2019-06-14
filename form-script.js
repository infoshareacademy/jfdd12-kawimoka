'use strict';
var info = document.getElementById('form-info');
var title = document.getElementById('form-title');
var name2 = document.querySelector('#abc');
var email = document.getElementById('form-email');

var getSubmitButton= document.getElementsByClassName('form-button');
var submitButton = getSubmitButton[0]






submitButton.addEventListener('click', function(){  
  changeForm()
  })
    

function changeForm(){ 
  //console.log(title)
  title.style.display="none" 

  console.log(name)
  //name.style.display="none" 

  console.log(email)
  //email.style.display="none"
  
  //console.log(submitButton[0])
  submitButton.style.display="none"
  
  //console.log(info)
  info.style.display="none"
}

    
    




