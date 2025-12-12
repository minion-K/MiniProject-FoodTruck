package org.example.foodtruckback.controller.truck;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.truck.TruckApi;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.truck.request.TruckCreateRequestDto;
import org.example.foodtruckback.dto.truck.request.TruckUpdateRequestDto;
import org.example.foodtruckback.dto.truck.response.TruckDetailResponseDto;
import org.example.foodtruckback.dto.truck.response.TruckListItemResponseDto;
import org.example.foodtruckback.service.truck.TruckService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(TruckApi.ROOT)
@RequiredArgsConstructor
public class TruckController {

    private final TruckService truckService;

    @PostMapping
    public ResponseEntity<ResponseDto<TruckDetailResponseDto>> createTruck(
            @Valid @RequestBody TruckCreateRequestDto request
    ) {
        ResponseDto<TruckDetailResponseDto> data = truckService.createTruck(request);
        return ResponseEntity.ok(data);
    }

    @GetMapping(TruckApi.BY_ID)
    public ResponseEntity<ResponseDto<TruckDetailResponseDto>> getTruck(
            @PathVariable Long truckId
    ) {
        ResponseDto<TruckDetailResponseDto> data = truckService.getTruck(truckId);
        return ResponseEntity.ok(data);
    }

    @GetMapping
    public ResponseEntity<ResponseDto<List<TruckListItemResponseDto>>> getAllTrucks() {

        ResponseDto<List<TruckListItemResponseDto>> data =
                truckService.getAllTrucks();

        return ResponseEntity.ok(data);
    }

    @PutMapping(TruckApi.BY_ID)
    public ResponseEntity<ResponseDto<TruckDetailResponseDto>> updateTruck(
            @PathVariable Long truckId,
            @Valid @RequestBody TruckUpdateRequestDto request
    ) {
        ResponseDto<TruckDetailResponseDto> data = truckService.updateTruck(truckId, request);
        return ResponseEntity.ok(data);
    }

    @DeleteMapping(TruckApi.BY_ID)
    public ResponseEntity<ResponseDto<?>> deleteTruck(
            @PathVariable Long truckId
    ) {
        ResponseDto<?> data = truckService.deleteTruck(truckId);
        return ResponseEntity.ok(data);
    }
}
