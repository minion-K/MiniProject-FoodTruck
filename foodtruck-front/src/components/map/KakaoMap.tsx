import React, { useEffect, useRef } from 'react'

interface Marker {
  lat: number;
  lng: number;
}

interface Props {
  center: {
    lat: number;
    lng: number;
  };
  markers: Marker[]
  level?: number;
}

function KakaoMap({center, markers, level = 4}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<kakao.maps.Marker[]>([]);
  
  useEffect(() => {
    if(!mapRef.current) return;
    if(!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      if(!mapInstance.current) {
        mapInstance.current = new window.kakao.maps.Map(
          mapRef.current!,
          {
            center: new window.kakao.maps.LatLng(center.lat, center.lng),
            level
          }
        );
      }
      const map = mapInstance.current;
  
      map.setCenter(
        new window.kakao.maps.LatLng(center.lat, center.lng)
      );
  
      markerInstance.current.forEach(marker => marker.setMap(null));
      markerInstance.current = [];
  
      markers.forEach(marker => {
        const pos = new window.kakao.maps.LatLng(marker.lat, marker.lng);
        const mk = new window.kakao.maps.Marker({
          position: pos
        });
        
        mk.setMap(map);
        markerInstance.current.push(mk);
      }); 
    });
  }, [center, markers, level])
  
  return (
    <div
      ref={mapRef}
      style={{width: "100%", height: "100%"}}
    />
  )
}

export default KakaoMap
