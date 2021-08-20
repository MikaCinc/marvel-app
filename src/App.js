import { useEffect, useState } from "react";
import "./App.css";
import { MarvelLoader } from "./components";

const App = () => {
  const [all, setAll] = useState(null);
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(
      "https://gateway.marvel.com:443/v1/public/comics?apikey=ec083831340a59be9e3a399171cdd773"
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        const { data } = res;
        if (!data) return;

        const { results } = data;
        if (!results || !results.length) return;

        setData(results);
        setAll(results);
      });
  }, []);

  /*   useEffect(() => {
    console.log(data);
  }, [data]); */

  useEffect(() => {
    if (!search.length) {
      return setData(all);
    }
    setData(filterBySearch());
  }, [search]);

  const filterBySearch = () => {
    if (!data || !data.length) return [];
    let filtered = data.filter(({ title }) => {
      return (
        title.trim().toLowerCase().indexOf(search.trim().toLowerCase()) > -1
      );
    });

    // console.log(filtered, filtered.length);

    return filtered;
  };

  if (!all || !all.length) return <MarvelLoader />;

  return (
    <div className="App">
      <div className="searchContainer">
        <input
          className="search"
          type="text"
          placeholder="search here"
          value={search}
          onChange={({ target: { value } }) => setSearch(value)}
        />
      </div>
      {data && data.length && (
        <div className="comicsList">
          {data.map(({ id, title, thumbnail: { path, extension } }) => (
            <div key={id} className="comicTile">
              <img
                src={path + "/standard_medium." + extension}
                className="thumbnail"
              />
              <p>{title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
