let scrollSpeed = 1; // Default speed
let scrolling = false;
let scrollInterval;
let fontSize = 1.2; // Default font size in rems

// Function to start scrolling
function startAutoScroll() {
    if (!scrolling) {
        scrolling = true;
        scrollInterval = setInterval(function () {
            const currentScroll = $(window).scrollTop();
            const windowHeight = $(window).height();
            const documentHeight = $(document).height();

            // Scroll down
            $(window).scrollTop(currentScroll + scrollSpeed);

            // Stop scrolling if the bottom is reached
            if (currentScroll + windowHeight >= documentHeight) {
                stopAutoScroll(); // Stop scrolling when reaching the bottom
                // Optionally, scroll back to the top or reset to the starting position
                // $(window).scrollTop(0); // Uncomment this line to reset to the top
            }
        }, 120); // Adjusted for smooth scrolling
    }
}

// Function to stop scrolling
function stopAutoScroll() {
    clearInterval(scrollInterval);
    scrolling = false;
}

// Function to update scroll speed
function updateScrollSpeed(newSpeed) {
    scrollSpeed = parseFloat(newSpeed);
}

// Function to update font size
function updateFontSize(newSize) {
    fontSize = newSize;
    $('.lyrics-text').css('font-size', fontSize + 'rem');
}

// Expose the functions for external use (Node.js style)
module.exports = {
    startAutoScroll,
    stopAutoScroll,
    updateScrollSpeed,
    updateFontSize
};
