import { useEffect, useState } from "react";
import "./App.css";
import { MarvelLoader } from "./components";
import LazyLoad from "react-lazyload";
import queryString from "query-string";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [all, setAll] = useState(null);
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const fetchData = () => {
    setIsLoading(true);
    fetch(
      `https://gateway.marvel.com:443/v1/public/comics?dateRange=${startYear}-01-01%2C${endYear}-01-02&limit=50&apikey=ec083831340a59be9e3a399171cdd773`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        const { data } = res;
        if (!data) return;

        const { results } = data;
        if (!results || !results.length) return;
        
        setData(filterBySearch(results));
        setAll(results);
      });
  };

  useEffect(() => {
    const parsed = queryString.parse(window.location.pathname.split("/")[1]);
    const { searchString, sy, ey } = parsed;
    setSearch(searchString ? searchString : "");
    setStartYear(sy ? sy : "1990");
    setEndYear(ey ? ey : "2021");
  }, []);

  useEffect(() => {
    if ((!all || !all.length) && !isLoading && endYear && startYear) {
      fetchData(); // only initialy when parsed filters are availible
    }

    const stringified = queryString.stringify({
      searchString: search,
      sy: startYear,
      ey: endYear,
    });

    const { location } = window;

    if (location.search !== stringified) {
      window.history.replaceState({}, "", "/" + stringified);
    }
  }, [search, startYear, endYear]);

  useEffect(() => {
    if (!search.length) {
      return setData(all);
    }
    setData(filterBySearch(data));
  }, [search]);

  const filterBySearch = (arr) => {
    if (!arr || !arr.length) return [];
    if (!search || !search.length) return arr;
    let filtered = arr.filter(({ title }) => {
      return (
        title.trim().toLowerCase().indexOf(search.trim().toLowerCase()) > -1
      );
    });

    return filtered;
  };

  const fetchByYearRange = () => {
    let sy = parseInt(startYear, 10);
    let ey = parseInt(endYear, 10);
    if (
      startYear.length === 4 &&
      endYear.length === 4 &&
      sy <= ey &&
      sy >= 1900 &&
      ey <= 2021
    ) {
      fetchData();
    } else {
      alert(
        "Years must be in range 1900-2021 and endYear must be bigger or equal to startYear"
      );
    }
  };

  return (
    <div className="App">
      <div className="searchContainer">
        <input
          className="search"
          type="text"
          placeholder="Search here..."
          value={search}
          onChange={({ target: { value } }) => setSearch(value)}
        />
      </div>
      <div className="dateFilterContainer">
        <input
          className="yearStart"
          type="text"
          placeholder="Start year"
          value={startYear}
          onChange={({ target: { value } }) => setStartYear(value)}
        />
        <span className="rangeDevider">-</span>
        <input
          className="yearEnd"
          type="text"
          placeholder="End year"
          value={endYear}
          onChange={({ target: { value } }) => setEndYear(value)}
        />
        <button className="filterButton" onClick={fetchByYearRange}>
          Apply
        </button>
      </div>
      {!all || !all.length || isLoading ? (
        <MarvelLoader />
      ) : (
        <>
          {!data || !data.length ? (
            <h1>No results...</h1>
          ) : (
            <div className="comicsList">
              {data.map(({ id, title, thumbnail: { path, extension } }) => (
                <div key={id} className="comicTile">
                  <LazyLoad height={100}>
                    <img
                      src={path + "/standard_medium." + extension}
                      className="thumbnail"
                    />
                  </LazyLoad>
                  <p>{title}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
