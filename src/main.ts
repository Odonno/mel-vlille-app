import "./styles.css";

type Place = {
  town: string;
  name: string;
  status: "EN SERVICE" | "HORS SERVICE";
  numberBikesAvailable: number;
  numberPlacesAvailable: number;
};

const searchElement = document.getElementById("search") as HTMLInputElement;
const tableElement = document.getElementById("table") as HTMLTableElement;
const tableBodyElement = document.getElementById("table-body");
const noResultElement = document.getElementById("no-result") as HTMLDivElement;

const isSearchedPlace = (place: Place, search: string) =>{
  const lowerSearch = search && search.toLowerCase();

  if (!lowerSearch) {
    return true;
  }

  return (
    place.town.toLowerCase().includes(lowerSearch) ||
    place.name.toLowerCase().includes(lowerSearch)
  );
};

const getTableRow = (place: Place) => {
  const statusOk = place.status === "EN SERVICE";
  const statusCss = statusOk ? "green" : "red";
  const bikesCss = place.numberBikesAvailable === 0 ? "red" : "";
  const placesCss = place.numberPlacesAvailable === 0 ? "red" : "";

  return `
  <tr>
      <td>${place.town}</td>
      <td>${place.name}</td>
      <td class="${statusCss}">${statusOk ? "Oui" : "Non"}</td>
      <td class="${bikesCss}">${place.numberBikesAvailable}</td>
      <td class="${placesCss}">${place.numberPlacesAvailable}</td>
  </tr>
  `;
};

if (searchElement && tableElement && tableBodyElement && noResultElement) {
  const update = (places: Place[], search: string = "") => {
    const placesRows = places
      .filter((p) => isSearchedPlace(p, search))
      .map((p) => getTableRow(p));

    const hasResult = placesRows.length > 0;

    tableBodyElement.innerHTML = placesRows.join("");
    tableElement.className = hasResult ? "visible" : "hidden";
    noResultElement.className = hasResult ? "hidden" : "visible";
  };

  fetch("https://asmelapi.azurewebsites.net/api/VLille/places")
    .then((response) => response.json())
    .then((places: Place[]) => {
      searchElement.addEventListener("keyup", () => {
        update(places, searchElement.value);
      });

      update(places);
    });
}
