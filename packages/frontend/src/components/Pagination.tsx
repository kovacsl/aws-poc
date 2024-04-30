import { usePagination, DOTS } from "../lib/usePagination";
import classnames from "classnames";

import "./Pagination.css";

interface Props {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => {};
  siblingCount?: number;
  className: string;
}

export default function Pagination(props: Props) {
  const { totalCount, currentPage, siblingCount, pageSize, className, onPageChange } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  }) ?? [];

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (

    <ul
      className={classnames('pagination-container', { [className]: className })}
    >
      {/* Left navigation arrow */}
      <li
        key={"prev"}
        className={classnames('pagination-item', {
          disabled: currentPage === 1
        })}
        onClick={onPrevious}
      >
        <div className="arrow left" />
      </li>
      {paginationRange.map((pageNumber, index) => {

        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return <li key={index} className="pagination-item dots">&#8230;</li>;
        }

        // Render our Page Pills
        return (
          <li
            key={index}
            className={classnames('pagination-item', {
              selected: pageNumber === currentPage
            })}
            onClick={() => onPageChange(parseInt(`${pageNumber}`, 10))}
          >
            {pageNumber}
          </li>
        );
      })}
      {/*  Right Navigation arrow */}
      <li
        key={"next"}
        className={classnames('pagination-item', {
          disabled: currentPage === lastPage
        })}
        onClick={onNext}
      >
        <div className="arrow right" />
      </li>
    </ul>
  )

}