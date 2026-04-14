package org.example.foodtruckback.service.truck;

import jakarta.validation.Valid;
import org.example.foodtruckback.common.enums.TruckStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.truck.request.TruckCreateRequestDto;
import org.example.foodtruckback.dto.truck.request.TruckStatusUpdateRequestDto;
import org.example.foodtruckback.dto.truck.request.TruckUpdateRequestDto;
import org.example.foodtruckback.dto.truck.response.TruckCountResponseDto;
import org.example.foodtruckback.dto.truck.response.TruckDetailResponseDto;
import org.example.foodtruckback.dto.truck.response.TruckListItemResponseDto;
import org.example.foodtruckback.dto.truck.response.TruckPageResponseDto;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TruckService {
    ResponseDto<TruckDetailResponseDto> createTruck(@Valid TruckCreateRequestDto request, Long userId);

    ResponseDto<TruckDetailResponseDto> getTruckById(Long truckId);

    ResponseDto<TruckPageResponseDto> getAllTrucks(Pageable pageable, String keyword, TruckStatus status);

    ResponseDto<TruckPageResponseDto>getOwnerTrucks(Long userId, Pageable pageable);

    ResponseDto<TruckDetailResponseDto> updateTruck(Long truckId, @Valid TruckUpdateRequestDto request, Long userId);

    ResponseDto<Void> deleteTruck(Long truckId, Long userId);

    ResponseDto<Void> updateTruckStatus(Long truckId, TruckStatusUpdateRequestDto request, UserPrincipal principal);

    ResponseDto<TruckCountResponseDto> getTruckCount(UserPrincipal principal);
}
