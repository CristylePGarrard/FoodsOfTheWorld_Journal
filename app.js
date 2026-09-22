// ============================================================
// OUR FOOD JOURNEY
// Prototype data
//
// IMPORTANT:
// This is temporary sample data.
// Eventually this information will come from:
// Google Sheets → Google Apps Script → JavaScript
// ============================================================

const experiences = [
  {
    id: "001",

    // -------------------------
    // FOOD
    // -------------------------
    dish: "Dosa",
    cuisine: "Southern Indian",
    foodOrigin: "Indian subcontinent",
    region: "South Asia",

    // ISO country code used by the map
    countryCode: "IND",

    date: "September 19, 2026",

    // -------------------------
    // OUR EXPERIENCE
    // -------------------------
    photo: "🍛",

    person1: {
      name: "Cristyle",
      thoughts:
        "Delicious! The lentil crepe was crispy and delicious and the sauces, YUM! I would absolutely order this again.",
      rating: 5
    },

    person2: {
      name: "Partner",
      thoughts:
        "Really enjoyed it",
      rating: 5
    },

    goBack: true,
    eatAgain: true,

    // -------------------------
    // RESTAURANT
    // Secondary information
    // -------------------------
    restaurant: {
      name: "Srivari Cafe",
      city: "West Jordan, Utah",
      address: "1617 W 9000 S West Jordan, UT",
      phone: "(801) 996-3628",
      website: ""
    }
  },

  {
    id: "002",

    dish: "Banh mi",
    cuisine: "Vietnamese",
    foodOrigin: "Vietnam",
    region: "Southeast Asia",
    countryCode: "VNM",

    date: "September 19, 2026",

    photo: "🍣",

    person1: {
      name: "Cristyle",
      thoughts:
        "The sandwich was meh. But it was vegan meat so I don't think I can hold it against the Banh mi itself",
      rating: 3
    },

    person2: {
      name: "Partner",
      thoughts:
        "It was fine",
      rating: 3.5
    },

    goBack: true,
    eatAgain: false,

    restaurant: {
      name: "Vegan Bowl",
      city: "West Jordan",
      address: "8672 S Redwood Rd West Jordan, UT",
      phone: "(801) 692-7237",
      website: ""
    }
  },

  {
    id: "003",

    dish: "Pupusa",
    cuisine: "Salvadoran",
    foodOrigin: "El Salvador",
    region: "El Salvador",
    countryCode: "SLV",

    date: "September 19, 2026",

    photo: "🌮",

    person1: {
      name: "Cristyle",
      thoughts:
        "Amazing! So incredibly delicious and with the curtido and tomato sauce on it, mmmm mmmm mmm! So delicious!!",
      rating: 5
    },

    person2: {
      name: "Partner",
      thoughts:
        "Loved the tacos and would definitely try more from this restaurant.",
      rating: 4
    },

    goBack: true,
    eatAgain: true,

    restaurant: {
      name: "Rincon Salvadoreno",
      city: "Salt Lake City, Utah",
      address: "3898 W 5535 S Salt Lake City, UT ",
      phone: "(801) 955-9772",
      website: "rinconsalvadoreno.com"
    }
  },

  {
    id: "004",

    dish: "Ramen",
    cuisine: "Japanese",
    foodOrigin: "Japan",
    region: "East Asia",
    countryCode: "JPN",

    date: "September 10, 2026",

    photo: "🍜",

    person1: {
      name: "Cristyle",
      thoughts:
        "The broth was rich and comforting. I want to try more regional styles of ramen.",
      rating: 4.5
    },

    person2: {
      name: "Partner",
      thoughts:
        "Really good. I would definitely try another type of ramen.",
      rating: 4
    },

    goBack: true,
    eatAgain: true,

    restaurant: {
      name: "Sample Ramen Restaurant",
      city: "Salt Lake City, Utah",
      address: "789 Sample Street, Salt Lake City, UT",
      phone: "(801) 555-0122",
      website: "#"
    }
  },

  {
    id: "005",

    dish: "Samosa",
    cuisine: "Indian",
    foodOrigin: "South Asia",
    region: "South Asia",
    countryCode: "IND",

    date: "September 14, 2026",

    photo: "🥟",

    person1: {
      name: "Cristyle",
      thoughts:
        "Crispy, spicy, and delicious. These were probably my favorite part of the meal.",
      rating: 5
    },

    person2: {
      name: "Partner",
      thoughts:
        "Very good. The filling had a lot of flavor.",
      rating: 4.5
    },

    goBack: true,
    eatAgain: true,

    restaurant: {
      name: "Bombay House",
      city: "Salt Lake City, Utah",
      address: "2731 E Parleys Way, Salt Lake City, UT",
      phone: "(801) 581-0222",
      website: "https://www.bombayhouse.com/"
    }
  }
];


