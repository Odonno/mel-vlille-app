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

if (searchElement && tableElement && tableBodyElement && noResultElement) {
  const updateTable = (places: Place[], search: string = "") => {
    const lowerSearch = search && search.toLowerCase();

    const placesRows = places
      .filter((p) => {
        if (!lowerSearch) {
          return true;
        }

        return (
          p.town.toLowerCase().includes(lowerSearch) ||
          p.name.toLowerCase().includes(lowerSearch)
        );
      })
      .map((p) => {
        const statusOk = p.status === "EN SERVICE";
        const statusCss = statusOk ? "green" : "red";
        const bikesCss = p.numberBikesAvailable === 0 ? "red" : "";
        const placesCss = p.numberPlacesAvailable === 0 ? "red" : "";

        return `
        <tr>
            <td>${p.town}</td>
            <td>${p.name}</td>
            <td class="${statusCss}">${statusOk ? "Oui" : "Non"}</td>
            <td class="${bikesCss}">${p.numberBikesAvailable}</td>
            <td class="${placesCss}">${p.numberPlacesAvailable}</td>
        </tr>
        `;
      });

    const hasResult = placesRows.length > 0;

    tableBodyElement.innerHTML = placesRows.join("");
    tableElement.className = hasResult ? "visible" : "hidden";
    noResultElement.className = hasResult ? "hidden" : "visible";
  };

  fetch("https://asmelapi.azurewebsites.net/api/VLille/places")
    .then((response) => response.json())
    .then((places: Place[]) => {
      searchElement.addEventListener("keyup", () => {
        updateTable(places, searchElement.value);
      });

      updateTable(places);
    });
}
