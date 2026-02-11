package org.example.foodtruckback.service.truck;

import jakarta.validation.Valid;
import org.example.foodtruckback.common.enums.TruckStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.truck.request.TruckCreateRequestDto;
import org.example.foodtruckback.dto.truck.request.TruckStatusUpdateRequestDto;
import org.example.foodtruckback.dto.truck.request.TruckUpdateRequestDto;
import org.example.foodtruckback.dto.truck.response.TruckDetailResponseDto;
import org.example.foodtruckback.dto.truck.response.TruckListItemResponseDto;

import java.util.List;

public interface TruckService {
    ResponseDto<TruckDetailResponseDto> createTruck(@Valid TruckCreateRequestDto request);

    ResponseDto<TruckDetailResponseDto> getTruckById(Long truckId);

    ResponseDto<List<TruckListItemResponseDto>> getAllTrucks();

    ResponseDto<List<TruckListItemResponseDto>> getOwnerTrucks();

    ResponseDto<TruckDetailResponseDto> updateTruck(Long truckId, @Valid TruckUpdateRequestDto request);

    ResponseDto<Void> deleteTruck(Long truckId);

    ResponseDto<Void> updateTruckStatus(Long truckId, TruckStatusUpdateRequestDto request);
}
