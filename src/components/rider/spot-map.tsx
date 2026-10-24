"use client";

import * as React from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { ChargingSpot } from "@/types/db";

const pinIcon = L.divIcon({
  className: "",
  html: '<div style="width:20px;height:20px;background:#F25A0E;border:3px solid #143122;border-radius:50%;box-shadow:0 1px 5px #0008"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

function MapBehavior({ center, selectedSpotId, spotById }: { center: [number, number]; selectedSpotId: string | null; spotById: Map<string, ChargingSpot> }) {
  const map = useMap();
  React.useEffect(() => { map.flyTo(center, map.getZoom(), { duration: 0.6 }); }, [center, map]);
  React.useEffect(() => {
    if (!selectedSpotId) return;
    const spot = spotById.get(selectedSpotId);
    if (spot) map.flyTo([spot.lat, spot.lng], Math.max(map.getZoom(), 14), { duration: 0.6 });
  }, [map, selectedSpotId, spotById]);
  return null;
}

export function SpotMap({
  center, spots, selectedSpotId, onMarkerClick, onRecenter,
}: {
  center: [number, number];
  spots: ChargingSpot[];
  selectedSpotId: string | null;
  onMarkerClick: (id: string) => void;
  onRecenter: () => void;
}) {
  const spotById = React.useMemo(() => new Map(spots.map((spot) => [spot.id, spot])), [spots]);
  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={13} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBehavior center={center} selectedSpotId={selectedSpotId} spotById={spotById} />
        {spots.map((spot) => (
          <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={pinIcon} eventHandlers={{ click: () => onMarkerClick(spot.id) }}>
            <Popup>
              <strong>{spot.title}</strong><br />
              {spot.power_kw} kW · ₹{spot.price_per_kwh} per kWh<br />
              <a href={`/spot/${spot.id}`}>View spot</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <button type="button" onClick={onRecenter} className="absolute right-3 top-3 z-[1000] rounded-lg bg-white px-3 py-2 text-sm shadow" aria-label="Re-centre map">◎ Re-centre</button>
    </div>
  );
}
