const socket = io()
let name;
let textarea=document.querySelector('#textarea')
let messageArea=document.querySelector('.message_area')
let x=document.getElementById("audio");




do{
    name=prompt('please enter your name:')
}while(!name)

socket.emit('new-user-joined',name)

socket.on('user-joined',name=>{
    
    
    let mainDiv =document.createElement('div')
    
    mainDiv.classList.add('incoming','message')

    let markup=`
    <h4>${name}</h4>
    <p><h3>${name}</h3>joined the chat</p>
    `
    mainDiv.innerHTML=markup
    messageArea.appendChild(mainDiv)
    
   
    scrollToBottom()
    
})

textarea.addEventListener('keyup',(e)=>{
    if(e.key==='Enter'){
        sendMessage(e.target.value)
    }
})

function sendMessage(message){
    let msg={
        user: name,
        message:message.trim()
    }
//Append
    appendMessage(msg,'outgoing')
    
    textarea.value=''
    scrollToBottom()
    // send to server
    socket.emit('message',msg)
    
    

      
}



function appendMessage(msg, type){
    if(type==='incoming'){
        x.play()
    }
    
    
    let mainDiv =document.createElement('div')
    let className=type
    mainDiv.classList.add(className,'message')

    let markup=`
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `
    mainDiv.innerHTML=markup
    messageArea.appendChild(mainDiv)
    
   
}

//Recieve

socket.on('message',(msg)=>{
    appendMessage(msg,'incoming')
    
  
    scrollToBottom()
   
    
})


function scrollToBottom(){
    messageArea.scrollTop=messageArea.scrollHeight
}

socket.on('left',msg=>{
    // console.log(msg)
    let mainDiv =document.createElement('div')
    
    mainDiv.classList.add('incoming','message')

    let markup=`
    <h4>${msg}</h4>
    <p><h3>${msg}</h3>left the chat</p>
    `
    mainDiv.innerHTML=markup
    messageArea.appendChild(mainDiv)
    x.play()
   
    scrollToBottom()
})