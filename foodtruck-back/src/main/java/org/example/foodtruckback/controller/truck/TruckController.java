package org.example.foodtruckback.controller.truck;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.truck.TruckApi;
import org.example.foodtruckback.common.enums.TruckStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.truck.request.TruckCreateRequestDto;
import org.example.foodtruckback.dto.truck.request.TruckStatusUpdateRequestDto;
import org.example.foodtruckback.dto.truck.request.TruckUpdateRequestDto;
import org.example.foodtruckback.dto.truck.response.TruckCountResponseDto;
import org.example.foodtruckback.dto.truck.response.TruckDetailResponseDto;
import org.example.foodtruckback.dto.truck.response.TruckPageResponseDto;
import org.example.foodtruckback.service.truck.TruckService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(TruckApi.ROOT)
@RequiredArgsConstructor
public class TruckController {

    private final TruckService truckService;

    @PostMapping
    public ResponseEntity<ResponseDto<TruckDetailResponseDto>> createTruck(
            @Valid @RequestBody TruckCreateRequestDto request
    ) {
        ResponseDto<TruckDetailResponseDto> response = truckService.createTruck(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping(TruckApi.BY_ID)
    public ResponseEntity<ResponseDto<TruckDetailResponseDto>> getTruckById(
            @PathVariable Long truckId
    ) {
        ResponseDto<TruckDetailResponseDto> response = truckService.getTruckById(truckId);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ResponseDto<TruckPageResponseDto>> getAllTrucks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TruckStatus status
    ) {
        Pageable pageable = PageRequest.of(page, size);
        ResponseDto<TruckPageResponseDto> response = truckService.getAllTrucks(pageable, keyword, status);

        return ResponseEntity.ok(response);
    }

    @GetMapping(TruckApi.OWNER)
    public ResponseEntity<ResponseDto<TruckPageResponseDto>> getOwnerTrucks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        ResponseDto<TruckPageResponseDto> response = truckService.getOwnerTrucks(pageable);

        return ResponseEntity.ok(response);
    }

    @PutMapping(TruckApi.BY_ID)
    public ResponseEntity<ResponseDto<TruckDetailResponseDto>> updateTruck(
            @PathVariable Long truckId,
            @Valid @RequestBody TruckUpdateRequestDto request
    ) {
        ResponseDto<TruckDetailResponseDto> response = truckService.updateTruck(truckId, request);

        return ResponseEntity.ok(response);
    }

    @PutMapping(TruckApi.STATUS)
    public ResponseEntity<ResponseDto<Void>> updateTruckStatus(
            @PathVariable Long truckId,
            @RequestBody TruckStatusUpdateRequestDto request
    ) {
        ResponseDto<Void> response = truckService.updateTruckStatus(truckId, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping(TruckApi.BY_ID)
    public ResponseEntity<ResponseDto<Void>> deleteTruck(
            @PathVariable Long truckId
    ) {
        ResponseDto<Void> response = truckService.deleteTruck(truckId);

        return ResponseEntity.ok(response);
    }

    @GetMapping(TruckApi.COUNT)
    public ResponseEntity<ResponseDto<TruckCountResponseDto>> getTruckCount() {
        ResponseDto<TruckCountResponseDto> response = truckService.getTruckCount();

        return ResponseEntity.ok(response);
    }
}