// ============================================================
// MAP
// ============================================================

const map = L.map("map", {
  worldCopyJump: true,
  minZoom: 2
}).setView([25, 0], 2);


// OpenStreetMap background
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);


// ============================================================
// MAP COLORS
// ============================================================

const defaultStyle = {
  color: "#aeb8b2",
  weight: 0.8,
  fillColor: "#cbd2ce",
  fillOpacity: 0.55
};

const exploredStyle = {
  color: "#536b4e",
  weight: 1.2,
  fillColor: "#78936f",
  fillOpacity: 0.72
};

const hoverExploredStyle = {
  color: "#8b5e3c",
  weight: 2,
  fillColor: "#d8b894",
  fillOpacity: 0.9
};

const hoverUnexploredStyle = {
  color: "#8b5e3c",
  weight: 1.5,
  fillColor: "#e1ddd3",
  fillOpacity: 0.75
};


// ============================================================
// COUNTRY DATA
// ============================================================

const countryLayers = new Map();


// Get all foods associated with a country
function experiencesForCountry(countryCode) {
  return experiences.filter(
    experience => experience.countryCode === countryCode
  );
}


// ============================================================
// COUNTRY NAME
// ============================================================

function getCountryName(feature) {
  return (
    feature.properties.ADMIN ||
    feature.properties.NAME ||
    feature.properties.name ||
    "Unknown"
  );
}


// ============================================================
// LOAD WORLD MAP
// ============================================================

fetch(
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
)
  .then(response => {
    if (!response.ok) {
      throw new Error("Could not load country map data.");
    }

    return response.json();
  })

  .then(data => {

    L.geoJSON(data, {

      style: feature => {

        const countryCode = feature.properties.ISO_A3;

        const foods = experiencesForCountry(countryCode);

        if (foods.length > 0) {
          return exploredStyle;
        }

        return defaultStyle;
      },


      onEachFeature: (feature, layer) => {

        const countryCode = feature.properties.ISO_A3;

        const countryName = getCountryName(feature);

        const foods = experiencesForCountry(countryCode);

        countryLayers.set(countryCode, layer);


        // ---------------------------------------------
        // HOVER TEXT
        // ---------------------------------------------

        if (foods.length > 0) {

          const foodCount = foods.length;

          const foodLabel =
            foodCount === 1
              ? "food explored"
              : "foods explored";

          layer.bindTooltip(
            `
              <strong>${countryName}</strong>
              <br>
              ${foodCount} ${foodLabel}
            `,
            {
              sticky: true,
              className: "country-tooltip"
            }
          );

        } else {

          layer.bindTooltip(countryName, {
            sticky: true,
            className: "country-tooltip"
          });

        }


        // ---------------------------------------------
        // MOUSE OVER
        // ---------------------------------------------

        layer.on("mouseover", event => {

          if (foods.length > 0) {

            event.target.setStyle(
              hoverExploredStyle
            );

          } else {

            event.target.setStyle(
              hoverUnexploredStyle
            );

          }

        });


        // ---------------------------------------------
        // MOUSE OUT
        // ---------------------------------------------

        layer.on("mouseout", event => {

          if (foods.length > 0) {

            event.target.setStyle(
              exploredStyle
            );

          } else {

            event.target.setStyle(
              defaultStyle
            );

          }

        });


        // ---------------------------------------------
        // CLICK
        // ---------------------------------------------

        layer.on("click", () => {

          if (foods.length > 0) {

            showCountryJournal(
              countryName,
              countryCode
            );

          } else {

            showUnexploredCountry(
              countryName
            );

          }

        });

      }

    }).addTo(map);

  })

  .catch(error => {

    console.error(
      "Could not load world map:",
      error
    );

    document.getElementById("map").insertAdjacentHTML(
      "beforeend",

      `
        <div
          style="
            padding:20px;
            background:white;
            position:absolute;
            z-index:1000;
            top:20px;
            left:20px;
            border-radius:10px;
          "
        >
          The country map data could not be loaded.
        </div>
      `
    );

  });


