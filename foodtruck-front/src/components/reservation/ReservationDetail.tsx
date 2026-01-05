import React from 'react'

interface Props {
  reservationId: string;
}

function ReservationDetail({reservationId}: Props) {
  return (
    <h1>
      예약 상세 페이지
    </h1>
  )
}

export default ReservationDetail
