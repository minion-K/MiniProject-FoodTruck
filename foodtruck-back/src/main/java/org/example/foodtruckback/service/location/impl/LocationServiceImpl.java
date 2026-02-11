package org.example.foodtruckback.service.location.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.location.request.LocationCreateRequestDto;
import org.example.foodtruckback.dto.location.request.LocationUpdateRequestDto;
import org.example.foodtruckback.dto.location.response.LocationDetailResponseDto;
import org.example.foodtruckback.dto.location.response.LocationListItemResponseDto;
import org.example.foodtruckback.entity.location.Location;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.location.LocationRepository;
import org.example.foodtruckback.repository.schedule.ScheduleRepository;
import org.example.foodtruckback.repository.user.UserRepository;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.location.LocationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LocationServiceImpl implements LocationService {
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    // create location
    @Override
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Transactional
    public ResponseDto<LocationDetailResponseDto> createLocation(
            UserPrincipal principal, LocationCreateRequestDto request
    ) {
        boolean exists = locationRepository.existsByAddress(request.address());

        if(exists) {
            throw new BusinessException(ErrorCode.DUPLICATE_LOCATION);
        }

        Location location = Location.builder()
                .name(request.name())
                .address(request.address())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .build();

        Location saved = locationRepository.save(location);
        LocationDetailResponseDto response = LocationDetailResponseDto.from(saved);

        return ResponseDto.success("스팟 생성 완료", response);
    }

    // get location (All)
    @Override
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseDto<List<LocationListItemResponseDto>> getAllLocation() {
        List<LocationListItemResponseDto> response = locationRepository.findAll().stream()
                .map(LocationListItemResponseDto::from)
                .toList();

        return ResponseDto.success("조회 성공", response);
    }

    // get location (byId)
    @Override
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseDto<LocationDetailResponseDto> getLocationById(Long locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.LOCATION_NOT_FOUND));
        LocationDetailResponseDto response = LocationDetailResponseDto.from(location);

        return ResponseDto.success("조회 성공", response);
    }

    // update location
    @Override
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Transactional
    public ResponseDto<LocationDetailResponseDto> updateLocation(
            UserPrincipal principal, Long locationId, LocationUpdateRequestDto request
    ) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.LOCATION_NOT_FOUND));

        boolean usedByOtherTruck = scheduleRepository.existsByLocationAndOtherOwner(location, principal.getId());

        if(usedByOtherTruck) {
            throw new BusinessException(ErrorCode.LOCATION_IN_USE_BY_OTHER_TRUCK);
        }

        boolean exists = locationRepository.existsByAddress(request.address());
        boolean isChangeAddress = !location.getAddress().equals(request.address());

        if(exists && isChangeAddress) {
            throw new BusinessException(ErrorCode.DUPLICATE_LOCATION);
        }

        location.updatedLocation(
                request.name(),
                request.address(),
                request.latitude(),
                request.longitude()
        );

        LocationDetailResponseDto response = LocationDetailResponseDto.from(location);

        return ResponseDto.success("수정 완료", response);
    }

    // delete location
    @Override
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Transactional
    public ResponseDto<Void> deleteLocation(UserPrincipal principal, Long locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.LOCATION_NOT_FOUND));

        boolean isUsed = scheduleRepository.existsByLocationId(locationId);

        if(isUsed) {
            throw new BusinessException(ErrorCode.LOCATION_IN_USE);
        }

        locationRepository.delete(location);

        return ResponseDto.success("삭제 성공");
    }
}
