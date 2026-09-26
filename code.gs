const FOOD_SHEET_NAME = "food";
const LOCATION_SHEET_NAME = "location";


/**
 * Main API endpoint.
 *
 * Returns all food experiences as JSON.
 */
function doGet() {

  try {

    const spreadsheet =
      SpreadsheetApp.getActiveSpreadsheet();

    const foodSheet =
      spreadsheet.getSheetByName(FOOD_SHEET_NAME);

    const locationSheet =
      spreadsheet.getSheetByName(LOCATION_SHEET_NAME);


    if (!foodSheet) {
      throw new Error(
        `Could not find sheet: ${FOOD_SHEET_NAME}`
      );
    }

    if (!locationSheet) {
      throw new Error(
        `Could not find sheet: ${LOCATION_SHEET_NAME}`
      );
    }


    const foods =
      sheetToObjects(foodSheet);

    const locations =
      sheetToObjects(locationSheet);


    /*
     * Turn locations into a lookup object.
     *
     * Example:
     *
     * locationsById["12"]
     *
     * gives us the location with id 12.
     */
    const locationsById = {};

    locations.forEach(location => {

      if (location.id !== "") {

        locationsById[String(location.id)] =
          location;

      }

    });


    /*
     * Build the JSON structure used by the website.
     */
    const experiences =
      foods
        .filter(food => food.id !== "")
        .map(food => {

          const location =
            locationsById[
              String(food.locationID)
            ] || null;


          return {

            id: String(food.id),

            dish: food.foodName,

            cuisine: food.foodCuisine,

            foodOrigin: food.foodOrigin,

            region: food.foodRegion,

            countryCode:
              normalizeCountryCode(
                food.countryCode
              ),

            date:
              formatDate(food.foodDate),

            photo:
              food.photoLocation,


            person1: {

              name: "Cristyle",

              thoughts:
                food.cristylesThoughts,

              rating:
                toNumber(
                  food.cristylesRating
                ),

              haveAgain:
                yesNoToBoolean(
                  food.cristyleHaveAgain
                )

            },


            person2: {

              name: "Partner",

              thoughts:
                food.partnersThoughts,

              rating:
                toNumber(
                  food.partnersRating
                ),

              haveAgain:
                yesNoToBoolean(
                  food.partnerHaveAgain
                )

            },


            aboutFood:
              food.aboutFood,


            restaurant: location
              ? {

                  name:
                    location.resturauntName,

                  city:
                    location.resturauntCity,

                  address:
                    location.resturauntAddress,

                  phone:
                    location.resturauntPhone,

                  website:
                    location.resturauntWebsite,

                  combinedRating:
                    toNumber(
                      location.combinedRating
                    ),

                  cristyleGoBack:
                    yesNoToBoolean(
                      location.crisGoBack
                    ),

                  partnerGoBack:
                    yesNoToBoolean(
                      location.partnerGoBack
                    )

                }

              : null

          };

        });


    return jsonResponse({

      success: true,

      experiences: experiences,

      count: experiences.length

    });


  } catch (error) {

    return jsonResponse({

      success: false,

      error: error.message

    });

  }

}


/**
 * Convert a Google Sheet into an array of objects.
 *
 * The first row is treated as the column headers.
 */
function sheetToObjects(sheet) {

  const values =
    sheet.getDataRange().getValues();


  if (values.length < 2) {
    return [];
  }


  const headers =
    values[0].map(header =>
      String(header).trim()
    );


  return values
    .slice(1)
    .map(row => {

      const object = {};


      headers.forEach((header, index) => {

        object[header] =
          row[index];

      });


      return object;

    });

}


/**
 * Return JSON from the API.
 */
function jsonResponse(data) {

  return ContentService
    .createTextOutput(
      JSON.stringify(data)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );

}


/**
 * Normalize ISO country codes.
 */
function normalizeCountryCode(code) {

  if (!code) {
    return "";
  }

  return String(code)
    .trim()
    .toUpperCase();

}


/**
 * Convert spreadsheet numbers safely.
 */
function toNumber(value) {

  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }


  const number =
    Number(value);


  return Number.isNaN(number)
    ? null
    : number;

}


/**
 * Convert Y/N spreadsheet values
 * into JavaScript booleans.
 */
function yesNoToBoolean(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }


  const normalized =
    String(value)
      .trim()
      .toLowerCase();


  if (normalized === "y") {
    return true;
  }


  if (normalized === "n") {
    return false;
  }


  return null;

}


/**
 * Format Google Sheets dates as YYYY-MM-DD.
 */
function formatDate(value) {

  if (!value) {
    return "";
  }


  if (
    Object.prototype.toString
      .call(value) === "[object Date]"
  ) {

    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    );

  }


  return String(value);

}
