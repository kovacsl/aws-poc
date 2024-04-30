import { useState, useEffect } from "react";
import { onError } from "../../lib/errorLib.ts";
import config from "../../config.ts";

import Pagination from "../../components/Pagination.tsx";
import ListPatientsComponent from "../../components/ListPatients";


import "./ListPatients.css";

const PageSize: number = 20;

export default function ListPatients() {

  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    async function onLoad() {
      setIsLoading(true);

      try {
        const patients = await loadPatients((currentPage - 1) * PageSize);
        
        setTotalCount(patients[0]?.totalCount)

        setPatients(patients);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [currentPage]);

  function handlePageChange(page: number) {
    setCurrentPage(page);

    return page;
  }

  async function loadPatients(offset: number) {
    const token = sessionStorage.getItem('access_token');

    const response = await fetch(`${config.apiGateway.URL}/patients?limit=${PageSize}&offset=${offset}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    return response.json();
  }


  return (
    <>
      <ListPatientsComponent patients={patients} isLoading={isLoading} />
      <Pagination className="pagination-bar" currentPage={currentPage} totalCount={totalCount}  pageSize={PageSize} onPageChange={(page) => handlePageChange(page)} />
    </>
  )
}