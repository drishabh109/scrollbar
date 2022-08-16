import "./App.css";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import InfiniteScrollTable from "./components/table";
import { useNavigate } from "react-router-dom";

function Home() {
  const [currentPage, setCurrentPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const startedDataFetching = useRef(false);
  const timerId = useRef(null);
  const navigate = useNavigate();
  const timeInterval = 8000;

  useEffect(() => {
    fetchTableData();
    clearTimeout(timerId.current);
    setTimeout(updateCurrentPage, timeInterval);
    sessionStorage.removeItem("story");
  }, [currentPage]);

  function updateCurrentPage() {
    setCurrentPage(currentPage + 1);
  }

  async function fetchTableData() {
    try {
      if (!startedDataFetching.current) {
        startedDataFetching.current = true;
        setLoading(true);
        const response = await axios.get(
          `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${currentPage}`
        );
        setTableData([...tableData, ...response.data.hits]);
        setLoading(false);
        startedDataFetching.current = false;
      }
    } catch (e) {
      console.error("Error while fetching data", e);
    }
  }

  const handleTableAction = (rowData) => {
    sessionStorage.setItem("story", JSON.stringify(rowData));
    navigate("/story");
  };

  return (
    <div className="App">
      <InfiniteScrollTable
        fetchItems={fetchTableData}
        loading={loading}
        rows={tableData}
        updateCurrentPage={updateCurrentPage}
        handleTableAction={handleTableAction}
      />
    </div>
  );
}

export default Home;