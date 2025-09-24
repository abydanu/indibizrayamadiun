'use client';

import type React from 'react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  MapPin,
  Navigation,
  MapIcon,
  Satellite,
  Search,
  X,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

declare global {
  interface Window {
    L: any;
  }
}

interface LocationPickerProps {
  value?: string;
  onChange?: (coordinates: string) => void;
  className?: string;
  placeholder?: string;
  error?: string;
  onAddressChange?: (address: string) => void;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const LocationPicker = ({
  value = '',
  onChange,
  className,
  placeholder = "Klik 'Pilih Lokasi' untuk memilih koordinat",
  error,
  onAddressChange,
}: LocationPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [tempCoordinates, setTempCoordinates] = useState<Coordinates | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('satellite');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [searchCache, setSearchCache] = useState<Map<string, any[]>>(new Map());
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && value.includes(',')) {
      const [lat, lng] = value
        .split(',')
        .map((coord) => Number.parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        setCoordinates({ lat, lng });
      }
    }
  }, [value]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`
      );
      const data = await response.json();

      if (data && data.features && data.features.length > 0) {
        const feature = data.features[0];
        const address = formatPhotonAddress(feature.properties);
        if (onAddressChange) {
          onAddressChange(address);
        }
        return address;
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`
        );
        const data = await response.json();

        if (data && data.display_name) {
          const address = data.display_name;
          if (onAddressChange) {
            onAddressChange(address);
          }
          return address;
        }
      } catch (fallbackError) {
        console.error('Fallback reverse geocoding error:', fallbackError);
      }
    }
    return null;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locationPicker_recentSearches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to load recent searches:', error);
        }
      }
    }
  }, []);

  const saveToRecentSearches = useCallback((query: string) => {
    if (!query.trim()) return;

    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((item) => item !== query)].slice(
        0,
        5
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'locationPicker_recentSearches',
          JSON.stringify(updated)
        );
      }
      return updated;
    });
  }, []);

  const searchLocation = useCallback(
    async (query: string, saveToRecent = true) => {
      if (!query.trim()) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      const cacheKey = query.toLowerCase().trim();
      if (searchCache.has(cacheKey)) {
        const cachedResults = searchCache.get(cacheKey)!;
        setSearchResults(cachedResults);
        setShowSearchResults(cachedResults.length > 0);
        return;
      }

      setIsSearching(true);
      try {
        const coordMatch = query.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);

        if (coordMatch) {
          const lat = Number.parseFloat(coordMatch[1]);
          const lng = Number.parseFloat(coordMatch[2]);

          if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            const newCoords = { lat, lng };
            setTempCoordinates(newCoords);

            if (map) {
              map.setView([lat, lng], 16);

              if (marker) {
                map.removeLayer(marker);
              }

              const L = window.L;
              if (L) {
                const newMarker = L.marker([lat, lng])
                  .addTo(map)
                  .bindPopup(`Koordinat: ${lat}, ${lng}`)
                  .openPopup();

                setMarker(newMarker);
              }

              await reverseGeocode(lat, lng);
            }

            setSearchResults([]);
            setShowSearchResults(false);
            toast.success('Koordinat berhasil ditemukan!');
          } else {
            toast.error('Koordinat tidak valid. Pastikan format: lat, lng');
          }
        } else {
          const jatimLat = -7.5360639;
          const jatimLng = 112.2384017;

          const response = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(
              query
            )}&limit=8&lat=${jatimLat}&lon=${jatimLng}`
          );
          const data = await response.json();

          if (data && data.features && data.features.length > 0) {
            const indonesianResults = data.features.filter(
              (feature: any) =>
                feature.properties.country === 'Indonesia' ||
                feature.properties.country === 'ID' ||
                !feature.properties.country
            );

            const finalResults =
              indonesianResults.length > 0 ? indonesianResults : data.features;

            const transformedResults = finalResults.map((feature: any) => ({
              lat: feature.geometry.coordinates[1],
              lon: feature.geometry.coordinates[0],
              display_name: formatPhotonAddress(feature.properties),
              properties: feature.properties,
            }));

            setSearchCache((prev) => {
              const newCache = new Map(prev);
              newCache.set(cacheKey, transformedResults);

              if (newCache.size > 50) {
                const firstKey = newCache.keys().next().value;
                if (firstKey !== undefined) {
                  newCache.delete(firstKey);
                }
              }
              return newCache;
            });

            setSearchResults(transformedResults);
            setShowSearchResults(true);

            if (saveToRecent && transformedResults.length > 0) {
              saveToRecentSearches(query);
            }
          } else {
            setSearchResults([]);
            setShowSearchResults(false);
            toast.error('Lokasi tidak ditemukan. Coba kata kunci lain.');
          }
        }
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Gagal mencari lokasi. Periksa koneksi internet.');
      } finally {
        setIsSearching(false);
      }
    },
    [searchCache, saveToRecentSearches]
  );

  const formatPhotonAddress = (properties: any) => {
    const parts = [];

    if (properties.name) parts.push(properties.name);
    if (properties.street && properties.street !== properties.name)
      parts.push(properties.street);

    if (properties.district) parts.push(properties.district);
    if (properties.city) parts.push(properties.city);
    if (properties.state) parts.push(properties.state);

    if (properties.postcode) parts.push(properties.postcode);

    return parts.join(', ');
  };

  const showRecentSearches = useMemo(() => {
    return !searchQuery.trim() && recentSearches.length > 0 && !isSearching;
  }, [searchQuery, recentSearches, isSearching]);

  const selectSearchResult = async (result: any) => {
    const lat = Number.parseFloat(result.lat);
    const lng = Number.parseFloat(result.lon);
    const newCoords = { lat, lng };

    setTempCoordinates(newCoords);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    setShowSearchResults(false);

    if (map) {
      map.setView([lat, lng], 16);

      if (marker) {
        map.removeLayer(marker);
      }

      const L = window.L;
      if (L) {
        const newMarker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`${result.display_name}<br>Koordinat: ${lat}, ${lng}`)
          .openPopup();

        setMarker(newMarker);
      }

      if (onAddressChange) {
        onAddressChange(result.display_name);
      }
    }

    toast.success('Lokasi berhasil dipilih!');
  };

  const selectRecentSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('locationPicker_recentSearches');
    }
    toast.success('Riwayat pencarian dihapus');
  };

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L && !leafletLoaded) {
        try {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);

          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

          await new Promise((resolve, reject) => {
            script.onload = () => {
              setLeafletLoaded(true);
              resolve(true);
            };
            script.onerror = reject;
            document.head.appendChild(script);
          });
        } catch (error) {
          console.error('Failed to load Leaflet:', error);
        }
      } else if (window.L) {
        setLeafletLoaded(true);
      }
    };

    loadLeaflet();
  }, [leafletLoaded]);

  useEffect(() => {
    if (isMapOpen && mapRef.current && !map && window.L && leafletLoaded) {
      setIsMapLoading(true);
      const L = window.L;

      try {
        if ((mapRef.current as any)._leaflet_id) {
          delete (mapRef.current as any)._leaflet_id;
        }
        mapRef.current.innerHTML = '';
      } catch (error) {
        console.log('Map cleanup error:', error);
      }

      const defaultLat = coordinates?.lat || -7.2575;
      const defaultLng = coordinates?.lng || 112.7521;

      if (coordinates) {
        setTempCoordinates(coordinates);
      }

      const newMap = L.map(mapRef.current).setView(
        [defaultLat, defaultLng],
        16
      );

      const streetLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }
      );

      const cleanLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '© OpenStreetMap contributors © CARTO',
          maxZoom: 19,
        }
      );

      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '© Esri, Maxar, Earthstar Geographics',
          maxZoom: 19,
        }
      );

      const hybridLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '© Esri',
          maxZoom: 19,
        }
      );

      if (mapType === 'satellite') {
        satelliteLayer.addTo(newMap);
        hybridLayer.addTo(newMap);
      } else {
        cleanLayer.addTo(newMap);
      }

      (newMap as any).streetLayer = streetLayer;
      (newMap as any).cleanLayer = cleanLayer;
      (newMap as any).satelliteLayer = satelliteLayer;
      (newMap as any).hybridLayer = hybridLayer;

      if (coordinates) {
        const newMarker = L.marker([coordinates.lat, coordinates.lng])
          .addTo(newMap)
          .bindPopup(`Koordinat: ${coordinates.lat}, ${coordinates.lng}`)
          .openPopup();
        setMarker(newMarker);
      }

      newMap.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        const newCoords = {
          lat: Number.parseFloat(lat.toFixed(6)),
          lng: Number.parseFloat(lng.toFixed(6)),
        };

        setTempCoordinates(newCoords);

        if (marker) {
          newMap.removeLayer(marker);
        }

        const newMarker = L.marker([lat, lng])
          .addTo(newMap)
          .bindPopup(`Koordinat: ${newCoords.lat}, ${newCoords.lng}`)
          .openPopup();

        setMarker(newMarker);

        reverseGeocode(newCoords.lat, newCoords.lng);
      });

      setMap(newMap);
      setIsMapLoading(false);
    }

    return () => {
      if (!isMapOpen && map) {
        try {
          if (map.getContainer && map.getContainer()) {
            map.remove();
          }
          if (mapRef.current) {
            (mapRef.current as any)._leaflet_id = null;
            mapRef.current.innerHTML = '';
          }
        } catch (error) {
          console.debug(
            'Map cleanup handled:',
            error instanceof Error ? error.message : 'Unknown error'
          );
        }
        setMap(null);
        setMarker(null);
      }

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [isMapOpen, coordinates, map, marker, leafletLoaded]);

  const getCurrentLocation = async () => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      toast.error('Geolocation tidak didukung oleh browser ini.');
      setIsLoading(false);
      return;
    }

    try {
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({
            name: 'geolocation',
          });

          if (permission.state === 'denied') {
            toast.error(
              'Akses lokasi ditolak. Silakan aktifkan izin lokasi di pengaturan browser.'
            );
            setIsLoading(false);
            return;
          }
        } catch (permError) {
          console.log('Permission API not supported, continuing...');
        }
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const newCoords = {
            lat: Number.parseFloat(latitude.toFixed(6)),
            lng: Number.parseFloat(longitude.toFixed(6)),
          };

          setTempCoordinates(newCoords);

          if (map) {
            map.setView([latitude, longitude], 18);

            if (marker) {
              map.removeLayer(marker);
            }

            const L = window.L;
            if (L) {
              const accuracyText = accuracy
                ? ` (Akurasi: ±${Math.round(accuracy)}m)`
                : '';
              const newMarker = L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup(
                  `Lokasi Saat Ini: ${newCoords.lat}, ${newCoords.lng}${accuracyText}`
                )
                .openPopup();

              setMarker(newMarker);

              if (isMobile && accuracy && accuracy < 100) {
                L.circle([latitude, longitude], {
                  radius: accuracy,
                  color: '#3388ff',
                  fillColor: '#3388ff',
                  fillOpacity: 0.1,
                  weight: 2,
                }).addTo(map);
              }
            }

            reverseGeocode(newCoords.lat, newCoords.lng);
          }

          setIsLoading(false);

          if (accuracy) {
            toast.success(`Lokasi berhasil ditemukan!`);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Tidak dapat mengakses lokasi. ';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              if (isAndroid) {
                errorMessage +=
                  'ANDROID - Akses lokasi ditolak:\n\n1. Buka Pengaturan HP > Aplikasi > Chrome/Browser\n2. Pilih "Izin" > "Lokasi" > Izinkan\n3. Atau ketik chrome://settings/content/location di address bar\n4. Refresh halaman dan coba lagi';
              } else {
                errorMessage +=
                  'Akses lokasi ditolak. Silakan aktifkan izin lokasi di pengaturan browser.';
              }
              break;
            case error.POSITION_UNAVAILABLE:
              if (isAndroid) {
                errorMessage +=
                  'ANDROID - Lokasi tidak tersedia:\n\n1. Pastikan GPS aktif: Pengaturan > Lokasi > ON\n2. Pilih "Mode Akurasi Tinggi"\n3. Keluar ke area terbuka (tidak di dalam gedung)\n4. Tunggu 30 detik untuk sinyal GPS';
              } else {
                errorMessage +=
                  'Lokasi tidak tersedia. Pastikan GPS aktif dan Anda berada di area dengan sinyal yang baik.';
              }
              break;
            case error.TIMEOUT:
              if (isAndroid) {
                errorMessage +=
                  'ANDROID - Timeout:\n\n1. Keluar ke area terbuka\n2. Restart GPS: Matikan dan nyalakan kembali lokasi\n3. Tunggu lebih lama (30-60 detik)\n4. Coba gunakan aplikasi Maps dulu untuk "warm up" GPS';
              } else {
                errorMessage +=
                  'Pencarian lokasi timeout. Coba lagi atau pindah ke area dengan sinyal GPS yang lebih baik.';
              }
              break;
            default:
              errorMessage += `Terjadi kesalahan (Code: ${error.code}). Coba refresh halaman atau restart browser.`;
              break;
          }

          toast.error(errorMessage);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: isAndroid ? 20000 : 15000,
          maximumAge: isAndroid ? 60000 : 30000,
        }
      );
    } catch (error) {
      console.error('Permission error:', error);
      toast.error(
        'Tidak dapat memeriksa izin lokasi. Pastikan browser mendukung fitur lokasi.'
      );
      setIsLoading(false);
    }
  };

  const handleSaveCoordinates = () => {
    if (tempCoordinates && onChange) {
      const coordString = `${tempCoordinates.lat}, ${tempCoordinates.lng}`;
      onChange(coordString);
      setCoordinates(tempCoordinates);
      setIsMapOpen(false);
      toast.success('Koordinat berhasil disimpan!');
    } else {
      toast.error(
        'Tidak ada koordinat yang dipilih. Silakan pilih lokasi terlebih dahulu.'
      );
    }
  };

  const handleClearLocation = () => {
    if (map && marker) {
      map.removeLayer(marker);
      setMarker(null);
    }
    setTempCoordinates(null);
    toast.success('Lokasi berhasil dihapus dari peta');
  };

  const formatCoordinates = (coords: Coordinates) => {
    return `${coords.lat}, ${coords.lng}`;
  };

  const switchMapType = () => {
    if (map && window.L) {
      const L = window.L;

      if (mapType === 'satellite') {
        map.removeLayer((map as any).satelliteLayer);
        map.removeLayer((map as any).hybridLayer);
        (map as any).cleanLayer.addTo(map);
        setMapType('street');
      } else {
        map.removeLayer((map as any).cleanLayer);
        (map as any).satelliteLayer.addTo(map);
        (map as any).hybridLayer.addTo(map);
        setMapType('satellite');
      }
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchLocation(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="md:flex grid gap-2">
        <Input
          value={coordinates ? formatCoordinates(coordinates) : ''}
          placeholder={placeholder}
          readOnly
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsMapOpen(true)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <MapPin className="w-4 h-4" />
          Pilih Lokasi
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {isMapOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-background border rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-lg">
            <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
              <h3 className="text-lg font-semibold text-foreground">
                Pilih Lokasi
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMapOpen(false)}
              >
                ✕
              </Button>
            </div>

            <div className="p-4 border-b flex-shrink-0 space-y-4 relative">
              {/* Search Bar */}
              <div className="relative">
                <div className="relative">
                  {isSearching ? (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
                    </div>
                  ) : (
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  )}
                  <Input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => {
                      const query = e.target.value;
                      setSearchQuery(query);

                      if (searchTimeout) {
                        clearTimeout(searchTimeout);
                      }

                      if (!query.trim()) {
                        setSearchResults([]);
                        setShowSearchResults(false);
                        setIsSearching(false);
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Cari lokasi di atau masukkan koordinat..."
                    className="pl-10 pr-20"
                    disabled={isSearching}
                    onFocus={() => {
                      if (!searchQuery.trim() && recentSearches.length > 0) {
                        setShowSearchResults(false);
                      }
                    }}
                  />
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSearch}
                      disabled={!searchQuery.trim() || isSearching}
                      className="h-6 w-6 p-0"
                      title="Cari (Enter)"
                    >
                      <Search className="w-3 h-3" />
                    </Button>
                    {searchQuery && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                          setShowSearchResults(false);
                          setIsSearching(false);
                          if (searchTimeout) {
                            clearTimeout(searchTimeout);
                            setSearchTimeout(null);
                          }
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Recent Searches - Google Maps Style */}
                {showRecentSearches && (
                  <div className="absolute top-full left-0 right-0 z-[9999] mt-1 mb-4 bg-background/95 backdrop-blur-sm border rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                    <div className="px-4 py-2 border-b bg-muted/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Pencarian Terkini
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearRecentSearches}
                          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Hapus Semua
                        </Button>
                      </div>
                    </div>
                    {recentSearches.map((query, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectRecentSearch(query)}
                        className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b last:border-b-0 flex items-center gap-3"
                      >
                        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-foreground truncate">
                            {query}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Search Results Dropdown - Google Maps Style */}
                {showSearchResults &&
                  searchResults.length > 0 &&
                  !showRecentSearches && (
                    <div className="absolute top-full left-0 right-0 z-[9999] mt-1 mb-4 bg-background/95 backdrop-blur-sm border rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                      <div className="px-4 py-2 border-b bg-muted/30">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {searchResults.length} Hasil Ditemukan
                        </span>
                      </div>
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectSearchResult(result)}
                          className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b last:border-b-0 flex items-start gap-3"
                        >
                          <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate text-foreground">
                              {result.properties?.name ||
                                result.display_name.split(',')[0]}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {result.display_name}
                            </div>
                            <div className="text-xs text-muted-foreground/70 mt-1 flex items-center gap-1">
                              <span>
                                {Number.parseFloat(result.lat).toFixed(4)},{' '}
                                {Number.parseFloat(result.lon).toFixed(4)}
                              </span>
                              {result.properties?.country === 'Indonesia' && (
                                <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-medium">
                                  ID
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              {/* Control Buttons */}
              <div className="flex gap-2 items-center flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Navigation className="w-4 h-4" />
                  {isLoading ? 'Mencari Lokasi...' : 'Aktifkan Lokasi'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={switchMapType}
                  className="flex items-center gap-2 bg-transparent"
                >
                  {mapType === 'satellite' ? (
                    <>
                      <MapIcon className="w-4 h-4" />
                      Peta
                    </>
                  ) : (
                    <>
                      <Satellite className="w-4 h-4" />
                      Satelit
                    </>
                  )}
                </Button>

                {tempCoordinates && (
                  <div className="text-sm text-muted-foreground">
                    Koordinat: {formatCoordinates(tempCoordinates)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 relative min-h-0">
              {/* Map Loading Indicator */}
              {(isMapLoading || !leafletLoaded) && (
                <div className="absolute inset-0 bg-muted/50 flex items-center justify-center z-10">
                  <div className="bg-background border rounded-lg p-6 shadow-lg flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                    <div className="text-sm text-muted-foreground text-center">
                      {!leafletLoaded
                        ? 'Memuat komponen peta...'
                        : 'Menginisialisasi peta...'}
                    </div>
                  </div>
                </div>
              )}

              <div
                ref={mapRef}
                className="w-full h-full"
                style={{ minHeight: '300px' }}
              />

              {/* Search Guide - Only show when map is loaded */}
              {/* {leafletLoaded && !isMapLoading && (
                <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm border p-3 rounded-lg shadow-lg max-w-xs">
                  <p className="text-sm text-foreground">
                    <strong>🗺️ Panduan Pencarian:</strong><br />
                    • Ketik nama kota, jalan, atau tempat<br />
                    • Contoh: "Surabaya", "Malang", "Jl. Tunjungan"<br />
                    • Atau koordinat: "-7.2575, 112.7521"<br />
                    • Klik peta atau gunakan GPS<br />
                    • Fokus area: Jawa Timur & Indonesia<br />
                    • 🚀 <strong>Tips:</strong> Hasil di-cache & riwayat tersimpan untuk kecepatan
                  </p>
                </div>
              )} */}
            </div>

            <div className="p-4 border-t flex justify-between flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClearLocation}
                disabled={!tempCoordinates}
              >
                Hapus Lokasi
              </Button>
              <Button
                type="button"
                onClick={handleSaveCoordinates}
                disabled={!tempCoordinates}
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Simpan Koordinat
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
