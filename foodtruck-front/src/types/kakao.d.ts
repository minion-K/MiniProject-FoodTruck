export {}

declare global {
  interface Window {
    kakao: typeof Kakao;
  }
  namespace kakao {
    namespace maps {
      class LatLng {
        constructor(lat: number, lng: number);
      }
    
      class Map {
        constructor(
          container: HTMLElement,
          options: {
            center: LatLng,
            lavel?: number;
          }
        );
    
        setCenter(latlng: LatLng): void;
      }
    
      class Marker {
        constructor(
          options: {
            map?: Map;
            position: LatLng;
          }
        );
    
        setMap(map: Map | null): void;
      }
    }
  }
}