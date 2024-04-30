import Pagination from 'react-bootstrap/Pagination';

interface Props {
  totalCount: number;
  limit: number;
  page: number;
  handleClick: (page: number) => {};
}

export default function PaginationComponent(props: Props) {
  const { totalCount, limit, page, handleClick } = props;

  const totalPages = Math.ceil(totalCount / limit);

  let items = [];
  if (totalPages > 10) {
    items.push(
      <Pagination.First key="first" onClick={() => handleClick(1)}/>
    );
    items.push(
      <Pagination.Prev key="prev" onClick={() => handleClick(page - 1)}/>
    );
    items.push(
      <Pagination.Item key={1} active={1 === page} onClick={() => handleClick(1)}>
        {1}
      </Pagination.Item>,
    );
    items.push(
      <Pagination.Ellipsis key="ellipsis_1" />
    );
    const middle = totalPages / 2;
    for (let n = middle; n <= middle + 5; n++) {
      items.push(
        <Pagination.Item key={n} active={n === page} onClick={() => handleClick(n)}>
          {n}
        </Pagination.Item>,
      );
    }
    items.push(
      <Pagination.Ellipsis key="ellipsis_2"/>
    );
    items.push(
      <Pagination.Item key={totalPages} active={totalPages === page} onClick={() => handleClick(totalPages)}>
        {totalPages}
      </Pagination.Item>,
    );
    items.push(
      <Pagination.Next key="next" onClick={() => handleClick(page + 1)} />
    );
    items.push(
      <Pagination.Last key="last" onClick={() => handleClick(totalPages)} />
    );
  }
  else {
    for (let n = 1; n <= totalPages; n++) {
      items.push(
        <Pagination.Item key={n} active={n === page} onClick={() => handleClick(n)}>
          {n}
        </Pagination.Item>,
      );
    }
  }

  return (
    <Pagination {...props}>
      {items}
    </Pagination>
  )
}