import { userApi } from '@/apis/user/user.api';
import Pagination from '@/components/common/pagination';
import SearchInput from '@/components/common/SearchInput';
import type { RoleType } from '@/types/role/role.type';
import type { UserListItemResponse } from '@/types/user/user.dto';
import { toKstString } from '@/utils/date';
import { getErrorMsg } from '@/utils/error';
import { getRoleInfo } from '@/utils/role';
import { getUserStatus } from '@/utils/userStatus';
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

type StatusFilter = "ALL" | "ACTIVE" | "TEMP";
type SortKey = "createdAt" | "email";

function AdminUserPage() {
  const [activeTab, setActiveTab] = useState<RoleType>("USER");
  const [keyword, setKeyword] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [users, setUsers] = useState<UserListItemResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const roles: RoleType[] = ["USER" , "OWNER" , "ADMIN"];

  const fetchUsers = async () => {
    setLoading(true)

    try {
      const res = await userApi.getUserList({
        role: activeTab,
        page,
        size: 10,
        keyword: keyword || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        sortKey
      });
      
      setUsers(res.content);
      setTotalPage(res.totalPages);
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
  }, [activeTab, statusFilter, sortKey]);

  useEffect(() => {
    fetchUsers();
  }, [activeTab, page, statusFilter, sortKey]);

  const handleChangeStatus = async (user: UserListItemResponse) => {
    const newStatus = user.status === "ACTIVE" ? "TEMP" : "ACTIVE";
    const statusInfo = getUserStatus(newStatus);

    if(!window.confirm(
      `${user.name}님의 상태를 ${statusInfo.label}로 변경하시겠습니까?`))
      return;

    try {
      await userApi.toggleStatus(user.id);

      toast.success(`${user.name}님의 상태가 변경되었습니다.`);
      fetchUsers();
    } catch (e) {
        alert(getErrorMsg(e));
    }
  }

  const handleChangeRole = async (
    user: UserListItemResponse,  
    newRole: RoleType
  ) => {
    const currentRole = user.roles?.[0] ?? "USER";
    if(newRole === currentRole) return;

    const roleLabel = newRole === "USER" 
      ? "일반 회원"
      : newRole === "OWNER" 
      ? "트럭 운영자" : "관리자"
    if(!window.confirm(`권한을 "${roleLabel}"로 변경하시겠습니까?`)) return;

    try {
      await userApi.delete(user.id, user.roles[0]);
      await userApi.add(user.id, {roleName: newRole});

      fetchUsers();
      toast.success("권한이 변경되었습니다.");
    } catch (e) {
      alert(getErrorMsg(e));
    }
  }
  
  return (
    <Container>
      <HeaderRow>
        <Title>유저 관리</Title>
      </HeaderRow>

      <Tabs>
        <Tab 
          active={activeTab === "USER"} 
          onClick={() => setActiveTab("USER")}
        >
          일반 회원
        </Tab>
        <Tab 
          active={activeTab === "OWNER"} 
          onClick={() => setActiveTab("OWNER")}
        >
          트럭 운영자
        </Tab>
        <Tab 
          active={activeTab === "ADMIN"}
          onClick={() => setActiveTab("ADMIN")}
        >
          관리자
        </Tab>
      </Tabs>
      
      <FilterRow>
        <LeftWrapper>
          <Select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="ALL">전체</option>
            <option value="ACTIVE">활성</option>
            <option value="TEMP">정지</option>
          </Select>

          <Select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="createdAt">가입일순</option>
            <option value="email">이메일순</option>
          </Select>
        </LeftWrapper>
        
        <RightWrapper>
          <SearchInput 
            value={keyword}
            onChange={setKeyword}
            onSearch={() => fetchUsers()}
            onEnter={true}
            placeholder="이름 또는 이메일로 검색해주세요."
          />
        </RightWrapper>
      </FilterRow>

      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th style={{width:"5%"}}>ID</th>
              <th style={{width:"10%"}}>이름</th>
              <th style={{width:"20%"}}>이메일</th>
              <th style={{width:"15%"}}>휴대폰번호</th>
              <th style={{width:"10%"}}>상태</th>
              <th style={{width:"15%"}}>권한</th>
              <th style={{width:"15%"}}>가입일</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <Loading>로딩 중...</Loading>
                </td>
              </tr>
            ) : (
              users.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyText>데이터 없음</EmptyText>
                  </td>
                </tr>
              ) : (
                users
                  .map(user => {
                    const statusInfo = getUserStatus(user.status);
                    const primaryRole = user.roles?.[0] ?? "USER";
                    const roleInfo = getRoleInfo(primaryRole);
    
                    return (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone ?? "-"}</td>
                        <td>
                          <StatusButton 
                            style={{background: statusInfo.color}}
                            onClick={() => handleChangeStatus(user)}>
                            {statusInfo.label}
                          </StatusButton>
                        </td>
                        <td>
                          <RoleSelect
                            style={{background: roleInfo.color}}
                            role={primaryRole}
                            value={primaryRole}
                            onChange={(e) => handleChangeRole(user, e.target.value as RoleType)}
                          >
                            {roles.map(role => {
                              const info = getRoleInfo(role);
    
                              return (
                                <option key={role} value={role}>
                                  {info.label}
                                </option>
                              )
                            })}
                          </RoleSelect>
                        </td>
                        <td>{user.createdAt}</td>
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

export default AdminUserPage

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

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
`;

const Tabs = styled.div`
  display: flex;
  gap: 10px;
`;

const Tab = styled.button<{active?: boolean}>`
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  border: none;
  background: ${({active}) => active ? "#3b82f6" : "#f3f4f6"};
  color: ${({active}) => active ? "white" : "#374151"};
  cursor: pointer;

  &:hover {
    background: ${({active}) => active ? "#2563eb" : "#f3f4f6"}
  }
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

const StatusButton = styled.button`
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
`;

const RoleSelect = styled.select`
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  outline: none;

  option {
    background: white;
    color: black;
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