const timer = document.querySelector('.timer')
const title = document.querySelector('.title')
const StartBtn = document.querySelector('.StartBtn')
const PauseBtn = document.querySelector('.PauseBtn')
const ResumeBtn = document.querySelector('.ResumeBtn')
const ResetBtn = document.querySelector('.ResetBtn')
const pomoCountsDisplay = document.querySelector('.pomoCountDisplay');

//Making variable
const WORK_TIME = 25*60;
const BREAK_TIME = 5*60;
let timerID = null;
let oneRoundCompleted = false; //one Round = work Time + Break Time
let totalcount = 0;
let paused = false;

//function to update title
const updateTitle = (msg) => {
    title.textContent = msg;
}
//function to Save pomodoro counts to local storage
const saveLocalCounts = () => {
    let counts =JSON.parse(localStorage.getItem("pomoCounts"));
    counts !== null? counts++ : counts = 1;
    localStorage.setItem("pomoCounts",JSON.stringify(counts));
}
//Function to countdown
const countDown = (time) =>{
    return () => {
        const mins = Math.floor(time/60).toString().padStart(2, '0');
        const secs = Math.floor(time % 60).toString().padStart(2, '0');
        //timer.textContent = time;
        timer.textContent = `${mins}:${secs}`;
        time--;
        if(time < 0){
            stopTimer();
            if(!oneRoundCompleted){
                timerID = startTimer(BREAK_TIME);
                oneRoundCompleted = true;
                updateTitle("It's break Time!");
            }
            else{
                updateTitle("Completed 1 Round of Pomodoro Technique!");
                setTimeout(() => updateTitle("It's work Time!"),2000);
                totalcount++;
                saveLocalCounts();
                showPomoCounts();   
            }
        }
    } 
}

//Arrow function to start timer
const startTimer = (startTime) => {
    if(timerID !== null){
        stopTimer();
    }
    return setInterval(countDown(startTime), 1000)
}

//Arrow function to stop timer
const stopTimer = () => {
    clearInterval(timerID);
    timerID = null;
}

//function to get time in seconds
const getTimeInSeconds = (timeString) => {
    const[minutes, seconds]  = timeString.split(":");
    return parseInt(minutes * 60) + parseInt(seconds) ;
}
//Adding Event Listener to start button
StartBtn.addEventListener('click', ()=>{
    timerID = startTimer(WORK_TIME);
    updateTitle("It's work Time!");
});

//Adding Event Listener to Reset button
ResetBtn.addEventListener('click', ()=>{
    stopTimer();
    timer.textContent = "25:00";
    updateTitle("click start to start timer")
});
//Adding Event Listener to pause button
PauseBtn.addEventListener('click', ()=>{
    stopTimer();
    paused = true;
    updateTitle("Timer Paused")
});
//Adding Event Listener to Resume button
ResumeBtn.addEventListener('click', ()=>{
    if(paused){
        const currentTime = getTimeInSeconds(timer.textContent);
        timerID = startTimer(currentTime);
        paused = false;
        (!oneRoundCompleted) ? updateTitle("It's Work Time") : updateTitle("It's Break Time");
    }
    
});

//function to show completed pomodoros to screen from local storage
const showPomoCounts = () => {
    const counts = JSON.parse(localStorage.getItem("pomoCounts"));
    console.log(counts);
    if(counts > 0){
        pomoCountsDisplay.style.display = "flex";
    }
    pomoCountsDisplay.firstElementChild.textContent = counts;
}

showPomoCounts();