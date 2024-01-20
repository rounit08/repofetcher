//Function to make API call and fetch user's details
function fetchUserDetails(username) {
  const userUrl = `https://api.github.com/users/${username}`;

  $.ajax({
    url: userUrl,
    method: "GET",
    success: function (userInfo) {
      console.log(userInfo);
      $("#profileImage").attr("src", userInfo.avatar_url);
      $("#githubLink").html(
        `<a href="${userInfo.html_url} target="_blank">${userInfo.html_url}</a>`
      );
      $("#fullname").text(userInfo.name);
      $("#bio").text(userInfo.bio);
      $("#location").text(userInfo.location);
      $("#links").html(
        `<a href="${userInfo.blog} target="_blank">${userInfo.blog}</a>`
      );
    },
  });
}
// Function to make API call and fetch repositories

let currentPage = 1;
const perPage = 10;

function fetchRepositories(username, page = 1, perPage = 10) {
  const apiUrl = `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`;

  $("#repoList").html('<li class="list-group-item">Loading...</li>');

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((repodata) => {
      // Clear existing cards
      $(".cardSection").empty();

      if (repodata.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No repositories found";
        $(".cardSection").appendChild(message);
        return;
      }

      // Process the data and update the UI
      console.log(repodata);
      updateRepositoryList(repodata);
      updatePagination(username, page, perPage);

      // Create and append HTML elements to cardSection
      const cardSection = document.querySelector(".cardSection");
      repodata.forEach((repo) => {
        const card = document.createElement("div");
        card.className = "card mb-3";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = repo.name;

        const description = document.createElement("p");
        description.className = "card-text";
        description.textContent = repo.description;

        const topicBtnGroup = document.createElement("div");

        if (Array.isArray(repo.topic) && repo.topic.length > 0) {
          repo.topic.forEach((eachTopic) => {
            const topicBtn = document.createElement("button");
            topicBtn.className = "btn btn-primary";
            topicBtn.textContent = eachTopic;
            topicBtnGroup.appendChild(topicBtn);
          });
        } else {
          const topicBtn = document.createElement("button");
          topicBtn.className = "btn btn-primary";
          topicBtn.textContent = repo.language;

          topicBtnGroup.appendChild(topicBtn);
        }

        cardBody.appendChild(title);
        cardBody.appendChild(description);
        cardBody.appendChild(topicBtnGroup);

        card.appendChild(cardBody);
        cardSection.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error fetching repositories:", error);
    });
}

//fucntion for paginiation
function updatePagination(username, currentPage, perPage) {
  const apiUrl = `https://api.github.com/users/${username}/repos`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP ERROR!");
      }
      return response.json();
    })
    .then((repodata) => {
      const totalItems = repodata.length;
      const totalPages = Math.ceil(totalItems / perPage);
      const paginationElement = $("#pagination");
      paginationElement.empty();
      for (let i = 1; i <= totalPages; i++) {
        const listItem = `<li class="page-item ${
          i === currentPage ? "active" : ""
        }">
       <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
       </li>`;
        paginationElement.append(listItem);
      }
    })
    .catch((error) => {
      console.error("Error fetching", error);
    });
}

function changePage(newPage) {
  currentPage = newPage;
  const username = document.getElementById("searchInput").value;
  fetchRepositories(username, newPage);
}

// Function to handle Enter key press in search input
function searchRepositories(event) {
  if (event.key === "Enter") {
    // Clear previous results
    clearPreviousResults();

    const username = document.getElementById("searchInput").value;
    currentPage = 1;
    fetchRepositories(username, currentPage);
    fetchUserDetails(username);
  }
}

function clearPreviousResults() {
  // Clear repositories list
  const repoList = document.getElementById("repoList");
  if (repoList) {
    repoList.innerHTML = "";
  }

  // Clear pagination
  const pagination = document.getElementById("pagination");
  if (pagination) {
    pagination.innerHTML = "";
  }

  // Clear user details
  const profileImage = document.getElementById("profileImage");
  const githubLink = document.getElementById("githubLink");
  const fullname = document.getElementById("fullname");
  const bio = document.getElementById("bio");
  const location = document.getElementById("location");
  const links = document.getElementById("links");

  if (profileImage && githubLink && fullname && bio && location && links) {
    profileImage.src = "./media/profile.jpg";
    githubLink.textContent = "";
    fullname.textContent = "John Doe";
    bio.textContent = "Bio goes here";
    location.textContent = "Location goes here";
    links.textContent = "Any links goes here";
  }
}

// Function to update the repository list on the UI
function updateRepositoryList(repositories) {
  const repoListElement = $("#repoList");
  repoListElement.empty(); // Clear existing list
}
