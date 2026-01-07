import styled from '@emotion/styled';
import React from 'react'

interface Props {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  placeholder?: string;
}

function SearchInput ({value, onChange, onKeyDown, onSearch, placeholder}: Props) {
  return (
    <SearchWrapper>
      <Input 
        type="text"
        value={value}
        placeholder={placeholder || "검색어를 입력하세요"}
        onChange={(e) => {onChange(e.target.value)}}
        onKeyDown={onKeyDown}
      />
      <Button onClick={onSearch}>검색</Button>
    </SearchWrapper>
  )
}

export default SearchInput

const SearchWrapper = styled.div`
  display: flex;
  gap: 4px;
  width: 100%;
  ;
`;
const Input = styled.input` 
  flex: 1;
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
`;
const Button = styled.button`
  padding: 8px 12px;
  background-color: #ff6b00;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #e65a00;
  }
`;