const https = require("https");
const readline = require("readline");

// Creating an interface for reading from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Asking for URL
rl.question("Enter the URL: ", (input) => {
  const url = input;

  // Checking the validity of the URL
  if (isValidUrl(url)) {
    // Fetching website content
    https
      .get(url, (response) => {
        let data = "";

        // Data collecting
        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          let maxElements = 0;
          let currentItems = 0;
          let insideTag = false;
          let tag = "";

          // Loop through each characters in the HTML content
          for (let i = 0; i < data.length; i++) {
            const char = data[i];

            // Detecting start and end of tag
            if (char === "<") {
              insideTag = true;
              tag = "";
            } else if (char === ">") {
              insideTag = false;

              // Tag checking
              const tagContent = tag.trim().toLowerCase();

              if (tagContent.startsWith("ul")) {
                currentItems = 0; // Reset counter for new <ul> list
              } else if (tagContent.startsWith("/ul")) {
                maxElements = Math.max(maxElements, currentItems);
              } else if (tagContent.startsWith("li")) {
                currentItems += 1;
              }
            } else if (insideTag) {
              // Adding characters to tag
              tag += char;
            }
          }

          console.log(`Maximum elements in unordered list: ${maxElements}`);
        });
      })
      .on("error", (error) => {
        console.error(`Error: ${error.message}`);
      });
  } else {
    console.log("URL is incorrect!");
  }

  rl.close(); // Closing the interface
});

// Function to validate URL
function isValidUrl(urlToCheck) {
  try {
    new URL(urlToCheck);
    return true;
  } catch (error) {
    return false;
  }
}
