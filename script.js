let currentmusic = new Audio()
let songs
let currfolder
let cardcontainer=document.getElementsByClassName("card-container")[0]
let currlist
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs(folder) {
    let a = await fetch(`/${folder}/`)
    // console.log(folder.split("/")[1])
    document.getElementsByClassName("songheading")[0].innerHTML=folder.split("/")[1]
    currfolder=folder
    let response = await a.text()
    div = document.createElement("div")
    div.innerHTML = response
    // console.log(response)
    let as = div.getElementsByTagName("a")
    // console.log(as)
    songs = []
    for (let i = 0; i < as.length; i++) {
        element = as[i]
        if (element.href.endsWith(".mp3")) {
            // console.log(element.href.split(`/${currfolder}/`)[1])
            songs.push(element.href.split(`/${currfolder}/`)[1])
        }
    }
    // console.log(song)
    let s = document.getElementsByClassName("songlist")[0].getElementsByTagName("ul")[0]
    s.innerHTML=""
    for (const song of songs) {
        s.innerHTML = s.innerHTML + `<li>
        <img class="invert" src="logos/music.svg" alt="">
        <div class="info">
            <div class="name">${song.replaceAll("(PaglaSongs)", "")}</div>
        </div>
        
        <div class="playmusic">
            <span>play music</span>
            <img class="invert" src="logos/play.svg" alt="">
        </div>
         </li>`
    }
    Array.from(document.getElementsByClassName("songlist")[0].getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {
            
            // console.log(e.getElementsByClassName("info")[0].firstElementChild.innerHTML)
            currlist=e
            console.log(currlist)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })

    })
    // currlist
    // return songs
}

async function displayalbums(){
    let a = await fetch(`/song/`)
    // currfolder=folder
    let response = await a.text()
    div = document.createElement("div")
    div.innerHTML = response
    let anchor=div.getElementsByTagName("a")
    // console.log(anchor)
    // let folder=[]
    let array=Array.from(anchor)
    for(let i=0;i<array.length;i++){
        let e=array[i]
        if(e.href.includes("/song") && !e.href.includes(".htaccess")){
            // console.log(e.href.split("/").slice(-2)[0])
            let folder=decodeURI(e.href.split("/").slice(-2)[0])
            // console.log(decodeURI(folder))
            let a = await fetch(`/song/${folder}/info.json`)
            let response= await a.json()
            cardcontainer.innerHTML=cardcontainer.innerHTML+`<div class="card rounds" data-folder="${folder}">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="46px" height="100px" color="#000000" fill="black">
                    <!-- Circle background -->
                    <circle cx="12" cy="12" r="11" fill="#328e32" />
                    <!-- Original path -->
                    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" fill="black" />
                </svg>
                
                
            </div>
            <img src="/song/${folder}/image.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`

        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click",async (item) => {
            // console.log(item.currentTarget.dataset.folder)
        await getsongs(`song/${item.currentTarget.dataset.folder}`)
        playMusic(songs[0])
        })
    });
}
const playMusic = (track,flag=false) => {
    currentmusic.src = `/${currfolder}/` + track
    if(!flag){
        currentmusic.play()
        document.getElementsByClassName("plays")[0].src = "logos/pause.svg"
    }
    
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songduration").innerHTML = "0:0/0:0"
    // if((currentmusic.currentTime) == (currentmusic.duration)){
    //     document.getElementsByClassName("plays")[0].src = "play.svg"
    // }
    // document.getElementsByClassName("playmusic")[0].src="pause.svg"
    
}

async function main() {
    await getsongs("song/Trending")
    playMusic(songs[0],true)
    // console.log(songs)
    displayalbums()
    document.getElementsByClassName("plays")[0].addEventListener("click", () => {
        if (currentmusic.paused) {
            currentmusic.play()
            document.getElementsByClassName("plays")[0].src = "logos/pause.svg"
            // document.getElementsByClassName("playmusic")[0].src="pause.svg"
        }
        else {
            currentmusic.pause()
            document.getElementsByClassName("plays")[0].src = "logos/play.svg"
            // document.getElementsByClassNme("playmusic")[0].src="play.svg"
        }
    })
    currentmusic.addEventListener("timeupdate", () => {
        // console.log(currentmusic.currentTime,currentmusic.duration)
        document.querySelector(".songduration").innerHTML = `${secondsToMinutesSeconds(currentmusic.currentTime)}/${secondsToMinutesSeconds(currentmusic.duration)}`
        document.querySelector(".circle").style.left=((currentmusic.currentTime)/(currentmusic.duration))*100+"%"
    })
    document.querySelector(".seekbar").addEventListener("click",e => {
        // console.log(e.target.getBoundingClientRect().width,e.offsetX)
        let p=((e.offsetX)/(e.target.getBoundingClientRect().width))*100
        document.querySelector(".circle").style.left=((e.offsetX)/(e.target.getBoundingClientRect().width))*100+"%"
        currentmusic.currentTime=((currentmusic.duration)*p)/100
    })
    document.querySelector(".hamburger").addEventListener("click",() => {
        document.querySelector(".left").style.left=0+"%"
    })
    document.querySelector(".closetag").addEventListener("click",() => {
        document.querySelector(".left").style.left="-120%"
    })
    document.querySelector(".prev").addEventListener("click",() => {
        currentmusic.pause()
        // console.log(currentmusic.src)
        // console.log(currentmusic.src.split)
        // console.log(currentmusic.src.split("/").slice)
        // console.log(currentmusic.src.split("/").slice(-1)[0])
        let index=songs.indexOf(currentmusic.src.split("/").slice(-1)[0])
        // console.log(songs)
        // console.log("previous",index)
        if((index-1) >= 0){
            playMusic(songs[index-1])
        }
        else{
            playMusic(songs[songs.length - 1])
        }
    })
    document.querySelector(".next").addEventListener("click",() => {
        currentmusic.pause()
        // console.log(currentmusic.src)
        // console.log(currentmusic.src.split)
        // console.log(currentmusic.src.split("/").slice)
        // console.log(currentmusic.src.split("/").slice(-1)[0])
        let index=songs.indexOf(currentmusic.src.split("/").slice(-1)[0])
        // console.log(songs)
        // console.log("next",index)
        if((index+1) < songs.length){
            playMusic(songs[index+1].trim())
        }
        else{
            playMusic(songs[0])
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e) => {
        // console.log(e,e.target)
        currentmusic.volume=parseInt(e.target.value)/100
        if(currentmusic.volume==0){
            document.querySelector(".volume>img").src="logos/mute.svg"
        }
        else{
            document.querySelector(".volume>img").src="logos/volume.svg"
        }
    })
    document.querySelector(".volume>img").addEventListener("click",(e) => {
        if(e.target.src.includes("logos/volume.svg")){
            e.target.src = e.target.src.replace("logos/volume.svg", "logos/mute.svg")
            currentmusic.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("logos/mute.svg", "logos/volume.svg")
            currentmusic.volume = .60;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 60;
        }

    })
    
}
main()
