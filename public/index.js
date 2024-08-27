
window.onload = () => {
    const app = document.getElementById('app');
    //create items
    const catImage = document.getElementById('cat-image')
    const scoreDisplay = document.getElementById('score-display')
    const commentList = document.getElementById('comment-list')
    const newCatButton = document.getElementById('new-cat-button')
    const upvoteButton = document.getElementById('upvote-button')
    const meowSound = new Audio('../sounds/meow.mp3');
    const hissSound = new Audio('../sounds/hiss.mp3');
    const funkSound = new Audio('../sounds/funk.mp3');
    
    
    const downvoteButton = document.getElementById('downvote-button')
    const commentButton = document.getElementById('comment-button')
    const commentInput = document.getElementById('comment-input')
    let score = 0;
     
    // Function to save state to localStorage
    const saveStateToLocalStorage = () => {
        //create a json object for the current state
        const state = {
            imageUrl: catImage.src,
            score,
            comments: Array.from(commentList.children).map(comment => comment.innerText)
        };
        //save to localstorage
        localStorage.setItem('catstagramState', JSON.stringify(state));
    };

    // Function to load state from localStorage
    const loadStateFromLocalStorage = () => {
        const state = JSON.parse(localStorage.getItem('catstagramState'));
        if (state) {
            catImage.src = state.imageUrl;
            // score = state.score;
            scoreDisplay.innerText = `Popularity Score: ${state.score}`;
            state.comments.forEach(commentText => {
                const commentItem = document.createElement('li');
                commentItem.innerText = commentText;
                commentList.appendChild(commentItem);
            });
        } else {
            fetchCatImage();
        }
    };

     //create fetch for cat API
     const fetchCatImage = () => {
        catImage.classList.add('rotate');
        fetch('https://api.thecatapi.com/v1/images/search')
            .then(response => response.json())
            .then(data => {
                catImage.src = data[0].url;
                console.log(data)
                score = 0;
                commentList.innerHTML = '';
                scoreDisplay.innerText = `Popularity Score: ${score}`
                funkSound.play();
                setTimeout(()=> {
                    catImage.classList.remove('rotate')
                }, 3000);
                saveStateToLocalStorage();
            })
            .catch(error => console.error("we made a boo boo", error))
    }

    
    loadStateFromLocalStorage();

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Event Listeners~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


 

    //event listener for clicking newCatButton
    newCatButton.addEventListener('click', fetchCatImage);

    //upvote/downvote event listener
    upvoteButton.addEventListener('click', () => {
        //animation
        score++;
        scoreDisplay.innerText = `Popularity Score: ${score}`;
        meowSound.play();
        saveStateToLocalStorage();
    })

    downvoteButton.addEventListener('click', () => {
        if(score > 0){
            score--;
            scoreDisplay.innerText = `Popularity Score: ${score}`
            hissSound.play();
            saveStateToLocalStorage();
        }
    })

    //new comment event listener
    commentButton.addEventListener('click', () => {
        const commentText = commentInput.value;
        if(commentText) {
            const newComment = document.createElement('li');
            newComment.className = 'comment'
            newComment.innerText = commentText;
            commentList.appendChild(newComment);
            commentInput.value = '';
            saveStateToLocalStorage();
        }
    })  
}