const socket = io();
const senderButton =  document.querySelector(".submit")
const liveUser = document.querySelector(".user");
let counter = document.querySelector('.users-count')
let userInput = document.querySelector(".username");


function avatarChanger(){
 currentAvatar = document.querySelector('.avatar')
 const boyAvatarSrc = '/images/boyAvatar.png';
  const girlAvatarSrc = '/images/girlAvatar.png';
 setInterval(() => {
  if (currentAvatar.src === window.location.origin + girlAvatarSrc){
    currentAvatar.src = boyAvatarSrc;
  } else{
    currentAvatar.src = girlAvatarSrc;
  }
 }, 5000);
}
avatarChanger()
function liveChatters(){
  socket.on('showusers', (userData) => {
    let container = document.querySelectorAll('.users-container')
   container.forEach((container) => {
    container.innerHTML = ''
    userData.username.forEach((user, index) => {
      let newDate = new Date(userData.joinedAt[index])
      let newTime = newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let userDiv = `<div
      class="flex items-center space-x-4 py-2 px-3 bg-white hover:bg-gray-200 rounded-lg cursor-pointer"
    >
      <div
        class="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center"
      >
        <span class="text-white font-bold text-lg">${user.charAt(0)}</span>
      </div>
      <div class="flex-1">
        <div class="font-semibold user"></div>
        <div class="text-sm id text-gray-500">${user}</div>
      </div>
      <div class="text-xs text-gray-400">${newTime}</div>
    </div>`
    
    container.innerHTML = userDiv + container.innerHTML
    })
  })
   })
    
}

function countUpdater(){
  socket.on('userscount', (data) => {
    counter.innerHTML = data
  })
}
function messageSender() {
  const textarea = document.querySelector(".message");
    senderButton.addEventListener("click", function () {
      let message = document.querySelector(".message").value;
      if(message.length > 0) {
        socket.emit("user", message);
        document.querySelector(".message").value = "";
        textarea.style.height = "20px"; 
        textarea.style.height = textarea.scrollHeight + "px"; 
      }
    });
   

textarea.addEventListener("input", function() {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});

textarea.style.height = "auto";
textarea.style.height = textarea.scrollHeight + "px";

}

function messageHandler() {
  var container = "";
  socket.on("message", (data) => {
    let currentUser = data.id === socket.id;
    let msgTime = new Date(data.timestamp);
    let formattedTime = msgTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    container = ` 
      <div class="flex ${currentUser ? "ml-auto" : "mr-auto"} items-start w-fit min-w-56 max-w-[30rem] space-x-3 mb-4 py-2">
        <div class="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-sm">${data.username.charAt(0)}</span>
        </div>
        <div class="flex-1 ${currentUser ? 'bg-[#14b8a6] rounded-l-lg rounded-br-lg' : 'bg-[#34d399] rounded-r-lg rounded-bl-lg'} p-3 break-words">
          <div class="font-semibold text-white">${data.username}</div>
          <div class="text-m text-white">${data.message}</div>
          <div class="text-xs text-gray-600 mt-1">${formattedTime}</div>
        </div>
      </div>`;
    let chatArea = document.querySelector(".container");
    chatArea.innerHTML += container;
    chatArea.scrollTop = chatArea.scrollHeight;
  });
}


function registerPage() {
  let submitBtn = document.querySelector(".userBtn");
 
  const handleSubmit = () => {
    
    document.querySelector(".overlay").classList.add("hidden");
    document.querySelector(".overlay").style.display = "none";
    document.querySelector('.message-div').style.opacity = '1'
    socket.emit("newuser", userInput.value);
    
  }
  function errorDisplay(){
    if(userInput.value.length >= 3){
      handleSubmit()
    } else{
     document.querySelector('.error-message').classList.toggle('hidden'); 
    }
  }
  submitBtn.addEventListener("click", () => {
    errorDisplay()
  });
  userInput.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
      errorDisplay()
    }
  })
  userInput.addEventListener("input", (e) => {
    let inputValue = userInput.value;
    if (inputValue.trim().length < 0) {
      inputValue.value = "";
    } else {
      newValue = inputValue.replace(" ", "_");
      userInput.value = newValue;
    }
  });

}
function inputAction() {
  document.querySelector('.message').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.shiftKey) {

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

    
      textarea.value = textarea.value.substring(0, start) + "\n" + textarea.value.substring(end);

      
      textarea.selectionStart = textarea.selectionEnd = start + 1;
  } else if(e.key === 'Enter' && !e.shiftKey){
    e.preventDefault()
    senderButton.click()
  }
  })
  
}
function toggleDropdown() {
    const dropdown = document.getElementById('dropdown');
    dropdown.classList.toggle('hidden');
  }
  
inputAction();
liveChatters()
countUpdater()
registerPage();
messageSender();
messageHandler(); 