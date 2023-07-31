document.addEventListener('DOMContentLoaded', function(){

    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    const upvoteButtons = document.querySelectorAll('.upvote-btn');
    const downvoteButtons = document.querySelectorAll('.downvote-btn');
  
    for(var i=0; i<allButtons.length; i++) {
      allButtons[i].addEventListener('click', function() {
        searchBar.style.visibility = 'visible';
        searchBar.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
        searchInput.focus();
      });
    }
  
    searchClose.addEventListener('click', function() {
      searchBar.style.visibility = 'hidden';
      searchBar.classList.remove('open');
      this.setAttribute('aria-expanded', 'false');
    });
  
    upvoteButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const postId = button.dataset.postid;
        const response = await fetch(`/post/${postId}/upvote`, { method: 'POST' });
        if (response.ok) {
          const data = await response.json();
          const upvoteCount = data.upvotes;
          updateVoteCountUp(button, upvoteCount);
        }
      });
    });
  
    downvoteButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const postId = button.dataset.postid;
        const response = await fetch(`/post/${postId}/downvote`, { method: 'POST' });
        if (response.ok) {
          const data = await response.json();
          const downvoteCount = data.downvotes;
          updateVoteCountDn(button, downvoteCount);
        }
      });
    });

    function updateVoteCountUp(button, count) {
      button.innerHTML = ` 
      <span>
        <img src="/img/like.png" alt="upvote">
      </span> ${count}`;
    }
    function updateVoteCountDn(button, count) {
      button.innerHTML = `
      <span>
        <img src="/img/unlike.png" alt="downvote">
      </span> ${count}`;
    }

    
    const subscribeForm = document.getElementById('subscribeForm');

    subscribeForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(subscribeForm);
      const name = formData.get('name');
      const email = formData.get('email');

      try {
        const response = await fetch('/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email }),
        });

        if (response.ok) {
          alert('Thank you for subscribing!');
          subscribeForm.reset();
        } else {
          throw new Error('Something went wrong.');
        }
      } catch (error) {
        console.error(error);
        alert('Failed to subscribe. Please try again later.');
      }
    });
});