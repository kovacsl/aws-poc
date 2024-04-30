import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { onError } from "../../lib/errorLib.ts";
import config from "../../config.ts";

import ListPatientsComponent from "../../components/ListPatients";


import "./ListPatients.css";
import PaginationComponent from "../../components/Pagination.tsx";


export default function ListPatients() {
  const { id } = useParams();
  const limit = 20;

  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    async function onLoad() {
      setIsLoading(true);

      try {
        const patients = await loadPatients();

        setTotalCount(patients[0]?.totalCount ?? 0);

        setPatients(patients);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [id]);

  async function loadPatients() {
    const token = sessionStorage.getItem('access_token');

    const response = await fetch(`${config.apiGateway.URL}/patients?limit=${limit}&offset=${offset}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    return response.json();
  }

  async function handlePagination(event: React.FormEvent<HTMLFormElement>, page: number) {
    event.preventDefault();
    
    const newOffset = (page * limit) % totalCount;

    setPage(page);
    setOffset(newOffset);

    await loadPatients();
  }

  return (
    <>
      <ListPatientsComponent patients={patients} isLoading={isLoading} />
      <PaginationComponent totalCount={totalCount} limit={limit} page={page} handleClick={handlePagination} />
    </>
  )
}