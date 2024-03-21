
//Logic for drop down of genres
function scrollDown() {
    console.log("hi");
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


// Code for anime dearch on basis of genre
const genreSearch = async() =>{
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    var selectedValues = [];
        checkboxes.forEach(function(checkbox) {
        selectedValues.push(checkbox.value);
    });
    var genres = selectedValues.join(','); // Concatenate values with comma and space
    console.log(genres);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/animeGenre';
    const input = document.createElement('input');
        input.type = 'hidden';
        input.name = "genres";
        input.value = genres;
        form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
}



document.addEventListener("DOMContentLoaded", function() {
    const postLinks = document.querySelectorAll(".post-link");

    postLinks.forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent the default action (navigation)

          const title = link.getAttribute("data-title");
          const pictureUrl = link.getAttribute("data-picture");
          const year = link.getAttribute("data-year");
          const plot = link.getAttribute("data-plot");
          const time = link.getAttribute("data-time");

          // Prepare the data object to send in the POST request
          const data = {
              title: title,
              picture_url: pictureUrl,
              year : year,
              plot : plot,
              time : time
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
