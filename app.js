
///////////////////////////// PREVENT ZOOM ON DOUBLE TAP TOUCH SCREEN ///////////////////////
document.querySelector('body').addEventListener('dblclick', function(el) {
    el.preventDefault();
});


/////////////////////////////////// user's email and question list ////////////////////////////////////
let userEmail=null;
let questions=[ //-------->Default questions without a user account
    "Tell me about yourself",
    "What are your biggest weaknesses?",
    "What are your biggest strengths?",
    "What sets you apart from other candidates?",
    "How did you learn about the opening?",
    "Why do you want this job?"
];
let shuffled=[]
function shuffle(){
    shuffled=[...questions]
    if (shuffled.length>2){
        for(let i=1;i<shuffled.length;i++){
            let swap_index=Math.floor(Math.random()*(shuffled.length-2))+1;
            let holder=shuffled[swap_index]
            shuffled[swap_index]=shuffled[i]
            shuffled[i]=holder
        }
    }
}



/////////////////////////////// DISPLAY DEFAULT QUESTION ////////////////////////////////////
function listDisplay(my_questions){
    for(let i=1;i<my_questions.length;i++){
        let new_question=my_questions[i]
        let question_list=document.getElementById("question_list")
        let cur_slot=document.createElement("div")
            cur_slot.className="slot"
            cur_slot.id="deletable"
        let cur_row=document.createElement("div")
            cur_row.className="row"
        let cur_question=document.createElement("div")
            cur_question.className="question"
            cur_question.appendChild(document.createTextNode(new_question))
        let cur_delete=document.createElement("img")
            cur_delete.src="delete.png"
            cur_delete.className="delete"
            cur_delete.addEventListener('click',function(){//------------->DELETE QUESTION
                cur_slot.remove()
                for (let j=0; j<my_questions.length; j++){
                    if(new_question==my_questions[j]){
                        my_questions.splice(j,1)
                        break
                    }
                }
                if(userEmail!=null){//only add to server when user is logged in
                    //setup server-client communication
                        let communication=new XMLHttpRequest();
                    //send login request
                        communication.open('POST','http://localhost:3000/remove_'+userEmail+"~"+new_question.replace(/ /g,'~'));
                        communication.send();
                }
            })
        cur_slot.appendChild(cur_row)
        cur_row.appendChild(cur_question)
        cur_row.appendChild(cur_delete)
        question_list.appendChild(cur_slot)
    }
}
listDisplay(questions)

//////////////////////////////// CLEAR QUESTION LIST ///////////////////////////////////////
function clearListDisplay(){
    display_questions=document.getElementsByClassName("slot");
    for(let i=0; i<display_questions.length; i++){
        let cur_question=display_questions[i]
        if(cur_question.id=='deletable'){
            cur_question.remove()
            i-=1
        }
    }
}



//////////////////////////////// CONVERT TEXT TO SPEECH /////////////////////////////////////
let cur_speech=new SpeechSynthesisUtterance();
function textToSpeech(input){
    cur_speech.volume=1 //0 to 1
    cur_speech.rate=1 //0.1 to 10
    cur_speech.pitch=1 //0 to 2
    cur_speech.text=input
    cur_speech.voiceURI="Mark"
    cur_speech.lang="en-US"
    speechSynthesis.speak(cur_speech)
}




////////////////////////////////////// ADD QUESTION /////////////////////////////////////////
document.getElementById('add').addEventListener('click',function(){
    let new_question=document.getElementById("new_question").value.trim()
    if(new_question=="")return
    
    for(let i=0; i<questions.length; i++){
        if(questions[i]==new_question){
            document.getElementById("new_question").value=""
            return
        }
    }
    
    if(userEmail!=null){//only add to server when user is logged in
        //setup server-client communication
            let communication=new XMLHttpRequest();
        //send login request
            communication.open('POST','http://localhost:3000/add_'+userEmail+"~"+new_question.replace(/ /g,'~'));
            communication.send();
    }

    let question_list=document.getElementById("question_list")
    let cur_slot=document.createElement("div")
        cur_slot.className="slot"
        cur_slot.id="deletable"
    let cur_row=document.createElement("div")
        cur_row.className="row"
    let cur_question=document.createElement("div")
        cur_question.className="question"
        cur_question.appendChild(document.createTextNode(new_question))
    let cur_delete=document.createElement("img")
        cur_delete.src="delete.png"
        cur_delete.className="delete"
        cur_delete.addEventListener('click',function(){//------------->DELETE QUESTION
            cur_slot.remove()
            for (let i=0; i<questions.length; i++){
                if(new_question==questions[i]){
                    questions.splice(i,1)
                    break
                }
            }
            if(userEmail!=null){//only add to server when user is logged in
                //setup server-client communication
                    let communication=new XMLHttpRequest();
                //send login request
                    communication.open('POST','http://localhost:3000/remove_'+userEmail+"~"+new_question.replace(/ /g,'~'));
                    communication.send();
            }
        })
    cur_slot.appendChild(cur_row)
    cur_row.appendChild(cur_question)
    cur_row.appendChild(cur_delete)
    question_list.appendChild(cur_slot)
    questions.push(new_question)

    
    document.getElementById("new_question").value=""
})
document.getElementById('new_question').addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        document.getElementById('add').click(); //if ENTER is pressed inside input box --> add the question
    }
});




