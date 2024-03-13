//Logic for drop down of genres
function scrollDown() {
    const genreDiv = document.getElementById('genre');
    if(!genreDiv.classList.contains('expanded')){
     genreDiv.classList.add('expanded'); 
    genreDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

function handleClickOutside(event) {
    const genreDiv = document.getElementById('genre');
    const scrollButton = document.getElementById('showGenre');

    if (!genreDiv.contains(event.target) && event.target !== scrollButton) {
        genreDiv.classList.remove('expanded'); // Remove the 'expanded' class
    }
}
document.body.addEventListener('click', handleClickOutside);


// Code to find series on the basis of genre
const genreSearch = async() =>{
            
    var genres = document.querySelectorAll('input[type=radio]');
    let genre = null;
        genres.forEach(ele =>{
            if(ele.checked){
                genre = ele.value;
            }
        })
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/showsGenre';
    const input = document.createElement('input');
        input.type = 'hidden';
        input.name = "genre";
        input.value = genre;
        form.appendChild(input);

    document.body.appendChild(form);
    form.submit();  
}


// Code for Carousel using jquery and owl-carousel
$(document).ready(function(){
    $('.owl-carousel').owlCarousel({
      loop:true, 
      autoplay:true, // Add this line to enable autoplay
      autoplayTimeout:3000,
      responsive:{
        0:{
          items:1
        },
        600:{
          items:1
        },
        1000:{
          items:1
        }
      }
    });
  });


// Code for showing each movie
document.addEventListener("DOMContentLoaded", function() {
    const postLinks = document.querySelectorAll(".post-link");
  
    postLinks.forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent the default action (navigation)
  
            const title = link.getAttribute("data-title");
            const pictureUrl = link.getAttribute("data-picture");
  
            // Prepare the data object to send in the POST request
            const data = {
                title: title,
                picture_url: pictureUrl
            };
  
            // Create a hidden form element
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/show'; // Replace with your endpoint URL
  
            // Create a hidden input field for each data attribute
            Object.keys(data).forEach(function(key) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            });
  
            // Append the form to the document body and submit it
            document.body.appendChild(form);
            form.submit();
       
        });
    });
  });
  