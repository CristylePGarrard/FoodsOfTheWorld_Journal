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

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "&copy; OpenStreetMap contributors"
  }
).addTo(map);


// ============================================================
// MAP COLORS
// ============================================================
//
// The map gets darker as we explore more foods from a country.
//
// 0 foods  = neutral
// 1 food   = light green
// 2 foods  = medium green
// 3+ foods = deep green
//
// This means the map will continue to evolve automatically
// as we add more food experiences.
//

const defaultStyle = {
  color: "#aeb8b2",
  weight: 0.8,
  fillColor: "#d5dbd7",
  fillOpacity: 0.58
};


const exploredLightStyle = {
  color: "#6f8768",
  weight: 1.1,
  fillColor: "#b8c9b1",
  fillOpacity: 0.78
};


const exploredMediumStyle = {
  color: "#536b4e",
  weight: 1.3,
  fillColor: "#78936f",
  fillOpacity: 0.82
};


const exploredDeepStyle = {
  color: "#40543c",
  weight: 1.5,
  fillColor: "#536b4e",
  fillOpacity: 0.88
};


// Hover styles

const hoverExploredStyle = {
  color: "#8b5e3c",
  weight: 2.5,
  fillColor: "#d8b894",
  fillOpacity: 0.95
};


const hoverUnexploredStyle = {
  color: "#8b5e3c",
  weight: 1.5,
  fillColor: "#e5e0d6",
  fillOpacity: 0.78
};


// ============================================================
// COUNTRY DATA
// ============================================================

const countryLayers = new Map();


// ============================================================
// NORMALIZE COUNTRY CODE
// ============================================================

function normalizeCountryCode(code) {

  if (!code) {
    return "";
  }

  return String(code)
    .trim()
    .toUpperCase();

}


// ============================================================
// GET COUNTRY CODE FROM GEOJSON
// ============================================================

function getCountryCode(feature) {

  const properties =
    feature.properties || {};


  const possibleCodes = [

    properties["ISO3166-1-Alpha-3"],

    properties.ISO_A3,

    properties.iso_a3,

    properties.ADM0_A3,

    properties.adm0_a3,

    properties.SOV_A3,

    properties.sov_a3,

    properties.ISO_A3_EH,

    properties.iso_a3_eh

  ];


  for (const code of possibleCodes) {

    const normalizedCode =
      normalizeCountryCode(code);


    if (
      normalizedCode &&
      normalizedCode !== "-99"
    ) {

      return normalizedCode;

    }

  }


  return null;

}


// ============================================================
// GET COUNTRY NAME
// ============================================================

function getCountryName(feature) {

  const properties =
    feature.properties || {};


  return (

    properties.name ||

    properties.NAME ||

    properties.ADMIN ||

    properties.NAME_LONG ||

    properties.name_long ||

    "Unknown"

  );

}


// ============================================================
// GET FOODS FOR A COUNTRY
// ============================================================

function experiencesForCountry(countryCode) {

  const normalizedCode =
    normalizeCountryCode(
      countryCode
    );


  if (!normalizedCode) {
    return [];
  }


  return experiences.filter(
    experience => {

      return (
        normalizeCountryCode(
          experience.countryCode
        ) === normalizedCode
      );

    }
  );

}


// ============================================================
// GET STYLE BASED ON FOOD COUNT
// ============================================================

function getCountryStyle(foodCount) {

  if (foodCount === 0) {

    return defaultStyle;

  }


  if (foodCount === 1) {

    return exploredLightStyle;

  }


  if (foodCount === 2) {

    return exploredMediumStyle;

  }


  return exploredDeepStyle;

}


// ============================================================
// LOAD WORLD MAP
// ============================================================

