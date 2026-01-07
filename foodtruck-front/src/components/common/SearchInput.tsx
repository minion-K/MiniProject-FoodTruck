import styled from '@emotion/styled';
import React from 'react'

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchInput ({value, onChange, placeholder}: Props) {
  return (
    <SearchWrapper>
      <input 
        type="text"
        value={value}
        placeholder={placeholder || "검색어를 입력하세요"}
        onChange={(e) => {onChange(e.target.value)}}
      />
    </SearchWrapper>
  )
}

export default SearchInput

const SearchWrapper = styled.div`
  margin-bottom: 12px;

  input {
    width: 100%;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 14px;
  }
`;