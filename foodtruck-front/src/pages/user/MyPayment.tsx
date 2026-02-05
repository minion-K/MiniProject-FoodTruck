import { paymentApi } from "@/apis/payment/payment.api";
import SearchInput from "@/components/common/SearchInput";
import PaymentFilter from "@/components/payment/PaymentFilter";
import type { PaymentResponseList } from "@/types/payment/payment.dto";
import type { PaymentStatus } from "@/types/payment/payment.type";
import { getErrorMsg } from "@/utils/error";
import { getPaymentMethod } from "@/utils/paymentMethod";
import { getPaymentStatus } from "@/utils/paymentStatus";
import styled from "@emotion/styled";
import React, { useEffect, useMemo, useState } from "react";

function MyPayment() {
  const [payments, setPayments] = useState<PaymentResponseList>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchMyPayments = async () => {
      try {
        const res = await paymentApi.getMyPayments();

        setPayments(res);
      } catch (e) {
        setError(getErrorMsg(e));
      } finally {
        setLoading(false);
      }
    };

    fetchMyPayments();
  }, []);

  const filterPayments = useMemo(() => {
    return payments
      ?.filter((payment) => {
        if (statusFilter === "ALL") return true;
        if (statusFilter === "CANCELLED_REFUNDED") {
          return (
            payment.status === "CANCELLED" || payment.status === "REFUNDED"
          );
        }

        return payment.status === statusFilter;
      })
      .filter((payment) => {
        if (!search) return true;
        return payment.productName.toLowerCase().includes(search.toLowerCase());
      });
  }, [payments, search, statusFilter]);

  if (loading) return <LoadingMsg>결제 내역 불러오는 중...</LoadingMsg>;
  if (error) return <ErrorMsg>{error}</ErrorMsg>;
  if (!payments?.length) return <Empty>결제 내역이 없습니다.</Empty>;

  const handleSearch = () => setSearch(searchInput);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Container>
      <Header>결제 내역</Header>

      <FilterRow>
        <SearchWrapper>
          <PaymentFilter
            status={statusFilter}
            onStatusChange={setStatusFilter}
          />

          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onKeyDown={handleKeyDown}
            onSearch={handleSearch}
            placeholder="트럭명 검색"
          ></SearchInput>
        </SearchWrapper>
      </FilterRow>

      {filterPayments?.map((payment) => {
        const status = getPaymentStatus(payment.status);
        const method = getPaymentMethod(payment.method);

        return (
          <Card key={payment.paymentKey}>
            <Row>
              <Title>{payment.productName}</Title>
              <StatusColumn>
                <PaymentStatus style={{ backgroundColor: status.color }}>
                  {status.label}
                </PaymentStatus>
              </StatusColumn>
            </Row>

            <Info>
              결제일 : {new Date(payment.requestedAt).toLocaleString()}
            </Info>
            <Info>결제 금액 : {payment.amount.toLocaleString()} KRW</Info>
            <Info>결제 수단 : {method}</Info>
          </Card>
        );
      })}
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

const ErrorMsg = styled.div`
  color: red;
`;

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
  flex: 1;
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

const PaymentStatus = styled.div`
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
