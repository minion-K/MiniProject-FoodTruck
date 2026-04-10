import { paymentApi } from "@/apis/payment/payment.api";
import Pagination from "@/components/common/Pagination";
import SearchInput from "@/components/common/SearchInput";
import PaymentFilter from "@/components/payment/PaymentFilter";
import type { PaymentResponse } from "@/types/payment/payment.dto";
import type { PaymentStatus } from "@/types/payment/payment.type";
import { getErrorMsg } from "@/utils/error";
import { getPaymentMethod } from "@/utils/paymentMethod";
import { getPaymentStatus } from "@/utils/paymentStatus";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";

function MyPayment() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<PaymentStatus | "ALL">("ALL");

  const fetchMyPayments = async () => {
    setLoading(true);

    try {
      const res = await paymentApi.getMyPayments({
        page,
        size: 10,
        keyword: keyword || undefined,
        status: status === "ALL" ? undefined : status
      });

      setPayments(res.content);
      setTotalPage(res.totalPage)
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setPage(0);
  }, [status, keyword]);

  useEffect(() => {
    fetchMyPayments();
  }, [page, status, keyword]);

  const handleSearch = () => setKeyword(searchInput);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  if (loading) return <LoadingMsg>결제 내역 불러오는 중...</LoadingMsg>;

  return (
    <Container>
      <Header>결제 내역</Header>

      <FilterRow>
        <SearchWrapper>
          <PaymentFilter
            status={status}
            onStatusChange={setStatus}
          />
          <SearchBox>
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              onKeyDown={handleKeyDown}
              onSearch={handleSearch}
              placeholder="트럭명을 입력하세요."
            />
          </SearchBox>
        </SearchWrapper>
      </FilterRow>

      {payments.length > 0 ? (
        payments?.map((payment) => {
          const status = getPaymentStatus(payment.status);
          const method = getPaymentMethod(payment.method);
  
          return (
            <Card key={payment.paymentKey}>
              <Row>
                <Title>{payment.productName}</Title>
                <StatusColumn>
                  <Status style={{ backgroundColor: status.color }}>
                    {status.label}
                  </Status>
                </StatusColumn>
              </Row>
  
              <Info>
                결제일 : {new Date(payment.requestedAt).toLocaleString()}
              </Info>
              <Info>결제 금액 : {payment.amount.toLocaleString()} KRW</Info>
              <Info>결제 수단 : {method}</Info>
            </Card>
          );
        })
      ) : (
        <Empty>결제 내역이 없습니다.</Empty>
      )}
      <Pagination 
        page={page}
        totalPage={totalPage}
        onChange={setPage}
      />
    </Container>
  );
}

export default MyPayment;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.h1`
  font-size: 24px;
  font-weight: 600;
`;

const LoadingMsg = styled.div``;

const Empty = styled.div`
  text-align: center;
  color: #888;
  margin-top: 80px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
`;

const SearchWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const SearchBox = styled.div`
  width: 280px;
  flex-shrink: 0;
`;

const Card = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  cursor: default;
  border: 1px solid #eee;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const StatusColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Status = styled.div`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;
  width: fit-content;
`;

const Info = styled.div`
  margin: 4px 0;
  font-size: 14px;
  color: #555;
`;
