// Function to update the star rating display based on the dropdown selection
function updateStarRating() {
    const rating = document.getElementById("rating").value;
    const starCount = document.getElementById("star-count");
    const stars = document.getElementById("stars");
  
    // Update the number of stars displayed next to the rating
    starCount.innerHTML = rating;
  
    // Clear previous stars
    stars.innerHTML = "";
  
    // Add filled stars (★) based on the rating
    for (let i = 0; i < rating; i++) {
      stars.innerHTML += "★"; // Filled star
    }
  
    // Add empty stars (☆) for the rest (to make it 5 stars in total)
    for (let i = rating; i < 5; i++) {
      stars.innerHTML += "☆"; // Empty star
    }
  }
  
  // Initialize the star display when the page loads
  document.addEventListener("DOMContentLoaded", function() {
    updateStarRating();
  });
  