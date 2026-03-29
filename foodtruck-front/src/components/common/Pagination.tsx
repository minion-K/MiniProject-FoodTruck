import styled from '@emotion/styled';
import React from 'react'

type Props = {
  page: number;
  totalPage: number;
  onChange: (page: number) => void;
  maxVisible?: number;
}

function Pagination({
  page,
  totalPage,
  onChange,
  maxVisible = 5
}: Props) {
  const getPageNumbers = () => {
    const pages = [];

    let start = Math.max(0, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible;

    if(end > totalPage) {
      end = totalPage;
      start = Math.max(0, end - maxVisible);
    }

    for(let i = start; i < end; i++) {
      pages.push(i);
    }

    return {pages, start, end}
  }

  const {pages, start, end} = getPageNumbers();

  return (
    <Wrapper>
      <PageButton
          disabled={page ===0} 
          onClick={() => onChange(0)}>
            «
        </PageButton>
        <PageButton
          disabled={page === 0} 
          onClick={() => onChange(page - 1)}>
            ‹
        </PageButton>

        {start > 0 && (
          <>
            <PageNumber onClick={() => onChange(0)}>1</PageNumber>
            {start > 1 && <Ellipsis>...</Ellipsis>}
          </>
        )}

        {pages.map(p => (
          <PageNumber
            key={p}
            active={p === page}
            onClick={() => onChange(p)}
          >
            {p + 1}
          </PageNumber>
        ))}

        {end < totalPage && (
          <>
            {end < totalPage - 1 && <Ellipsis>...</Ellipsis>}
            <PageNumber onClick={() => onChange(totalPage - 1)}>
              {totalPage}
            </PageNumber>
          </>
        )}
        <PageButton
          disabled={page + 1 >= totalPage} 
          onClick={() => onChange(page + 1)}>
            ›
        </PageButton>
        <PageButton
          disabled={page + 1 >= totalPage} 
          onClick={() => onChange(totalPage - 1)}>
            »
        </PageButton>
    </Wrapper>
  )
}

export default Pagination

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

const PageButton = styled.button`
  border: none;
  background: #f3f4f6;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed
  }

  &:hover:not(:disabled) {
    background: #e5e7eb;
  }
`;

const PageNumber = styled.button<{active?: boolean}>`
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;

  background: ${({active}) => active ? "#3b82f6" : "#f3f4f6"};
  color: ${({active}) => active ? "white" : "#374151"};
  font-weight: ${({active}) => active ? "600" : "400"};

  &:hover {
    background: ${({active}) => active ? "#2563eb" : "#e5e7eb"};
  }
`;

const Ellipsis = styled.span`
  padding: 0 6px;
  color: #9ca3af;
`;

