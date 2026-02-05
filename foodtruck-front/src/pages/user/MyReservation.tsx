import { reservationApi } from "@/apis/reservation/reservation.api";
import SearchInput from "@/components/common/SearchInput";
import ReservationFilter from "@/components/reservation/ReservationFilter";
import { type ReservationListResponse } from "@/types/reservation/reservation.dto";
import { formatPickupRange, formatTime } from "@/utils/date";
import { getErrorMsg } from "@/utils/error";
import { getPaymentStatus } from "@/utils/paymentStatus";
import { getReservationStatus } from "@/utils/reservationStatus";
import styled from "@emotion/styled";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyReservation() {
  const [reservations, setReservations] = useState<ReservationListResponse>([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationApi.getReservationList();

        setReservations(data);
      } catch (err) {
        getErrorMsg(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      if (statusFilter !== "ALL" && res.status !== statusFilter) return false;

      if (search && !res.truckName.toLowerCase().includes(search.toLowerCase()))
        return false;

      return true;
    });
  }, [reservations, statusFilter, search]);

  if (loading) return <LoadingMsg>예약 내역 불러오는 중...</LoadingMsg>;

  if (reservations.length === 0) {
    return <Empty>예약 내역이 없습니다.</Empty>;
  }

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Container>
      <Header>예약 목록</Header>

      <FilterRow>
        <SearchWrapper>
          <ReservationFilter
            status={statusFilter}
            onStatusChange={setStatusFilter}
          />

          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onKeyDown={handleKeyDown}
            onSearch={handleSearch}
            placeholder="검색어를 입력하세요."
          />
        </SearchWrapper>
      </FilterRow>

      {filteredReservations.map((reservation) => {
        const payment = getPaymentStatus(reservation.paymentStatus);
        const status = getReservationStatus(reservation.status);

        return (
          <Card
            key={reservation.id}
            onClick={() => navigate(`/mypage/reservation/${reservation.id}`)}
          >
            <Row>
              <Title>{reservation.truckName}</Title>

              <StatusColumn>
                <Status style={{ backgroundColor: status.color }}>
                  {status.label}
                </Status>

                {reservation.status !== "CANCELED" && (
                  <PaymentStatus style={{ backgroundColor: payment.color }}>
                    {payment.label}
                  </PaymentStatus>
                )}
              </StatusColumn>
            </Row>

            <Location>{reservation.locationName}</Location>

            <Info>픽업 시간: {formatPickupRange(reservation.pickupTime)}</Info>
            <Info>
              결제 금액: {reservation.totalAmount?.toLocaleString() ?? "-s"} KRW
            </Info>
          </Card>
        );
      })}
    </Container>
  );
}

export default MyReservation;

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
  cursor: pointer;
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

const Location = styled.div`
  font-size: 13px;
  color: #777;
  margin-bottom: 8px;
`;

const Info = styled.div`
  margin: 4px 0;
  font-size: 14px;
  color: #555;
`;

const Empty = styled.div`
  text-align: center;
  color: #888;
  margin-top: 80px;
`;

const Status = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;
`;

const StatusColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const PaymentStatus = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;
  width: fit-content;
`;
