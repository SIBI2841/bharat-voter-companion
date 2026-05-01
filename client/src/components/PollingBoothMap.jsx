import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Loader } from 'lucide-react';

function PollingBoothMap() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapSrc, setMapSrc] = useState('');
  const [locationLabel, setLocationLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLocated, setUserLocated] = useState(false);

  // Build Google Maps embed URL
  const buildMapUrl = (query) => {
    const encoded = encodeURIComponent(query);
    // Standard Google Maps embed URL (no API key required for basic query embeds)
    return `https://maps.google.com/maps?q=${encoded}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  // Geocode and embed using Google Maps
  const geocodeAndEmbed = async (query) => {
    setLoading(true);
    try {
      const src = buildMapUrl(query + ' India');
      setMapSrc(src);
      setLocationLabel(`Searching Google Maps for: ${query}`);
    } catch {
      setLocationLabel('Error fetching location.');
    } finally {
      setLoading(false);
    }
  };

  // Geolocate user on mount
  const locateUser = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        // Embed Google Maps with coordinates
        const src = `https://maps.google.com/maps?q=${lat},${lon}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
        setMapSrc(src);
        setLocationLabel(`Your current location (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
        setUserLocated(true);
        setLoading(false);
      },
      () => {
        // fallback to Delhi
        geocodeAndEmbed('New Delhi');
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    locateUser();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      geocodeAndEmbed(searchQuery.trim());
    }
  };

  return (
    <div className="fade-in map-view">
      <div className="section-header">
        <h2>Find Your Polling Booth 🗺️</h2>
        <p>Enter your PIN code, city, or constituency to locate nearby polling stations.</p>
      </div>

      <div className="map-container">
        <form className="map-search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by PIN code or City (e.g., 110001, Mumbai)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" className="btn secondary-btn" onClick={locateUser} title="Use my location">
            <Navigation size={18} />
          </button>
          <button type="submit" className="btn primary-btn">
            <Search size={18} /> Search
          </button>
        </form>

        <div className="map-frame-wrapper" style={{ position: 'relative' }}>
          {loading && (
            <div className="map-loading-overlay">
              <Loader size={36} className="spin" />
              <p>Locating...</p>
            </div>
          )}

          {mapSrc ? (
            <iframe
              title="Polling Booth Map"
              width="100%"
              height="500"
              style={{ border: 0, borderRadius: 'var(--radius-lg)', display: 'block' }}
              loading="lazy"
              allowFullScreen
              src={mapSrc}
            />
          ) : !loading && (
            <div className="map-placeholder">
              <MapPin size={48} />
              <p>Allow location access or search above to see the map.</p>
            </div>
          )}

          {locationLabel && !loading && (
            <div className="map-overlay-alert">
              <MapPin size={18} />
              <p>{locationLabel}</p>
            </div>
          )}
        </div>

        <div className="map-info-strip">
          <span>🗳️ Tip: Search your constituency name or PIN code to find your nearest polling booth</span>
          <a
            href="https://electoralsearch.eci.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn primary-btn"
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
            Official ECI Voter Search ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default PollingBoothMap;
