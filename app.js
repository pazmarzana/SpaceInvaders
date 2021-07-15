const grid = document.querySelector('.grid')
const resultDisplay = document.querySelector('#result')
let width = 15
let currentShooterIndex = 202 // 15*13+7 penultimate line in the middle
let currentInvaderIndex = 0
let invadersTakenDown = [] // saves the index number of invaders taken down (from 0 to 29)
let result = 0
let direction = 1
let invadersMoveTimeInterval  // invadersMoveTimeInterval = setInterval(moveInvaders, 500)
let goingRight = true

//create grid
for (let i = 0; i < 225; i++){
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = document.querySelectorAll('.grid div')

const invaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
    ]

function drawInvaders(){
    for (let i = 0; i < invaders.length; i++){
        //if invader i is alive
        if (!invadersTakenDown.includes(i) && invaders[i] < squares.length){
            squares[invaders[i]].classList.add('invader')
        }
    }
}

//draw the shooter
squares[currentShooterIndex].classList.add('shooter')

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key) {
    case 'ArrowLeft':
        if(currentShooterIndex % width != 0) currentShooterIndex -=1
        break
    case 'ArrowRight':
        if(currentShooterIndex % width < width - 1) currentShooterIndex +=1
        break
    }
    squares[currentShooterIndex].classList.add('shooter')
}

document.addEventListener('keydown', moveShooter)

function removeInvaders(){
    for (let i = 0; i < invaders.length; i++){
        squares[invaders[i]].classList.remove('invader')
    }
}

function moveInvaders() {
    const leftEdge = invaders[0] % width === 0 //true if some invaders are in the left edge
    const rightEdge = invaders[invaders.length-1] % width === width-1 //true if some invaders are in the right edge
    removeInvaders()
    //if invaders are in the edges switch to the following row 
    if ( rightEdge && goingRight ){
        for (let i = 0; i < invaders.length; i++){
            invaders[i] += width + 1
            direction = -1
            goingRight = false
        }
    } 
    if ( leftEdge && !goingRight ){
        for (let i = 0; i < invaders.length; i++){
            invaders[i] += width - 1
            direction = 1
            goingRight = true
        }
    }
    //all of them move one 
    for (let i = 0; i < invaders.length; i++){
        invaders[i] += direction
    }
    
    drawInvaders()
    //decide a game over
    if(squares[currentShooterIndex].classList.contains('invader', 'shooter')){
        resultDisplay.textContent = 'Game Over'
        alert('Game Over - Invaders killed you')
        clearInterval(invadersMoveTimeInterval)
    }

    if(invaders[invaders.length-1] > (squares.length - 1 - width)) {
        resultDisplay.textContent = 'Game Over'
        alert('Game Over - Invaders took the world')
        clearInterval(invadersMoveTimeInterval)
    }
    //decide a win
    if(invadersTakenDown.length === invaders.length){
        resultDisplay.textContent = 'YOU WIN!'
        alert('YOU WIN!')
        clearInterval(invadersMoveTimeInterval)
    }
} //ends function moveInvaders

invadersMoveTimeInterval = setInterval(moveInvaders, 500)

function shoot(e) {
    let laserTimeInterval
    let currentLaserIndex = currentShooterIndex
    //move the laser from shooter to invader
    function moveLaser(){
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')

        if (squares[currentLaserIndex].classList.contains('invader')){
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.add('boom')

            setTimeout( () => squares[currentLaserIndex].classList.remove('boom'), 250)
            clearInterval(laserTimeInterval)

            const alienTakenDown = invaders.indexOf(currentLaserIndex)
            invadersTakenDown.push(alienTakenDown)
            result++
            resultDisplay.textContent = result
        }
        //if laser goes outside grid
        if (currentLaserIndex < width){
            clearInterval(laserTimeInterval)
            setTimeout( () => squares[currentLaserIndex].classList.remove('laser'), 100)
        }
    }
    if (e.key === 'ArrowUp'){
        laserTimeInterval = setInterval(moveLaser, 100)
    }
}
document.addEventListener('keydown', shoot)