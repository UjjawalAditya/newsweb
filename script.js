const API_KEY = "pub_5040961eb6ba8762246ae0623340c411c6d74";
const url = "https://newsdata.io/api/1/news?apikey=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${API_KEY}&q=${encodeURIComponent(query)}&language=en,hi`);
        const data = await res.json();
        if (res.ok) {
            bindData(data.results);  // Use `data.results` as the array of articles
        } else {
            console.error(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Fetch failed:", error);
    }
}


function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles
        .filter(article => article.language === 'en' || article.language === 'hi') // Ensure language is English or Hindi
        .forEach(article => {
            if (!article.link) return; // Skip articles without a valid link
            const cardClone = newsCardTemplate.content.cloneNode(true);
            fillDataInCard(cardClone, article);
            cardsContainer.appendChild(cardClone);
        });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    // Set a placeholder image if no image is provided
    newsImg.src = article.image_url || 'https://via.placeholder.com/400x200';  
    newsTitle.innerHTML = article.title || 'No Title Available';
    
    // Truncate description if it's too long
    const maxLength = 150; // Adjust the max length as needed
    newsDesc.innerHTML = article.description && article.description.length > maxLength 
        ? article.description.slice(0, maxLength) + '...'
        : article.description || 'No Description Available';

    // If there's no creator or source, provide default text
    const date = new Date(article.published_at).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });
    const sourceName = article.creator && article.creator.length > 0 ? article.creator[0] : 'Unknown Source';
    
    newsSource.innerHTML = `${sourceName} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.link || '#', "_blank");  // Fallback URL if no link is available
    });
}




let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
