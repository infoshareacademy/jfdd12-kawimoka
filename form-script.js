
var info = document.getElementById('form-info');
var title = document.getElementById('form-title');
var formName = document.getElementById('form-name');
var formEmail = document.getElementById('form-email');


var getSubmitButton= document.getElementsByClassName('form-button');
var submitButton = getSubmitButton[0]

var getTitleAfterSubmit = document.getElementsByClassName('form-afterSubmit-title');
var titleAfterSubmit = getTitleAfterSubmit[0]

var getp1AfterSubmit = document.getElementsByClassName('form-afterSubmit-p1');
var p1AfterSubmit = getp1AfterSubmit[0]

var getp2AfterSubmit = document.getElementsByClassName('form-afterSubmit-p2');
var p2AfterSubmit = getp2AfterSubmit[0]

var getAfterSubmitButton= document.getElementsByClassName('form-afterSubmit-button');
var afterSubmitButton = getAfterSubmitButton[0]


var emailFromStorage = localStorage.getItem("email")

console.log(emailFromStorage)
if (emailFromStorage){
  switchOffForm()
  switchOnNewForm()
  //console.log("jest")
}


submitButton.addEventListener('click', function(event){  

  event.preventDefault()
  var email = document.getElementById('email').value
  //console.log(email)
  if(validateEmail(email)===true){
  //console.log("ok")
    localStorage.setItem("email",email)
    switchOffForm()
    switchOnNewForm()
  }else{
    alert("This is not an email!")
    console.log("mail nie ok")

  }

  
})


function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function switchOffForm(){ 
  title.style.display="none" 
  submitButton.style.display="none"
  info.style.display="none"
  formEmail.style.display="none"
  formName.style.display="none" 
}
    
function switchOnNewForm(){  
  titleAfterSubmit.style.display="block"   
  p1AfterSubmit.style.display="block" 
  p2AfterSubmit.style.display="block"
  afterSubmitButton.style.display="block"
}

afterSubmitButton.addEventListener('click', function(){
  "Game/index.html"
   var lastSlash = window.location.href.lastIndexOf('/')
   var partWithoutSlasah = window.location.href.slice(0, lastSlash)
   window.location.href = partWithoutSlasah.concat('/Game/index.html')
})