///////////////////////////////// START AN INTERVIEW TRIAL /////////////////////////////////////////
let cur_index=0
let block_end=false //user will not be able to logo-cancel the interview session when there is a count down
document.getElementById('start').addEventListener('click',function(){
    textToSpeech("") //this is to fix first question muted on Safari iOS
    block_end=true 
    document.getElementById('pre_practice').style.display = "none"
    document.getElementById('about').style.display = "none"
    document.getElementById('account').style.display = "none"
    document.getElementById('get_ready').style.display = "initial"
    document.getElementById('count_down').innerHTML=3
    document.getElementById("new_question").value=""
    shuffle()
    for(let i=2;i>=1;i--){
        setTimeout(function(){
            document.getElementById('count_down').innerHTML=i
        },(2-i)*1000+1000)
    }
    setTimeout(function(){
        document.getElementById('get_ready').style.display = "none"
        document.getElementById('practice').style.display = "flex";
        document.getElementById('cur_question').innerHTML = shuffled[0];
        textToSpeech(shuffled[0])
        if(cur_index==shuffled.length-1){
            document.getElementById('next').style.opacity = "0.6";
        }else{
            document.getElementById('next').style.opacity = "1";
        }
        if(cur_index==0){
            document.getElementById('prev').style.opacity = "0.6";
        }
        block_end=false 
    },3000)
})




///////////////////////////////// END AN INTERVIEW TRIAL /////////////////////////////////////////
document.getElementById('end').addEventListener('click',function(){
    speechSynthesis.cancel() 
    document.getElementById('pre_practice').style.display = "flex";
    document.getElementById('practice').style.display = "none";
    document.getElementById('about').style.display = "initial"
    document.getElementById('account').style.display = "initial"
    cur_index=0
})
document.getElementById('logo').addEventListener('click',function(){
    if(!block_end){ //user will not be able to logo-cancel the interview session when there is a count down
        speechSynthesis.cancel()
        document.getElementById('pre_practice').style.display = "flex";
        document.getElementById('practice').style.display = "none";
        document.getElementById('about').style.display = "initial"
        document.getElementById('account').style.display = "initial"
        document.getElementById('about_page').style.display = "none"
        document.getElementById('account_page').style.display = "none"
        cur_index=0
    }
})
window.addEventListener('beforeunload', function () {
    speechSynthesis.cancel()
});




//////////////////////////// JUMP TO NEXT OR PREVIOUS QUESTION ///////////////////////////////////   
document.getElementById('next').addEventListener('click',function(){
    if(cur_index==shuffled.length-1)return
    speechSynthesis.cancel()
    cur_index++
    if(cur_index==shuffled.length-1){ //if we are at the end of list --> disable NEXT button
        document.getElementById('next').style.opacity = "0.6";
    }
    document.getElementById('cur_question').innerHTML = shuffled[cur_index];
    textToSpeech(shuffled[cur_index])
    document.getElementById('prev').style.opacity = "1";
})
document.getElementById('prev').addEventListener('click',function(){
    if(cur_index==0)return
    speechSynthesis.cancel()
    cur_index--
    if(cur_index==0){ //if we are at the start of list --> disable PREV button
        document.getElementById('prev').style.opacity = "0.6";
    }
    document.getElementById('cur_question').innerHTML = shuffled[cur_index];
    textToSpeech(shuffled[cur_index])
    document.getElementById('next').style.opacity = "1";
})




///////////////////////////////// ABOUT PAGE AND ACCOUNT PAGE ////////////////////////////////////
document.getElementById('about').addEventListener('click',function(){
    document.getElementById('practice').style.display = "none"
    document.getElementById('pre_practice').style.display = "none"
    document.getElementById('account_page').style.display = "none"
    document.getElementById('about_page').style.display = "flex"
    document.getElementById("new_question").value=""
})
document.getElementById('account').addEventListener('click',function(){
    document.getElementById('practice').style.display = "none"
    document.getElementById('pre_practice').style.display = "none"
    document.getElementById('account_page').style.display = "flex"
    document.getElementById('about_page').style.display = "none"
    document.getElementById("new_question").value=""
})

////////////////////////////////////// LOGIN HANDLER ////////////////////////////////////////////
document.getElementById('login_cancel').addEventListener('click',function(){
    document.getElementById('practice').style.display = "none"
    document.getElementById('pre_practice').style.display = "flex"
    document.getElementById('account_page').style.display = "none"
    document.getElementById('about_page').style.display = "none"
    document.getElementById("new_question").value=""
})

function onSignIn(googleUser){
    //setup server-client communication
        let communication=new XMLHttpRequest();
    //send login request
        userEmail=googleUser.getBasicProfile().getEmail()
        communication.open('GET','http://localhost:3000/user_'+userEmail);
        communication.send();
    //receive login status from server
        communication.onload=()=>{
            questions=JSON.parse(communication.response)
            clearListDisplay()
            listDisplay(questions)
        };
    //switch login vs logout
        document.getElementById('signout_button').style.display = "initial"
        document.getElementById('signin_button').style.display="none"
        document.getElementById('profile_pic').src=googleUser.getBasicProfile().getImageUrl();
        document.getElementById('profile_pic').style.display="flex"
        document.getElementById('login_logo').style.display="none"
        
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        userEmail=null
        console.log('User signed out.');
        document.getElementById('signout_button').style.display = "none"
        document.getElementById('signin_button').style.display="initial"
        questions=[ //-------->Default questions without a user account
            "Tell me about yourself",
            "What are your biggest weaknesses?",
            "What are your biggest strengths?",
            "What sets you apart from other candidates?",
            "How did you learn about the opening?",
            "Why do you want this job?"
        ];
        clearListDisplay()
        listDisplay(questions)
        document.getElementById('profile_pic').style.display="none"
        document.getElementById('login_logo').style.display="flex"
    });
}
