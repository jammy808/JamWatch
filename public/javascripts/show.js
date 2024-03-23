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
            form.action = '/add'; // Replace with your endpoint URL

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


    $(document).ready(function(){
    $('.owl-carousel').owlCarousel({ 
      responsive:{
        0:{
          items:2
        },
        600:{
          items:3
        },
        1000:{
          items:4
        }
      }
    });
  });



  document.addEventListener("DOMContentLoaded", function() {
    const postLinks = document.querySelectorAll(".post");

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
