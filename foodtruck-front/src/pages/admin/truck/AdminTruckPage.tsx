import { truckApi } from '@/apis/truck/truck.api';
import Pagination from '@/components/common/Pagination';
import SearchInput from '@/components/common/SearchInput';
import { type TruckCountResponse, type TruckListItemResponse } from '@/types/truck/truck.dto';
import type { TruckStatus } from '@/types/truck/truck.type';
import { formatDateTime } from '@/utils/date';
import { getErrorMsg } from '@/utils/error';
import { getTruckStatus } from '@/utils/TruckStatus';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

type StatusFilter = "ALL" | TruckStatus;

function AdminTruckPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [keyword, setKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [trucks, setTrucks] = useState<TruckListItemResponse[]>([]);
  const [count, setCount] = useState<TruckCountResponse>();
  const [loading, setLoading] = useState(false);

  const fetchTrucks = async () => {
    setLoading(true);

    try {
      const res = await truckApi.getTruckList({
        page,
        size: 10,
        keyword: keyword || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter
      });

      setTrucks(res.content);
      setTotalPage(res.totalPage);
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchTruckCount = async () => {
      try {
        const res = await truckApi.truckCount();

        setCount(res);
      } catch (e) {
        alert(getErrorMsg(e));
      }
    }

    fetchTruckCount();
  } ,[]);

  useEffect(()=> {
    setPage(0);
  }, [statusFilter]);

  useEffect(() => {
    fetchTrucks();
  }, [page, statusFilter])

  const handleChangeStatus = async (
    truck: TruckListItemResponse, 
    newStatus: TruckStatus
  ) => {
    const confirmMsg = 
      newStatus === "ACTIVE"
        ? `${truck.name}의 정지를 해제하시겠습니까?`
        : `${truck.name}의 운영을 정지하시겠습니까?`;

    if(!window.confirm(confirmMsg)) return ;
    setLoading(true);

    try {
      await truckApi.updateTruckStatus(truck.id, {status: newStatus});

      toast.success(`${truck.name}의 상태가 변경되었습니다.`)
      fetchTrucks();
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  } 

  return (
    <Container>
      <HeaderRow>
        <Title>트럭 관리</Title>
        <RightInfo>
          <CountWrapper>
            <CountItem>
              <Label>
                전체:
              </Label>
              <CountValue>
                {count?.total ?? 0}
              </CountValue>
            </CountItem>
            <Divider>|</Divider>
            <CountItem>
              <Label>
                운영중:
              </Label>
              <CountValue>
                {count?.active ?? 0}
              </CountValue>
            </CountItem>
            <Divider>|</Divider>
            <CountItem>
              <Label>
                정지:
              </Label>
              <CountValue>
                {count?.suspended ?? 0}
              </CountValue>
            </CountItem>
          </CountWrapper>
        </RightInfo>
      </HeaderRow>

      <FilterRow>
        <LeftWrapper>
          <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="">전체</option>
            <option value="ACTIVE">OPEN</option>
            <option value="INACTIVE">CLOSE</option>
            <option value="SUSPENDED">운영 정지</option>
          </Select>
        </LeftWrapper>

        <RightWrapper>
          <SearchInput 
            value={keyword}
            onChange={setKeyword}
            onSearch={() => {fetchTrucks()}}
            onEnter={true}
            placeholder="트럭명으로 검색하세요."
          />
        </RightWrapper>
      </FilterRow>

      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th style={{width: "5%"}}>ID</th>
              <th style={{width: "10%"}}>트럭명</th>
              <th style={{width: "10%"}}>음식 종류</th>
              <th style={{width: "15%"}}>운영자 ID</th>
              <th style={{width: "10%"}} className="center">운영자 이름</th>
              <th style={{width: "10%"}} className="center">상태</th>
              <th style={{width: "20%"}} className="center">생성일</th>
              <th style={{width: "10%"}} className="center">관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <Loading>로딩 중...</Loading>
                </td>
              </tr>
            ) : (
              trucks.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyText>데이터 없음</EmptyText>
                  </td>
                </tr>
              ) : (
                trucks.map(truck => {
                  const status = getTruckStatus(truck.status);
    
                  return (
                    <tr key={truck.id}>
                      <td>{truck.id}</td>
                      <td>{truck.name}</td>
                      <td>{truck.cuisine || "-"}</td>
                      <td>
                        <EllipsisText title={truck.ownerLoginId}>
                          {truck.ownerLoginId}
                        </EllipsisText>
                      </td>
                      <td title={truck.ownerLoginId} className="center">{truck.ownerName}</td>
                      <td className="center">
                        <StatusWrapper>
                          <StatusBadge style={{background: status.bg, color: status.color}}>
                            {status.label}
                          </StatusBadge>
                        </StatusWrapper>
                      </td>
                      <td className="center">{formatDateTime(truck.createdAt)}</td>
                      <td className="center">
                        {truck.status === "SUSPENDED" ? (
                          <ActionButton
                            disabled={loading}
                            onClick={() => handleChangeStatus(truck, "INACTIVE")}
                          >
                            {loading ? "처리 중" : "정지 해제"}
                          </ActionButton>
                        ) : (
                          <DangerButton 
                            disabled={loading}
                            onClick={() => handleChangeStatus(truck, "SUSPENDED")}
                          >
                            {loading ? "처리 중" : "운영 정지"}
                          </DangerButton>
                        )}
                      </td>
                    </tr>
                  )
                })
              )  
            )}
          </tbody>
        </StyledTable>
      </TableWrapper>

      <Pagination 
        page={page}
        totalPage={totalPage}
        onChange={setPage}
      />
    </Container>
  )
}

export default AdminTruckPage

const Container = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RightInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`;

const CountItem = styled.div`
  display: flex;
  align-items: center;
  line-height: 1;
  font-size: 13px;
`;

const Label = styled.div`
  font-size: 13px;
  color: #666;
  margin-right: 3px;
`;

const CountValue = styled.div`
  color: #111827;
  font-weight: 600;
`;

const Divider = styled.span`
  font-size: 13px;
  color: #666;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
`;
const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const LeftWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const RightWrapper = styled.div`
  width: 280px;
`;

const Select = styled.select`
  height: 36px;
  padding: 0px 10px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
`;


const TableWrapper = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow-x: auto;
  background: white;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
  table-layout: fixed;

  th, td {
    padding: 12px 16px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid #f1f1f1;
    white-space: nowrap;
  }
  
  th.center, td.center {
    text-align: center;
  }

  th {
    background: #f3f4f6;
    font-weight: 600;
    font-size: 13px;
    color: #374151;
  }

  tbody tr:hover {
    background: #f9fafb;
  }
`;

const EllipsisText = styled.div`
  display: inline-block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const StatusBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  width: 90px;
  padding: 2px 6px;
  border-radius: 8px;
  text-align: center;
  white-space: nowrap;
`;

const ActionButton = styled.button<{disabled?: boolean}>`
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 6px;
  border: none;
  cursor: ${({disabled}) => disabled ? "not-allowed" : "pointer"};
  background: #e0f2fe;
  color: #0284c7;
  opacity: ${({disabled}) => disabled ? "0.6" : ''};

  &:hover {
    background: #bae6fd;
    color: #0369a1;
  }
`;

const DangerButton = styled(ActionButton)`
  background: #fee2e2;
  color: #dc2626;

  &:hover {
    background-color: #fca5a5;
    color: #b91c1c;
  }
`;

const Loading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
`;

const EmptyText = styled(Loading)``;