fetch(
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
)

  .then(response => {

    if (!response.ok) {

      throw new Error(
        "Could not load country map data."
      );

    }


    return response.json();

  })


  .then(data => {

    console.log(
      "World map loaded:",
      data.features.length,
      "countries"
    );


    // --------------------------------------------------------
    // CREATE COUNTRY LAYERS
    // --------------------------------------------------------

    L.geoJSON(

      data,

      {

        // ====================================================
        // COUNTRY STYLE
        // ====================================================

        style: feature => {

          const countryCode =
            getCountryCode(
              feature
            );


          const foods =
            experiencesForCountry(
              countryCode
            );


          return getCountryStyle(
            foods.length
          );

        },


        // ====================================================
        // COUNTRY EVENTS
        // ====================================================

        onEachFeature: (
          feature,
          layer
        ) => {

          const countryCode =
            getCountryCode(
              feature
            );


          const countryName =
            getCountryName(
              feature
            );


          const foods =
            experiencesForCountry(
              countryCode
            );


          const foodCount =
            foods.length;


          // --------------------------------------------------
          // SAVE COUNTRY LAYER
          // --------------------------------------------------

          if (countryCode) {

            countryLayers.set(
              countryCode,
              layer
            );

          }


          // ==================================================
          // HOVER TOOLTIP
          // ==================================================

          if (foodCount > 0) {

            const foodLabel =
              foodCount === 1
                ? "food explored"
                : "foods explored";


            const foodNames =
              foods
                .map(
                  food => food.dish
                )
                .join(" · ");


            layer.bindTooltip(

              `
                <div class="country-tooltip-content">

                  <strong>
                    ${countryName}
                  </strong>

                  <span class="tooltip-count">
                    ${foodCount}
                    ${foodLabel}
                  </span>

                  <span class="tooltip-foods">
                    ${foodNames}
                  </span>

                </div>
              `,

              {
                sticky: true,
                className:
                  "country-tooltip"
              }

            );

          } else {

            layer.bindTooltip(

              `
                <div class="country-tooltip-content">

                  <strong>
                    ${countryName}
                  </strong>

                  <span class="tooltip-unexplored">
                    Not explored yet
                  </span>

                </div>
              `,

              {
                sticky: true,
                className:
                  "country-tooltip"
              }

            );

          }


          // ==================================================
          // MOUSE OVER
          // ==================================================

          layer.on(
            "mouseover",
            event => {

              event.target.setStyle(
                hoverExploredStyle
              );

              event.target.bringToFront();

            }
          );


          // ==================================================
          // MOUSE OUT
          // ==================================================

          layer.on(
            "mouseout",
            event => {

              event.target.setStyle(
                getCountryStyle(
                  foodCount
                )
              );

            }
          );


          // ==================================================
          // CLICK
          // ==================================================

          layer.on(
            "click",
            () => {

              if (foodCount > 0) {

                showCountryJournal(
                  countryName,
                  countryCode
                );

              } else {

                showUnexploredCountry(
                  countryName
                );

              }

            }
          );

        }

      }

    ).addTo(map);


    // --------------------------------------------------------
    // DEBUG
    // --------------------------------------------------------

    console.log(
      "Countries represented in our food journey:"
    );


    experiences.forEach(
      experience => {

        console.log(
          experience.dish,
          "→",
          experience.countryCode
        );

      }
    );

  })


  // ========================================================
  // MAP ERROR
  // ========================================================

  .catch(error => {

    console.error(
      "Could not load world map:",
      error
    );


    document
      .getElementById("map")
      .insertAdjacentHTML(

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
    experiencesForCountry(
      countryCode
    );


  // Get unique cuisines

  const cuisines =
    [
      ...new Set(
        foods.map(
          food => food.cuisine
        )
      )
    ];


  const foodList =
    foods
      .map(
        food => {

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

        }
      )
      .join("");


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

      ${foods.length === 1
        ? "food"
        : "foods"}

      explored

      ·

      ${cuisines.length}

      ${cuisines.length === 1
        ? "cuisine"
        : "cuisines"}

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
    .querySelectorAll(
      ".food-entry-button"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            openJournal(
              button.dataset.id
            );

          }
        );

      }
    );


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
      experience =>
        experience.id === id
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

        ${
          item.restaurant.website
            ? `
              <a
                href="${item.restaurant.website}"
                target="_blank"
                rel="noopener"
              >
                Restaurant website ↗
              </a>
            `
            : ""
        }

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
  .getElementById(
    "closeModal"
  )
  .addEventListener(
    "click",
    closeModal
  );


document
  .getElementById(
    "modalBackdrop"
  )
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
  .getElementById(
    "resetMap"
  )
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