// ============================================================
// COUNTRY JOURNAL
// ============================================================

function showCountryJournal(
  countryName,
  countryCode
) {

  const foods =
    experiencesForCountry(countryCode);


  // Get unique cuisines
  const cuisines =
    [...new Set(
      foods.map(food => food.cuisine)
    )];


  const foodList =
    foods.map(food => {

      return `
        <button
          class="food-entry-button"
          data-id="${food.id}"
        >

          <span class="food-entry-emoji">
            ${food.photo}
          </span>

          <span class="food-entry-info">

            <strong>
              ${food.dish}
            </strong>

            <small>
              ${food.cuisine}
            </small>

          </span>

        </button>
      `;

    }).join("");


  document.getElementById(
    "modalContent"
  ).innerHTML = `

    <p class="entry-kicker">
      OUR FOOD JOURNEY
    </p>

    <h2 class="entry-title">
      🌎 ${countryName}
    </h2>

    <p class="entry-meta">

      ${foods.length}
      ${foods.length === 1 ? "food" : "foods"}
      explored

      ·

      ${cuisines.length}
      ${cuisines.length === 1 ? "cuisine" : "cuisines"}

    </p>


    <div class="country-summary">

      <p>
        These are the foods from this part of the
        world that we've explored so far.
      </p>

    </div>


    <div class="food-list">

      ${foodList}

    </div>

  `;


  // Connect food buttons

  document
    .querySelectorAll(".food-entry-button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openJournal(
            button.dataset.id
          );

        }
      );

    });


  openModal();
}


// ============================================================
// UNEXPLORED COUNTRY
// ============================================================

function showUnexploredCountry(
  countryName
) {

  document.getElementById(
    "modalContent"
  ).innerHTML = `

    <p class="entry-kicker">
      NOT EXPLORED YET
    </p>

    <h2 class="entry-title">
      🌎 ${countryName}
    </h2>

    <p class="entry-meta">
      We haven't recorded any foods from here yet.
    </p>

    <div class="country-summary">

      <p>
        Maybe this is somewhere our food journey
        will take us someday.
      </p>

    </div>

  `;


  openModal();
}


// ============================================================
// FOOD JOURNAL ENTRY
// ============================================================

function openJournal(id) {

  const item =
    experiences.find(
      experience => experience.id === id
    );


  if (!item) {
    return;
  }


  document.getElementById(
    "modalContent"
  ).innerHTML = `

    <p class="entry-kicker">

      ${item.cuisine}

      ·

      ${item.region}

    </p>


    <h2 class="entry-title">

      ${item.photo}

      ${item.dish}

    </h2>


    <p class="entry-meta">

      ${item.date}

    </p>


    <div class="entry-photo">

      ${item.photo}

    </div>


    <div class="food-origin-box">

      <strong>
        🌎 Food origin
      </strong>

      <p>
        ${item.foodOrigin}
      </p>

      <small>
        Region: ${item.region}
      </small>

    </div>


    <div class="journal-grid">

      <section class="note">

        <h3>
          ${item.person1.name}'s thoughts
        </h3>

        <p>
          ${item.person1.thoughts}
        </p>

        <p
          class="rating"
          style="margin-top:12px"
        >
          ${stars(item.person1.rating)}
        </p>

      </section>


      <section class="note">

        <h3>
          ${item.person2.name}'s thoughts
        </h3>

        <p>
          ${item.person2.thoughts}
        </p>

        <p
          class="rating"
          style="margin-top:12px"
        >
          ${stars(item.person2.rating)}
        </p>

      </section>

    </div>


    <section class="restaurant-box">

      <p class="entry-kicker">
        WHERE WE EXPERIENCED IT
      </p>

      <h3>
        📍 ${item.restaurant.name}
      </h3>

      <p>
        ${item.restaurant.address}
      </p>

      <p>
        ${item.restaurant.city}
      </p>

      <p>
        ${item.restaurant.phone}
      </p>

      <p>

        <a
          href="${item.restaurant.website}"
          target="_blank"
          rel="noopener"
        >
          Restaurant website ↗
        </a>

      </p>


      <p>
        <strong>
          Would we go back?
        </strong>

        ${
          item.goBack
            ? "Yes ❤️"
            : "Not sure yet"
        }

      </p>


      <p>
        <strong>
          Would we have it again?
        </strong>

        ${
          item.eatAgain
            ? "Absolutely"
            : "Probably not"
        }

      </p>

    </section>

  `;


  openModal();
}


// ============================================================
// STAR RATINGS
// ============================================================

function stars(value) {

  const full =
    Math.floor(value);

  const half =
    value % 1 !== 0;


  return (
    "★".repeat(full) +

    (half ? "½" : "") +

    "☆".repeat(
      5 -
      full -
      (half ? 1 : 0)
    )
  );

}


// ============================================================
// MODAL
// ============================================================

function openModal() {

  document.getElementById(
    "modalBackdrop"
  ).hidden = false;

}


function closeModal() {

  document.getElementById(
    "modalBackdrop"
  ).hidden = true;

}


document
  .getElementById("closeModal")
  .addEventListener(
    "click",
    closeModal
  );


document
  .getElementById("modalBackdrop")
  .addEventListener(
    "click",
    event => {

      if (
        event.target.id ===
        "modalBackdrop"
      ) {

        closeModal();

      }

    }
  );


document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      closeModal();

    }

  }
);


// ============================================================
// RESET MAP
// ============================================================

document
  .getElementById("resetMap")
  .addEventListener(
    "click",
    () => {

      map.setView(
        [25, 0],
        2
      );

    }
  );


// ============================================================
// STATISTICS
// ============================================================

const uniqueCountries =
  new Set(
    experiences.map(
      experience =>
        experience.countryCode
    )
  );


const uniqueRegions =
  new Set(
    experiences.map(
      experience =>
        experience.region
    )
  );


const uniqueCuisines =
  new Set(
    experiences.map(
      experience =>
        experience.cuisine
    )
  );


document.getElementById(
  "stats"
).innerHTML = `

  <div class="stat">

    <span class="stat-number">
      ${experiences.length}
    </span>

    <span class="stat-label">
      Foods Tried
    </span>

  </div>


  <div class="stat">

    <span class="stat-number">
      ${uniqueCountries.size}
    </span>

    <span class="stat-label">
      Countries
    </span>

  </div>


  <div class="stat">

    <span class="stat-number">
      ${uniqueRegions.size}
    </span>

    <span class="stat-label">
      Regions
    </span>

  </div>


  <div class="stat">

    <span class="stat-number">
      ${uniqueCuisines.size}
    </span>

    <span class="stat-label">
      Cuisines
    </span>

  </div>

`;
