/* global L */
import React, { createRef, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useIntl } from 'react-intl'
import { Map, TileLayer, ZoomControl, Marker } from 'react-leaflet'
import { HERE_HOST_NAME, HERE_API_KEY } from '../app/config'
import { isOwnedByCurrentUser } from '../streets/owner'
import { setMapState } from '../store/slices/map'
import {
  addLocation,
  clearLocation,
  saveStreetName
} from '../store/slices/street'
import Dialog from './Dialog'
import ErrorBanner from './Geotag/ErrorBanner'
import GeoSearch from './Geotag/GeoSearch'
import LocationPopup from './Geotag/LocationPopup'
import './GeotagDialog.scss'
import './BoundaryCanvas.js'
import geoJson from './COUNTY_MOI_1090820.json'

const REVERSE_GEOCODE_API = `https://revgeocode.${HERE_HOST_NAME}/v1/revgeocode`
const REVERSE_GEOCODE_ENDPOINT = `${REVERSE_GEOCODE_API}?apikey=${HERE_API_KEY}`
const MAP_TILES =
  'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// zoom level for a closer, 'street' zoom level
const MAP_LOCATION_ZOOM = 12
// Default location if geo IP not detected; this hovers over the Atlantic Ocean
const DEFAULT_MAP_ZOOM = 8
// origin map center lat: 10.45, lng: -10.78
const DEFAULT_MAP_LOCATION = {
  lat: 23.5832,
  lng: 120.5825
}
const MIN_ZOOM = 7
// Override icon paths in stock Leaflet's stylesheet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png'
})

GeotagDialog.propTypes = {
  // Provided by Redux store
  street: PropTypes.object,
  markerLocation: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  }),
  addressInformation: PropTypes.object,
  userLocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number
  })
}

function getInitialState(props) {
  // Determine initial map center, and what to display
  let mapCenter, zoom, markerLocation, label

  // If street has a location object, use its position and data
  if (props.street.location) {
    mapCenter = props.street.location.latlng
    zoom = MAP_LOCATION_ZOOM
    markerLocation = props.street.location.latlng
    label = props.street.location.label
    /* If we've previously saved marker position, re-use that information
     This can be better described. This is an intermediary state that can happen when:

      1) A user is viewing a street without a geotagged location.
      They open the dialog box and search for a street location.
      A search result is selected and a marker is dropped on the map.

      2) Without confirming the location, the user exits the dialog box.
      Because a location is not confirmed, the street does not attach to the location.

      3) The user re-opens the dialog box.
      The previous state (with an unconfirmed location and map marker) is recovered.
      */
  } else if (props.markerLocation) {
    mapCenter = props.markerLocation
    zoom = MAP_LOCATION_ZOOM
    markerLocation = props.markerLocation
    label = props.addressInformation.label
    // If there's no prior location data, use the user's location, if available
    // In this case, display the map view, but no marker or popup
  } else if (props.userLocation && props.userLocation.longitude) {
    mapCenter = {
      lat: props.userLocation.latitude,
      lng: props.userLocation.longitude
    }
    zoom = MAP_LOCATION_ZOOM
    // As a last resort, show an overview of the world.
  } else {
    mapCenter = DEFAULT_MAP_LOCATION
    zoom = DEFAULT_MAP_ZOOM
  }

  return {
    mapCenter,
    zoom,
    markerLocation,
    label
  }
}

/*
This Dialog uses the generic Dialog component and combines it with the GeoSearch
and LocationPopup components as well as a map to display the coordinates on
It handles:
setting, displaying, and clearing location information associated with a 'street'
user permission checks for whether location can be updated for a street based on the user
reverse geocodeing based on user input (the user can click on the map to reverse geocode at the
  clicked point, or it can drag the marker to a new location to confirm)

It is tested primary via cypress at the moment
 */
function GeotagDialog() {
  // this kinda goofy props object is a result of refactoring
  // some legacy code. definetly worth refactoring further in the future
  // if it causes other problems or confusion
  const props = {
    street: useSelector((state) => state.street),
    markerLocation: useSelector((state) => state.map.markerLocation),
    addressInformation: useSelector((state) => state.map.addressInformation),
    userLocation: useSelector((state) => state.user.geolocation.data)
  }

  const dispatch = useDispatch()
  const initialState = getInitialState(props)
  const [mapCenter, setMapCenter] = useState(initialState.mapCenter)
  const [zoom, setZoom] = useState(initialState.zoom)
  const [markerLocation, setMarkerLocation] = useState(
    initialState.markerLocation
  )
  const [label, setLabel] = useState(initialState.label)
  const [renderPopup, setRenderPopup] = useState(!!initialState.markerLocation)
  const intl = useIntl()

  const geocodeAvailable = !!HERE_API_KEY

  const maxBounds = [
    [28, 125],
    [20, 118]
  ]
  const mapRef = useRef(null)

  useEffect(() => {
    const map = mapRef.current.leafletElement
    const osm = new L.TileLayer.boundaryCanvas(MAP_TILES, {
      boundary: geoJson,
      attribution: MAP_ATTRIBUTION
    })
    map.addLayer(osm)
  }, [])

  const handleMapClick = (event) => {
    // get the new latlng of the clicked position
    const latlng = {
      lat: event.latlng.lat,
      lng: event.latlng.lng
    }

    // this is in the context of a a map click or drag, we don't want to switch up
    // the zoom level on the user
    const zoom = event.target.getZoom()
    reverseGeocode(latlng).then((res) => {
      const latlng = {
        lat: res.items[0].position.lat,
        lng: res.items[0].position.lng
      }
      setZoom(zoom)
      updateMap(latlng, res.items[0].address)
    }).catch()
  }

  const handleMarkerDragStart = (event) => {
    setRenderPopup(false)
  }

  const handleMarkerDragEnd = (event) => {
    /* method of updating coords is different here(as opposed to onClick) since we're
     moving a leaflet object
    keeping the data shape of latlng in line with how its used in child components
    */
    let latlng = event.target.getLatLng()
    latlng = {
      lat: latlng.lat,
      lng: latlng.lng
    }
    reverseGeocode(latlng).then((res) => {
      updateMap(latlng, res.items[0].address)
    }).catch()
  }

  const handleConfirmLocation = (event) => {
    const { markerLocation, addressInformation } = props

    const location = {
      latlng: markerLocation,
      wofId: addressInformation.id,
      label: addressInformation.label,
      hierarchy: {
        country: addressInformation.countryName,
        county: addressInformation.county,
        city: addressInformation.city,
        district: addressInformation.district,
        street: addressInformation.street
      },
      geometryId: null,
      intersectionId: null
    }

    batch(() => {
      dispatch(addLocation(location))
      dispatch(saveStreetName(location.hierarchy.street, false))
    })
  }

  const handleClearLocation = (event) => {
    dispatch(clearLocation())
  }

  const reverseGeocode = (latlng) => {
    const url = `${REVERSE_GEOCODE_ENDPOINT}&at=${latlng.lat},${latlng.lng}&lang=zh-TW`
    return window.fetch(url).then((response) => response.json())
  }

  // Search dialog state dosen't sync up with map state (IMO should clear or update with label)
  const handleSearchResults = (position, locationProperties) => {
    const latlng = {
      lat: position.lat,
      lng: position.lng
    }
    updateMap(latlng, locationProperties)
  }

  function updateMap(latlng, locationProperties) {
    /*
    after the location position is updated,
    we need to update the map UI elements
    an update place information in the store
    */
    setRenderPopup(true)
    setMarkerLocation(latlng)
    setLabel(locationProperties.label)
    setMapCenter(latlng)

    dispatch(
      setMapState({
        markerLocation: latlng,
        addressInformation: locationProperties
      })
    )
  }

  /**
   * Determines if the street location can be saved or edited.
   */
  const canEditLocation = () => {
    const { street } = props
    // The street is editable if either of the following conditions are true:
    //  - If there is a street owner, and it's equal to the current user
    //  - If there is no street owner
    //  - If there is no street location saved.
    return isOwnedByCurrentUser() || !street.creatorId || !street.location
  }

  /**
   * Location can be cleared from a street that has a saved location, and
   * if that location is equal to the current marker position.
   * This does not check for street ownership. See `canEditLocation()` for that.
   */
  const canClearLocation = () => {
    const { location } = props.street

    return (
      location &&
      location.latlng.lat === markerLocation.lat &&
      location.latlng.lng === markerLocation.lng
    )
  }

  return (
    <Dialog>
      {(closeDialog) => (
        <div className="geotag-dialog">
          {geocodeAvailable
            ? (
              <div className="geotag-input-container">
                <GeoSearch
                  handleSearchResults={handleSearchResults}
                />
              </div>
            )
            : (
              <ErrorBanner />
            )}
          <Map
            center={mapCenter}
            zoomControl={false}
            zoom={zoom}
            onClick={geocodeAvailable ? handleMapClick : null}
            useFlyTo={true}
            maxBounds={maxBounds}
            minZoom={MIN_ZOOM}
            ref={mapRef}
          >
            <ZoomControl
              zoomInTitle={intl.formatMessage({
                id: 'dialogs.geotag.zoom-in',
                defaultMessage: 'Zoom in'
              })}
              zoomOutTitle={intl.formatMessage({
                id: 'dialogs.geotag.zoom-out',
                defaultMessage: 'Zoom out'
              })}
            />
            {renderPopup && (
              <LocationPopup
                position={markerLocation}
                label={label}
                isEditable={geocodeAvailable && canEditLocation()}
                isClearable={geocodeAvailable && canClearLocation()}
                handleConfirm={(e) => {
                  handleConfirmLocation(e)
                  closeDialog()
                }}
                handleClear={(e) => {
                  handleClearLocation(e)
                  closeDialog()
                }}
              />
            )}

            {markerLocation && (
              <Marker
                position={markerLocation}
                onDragEnd={handleMarkerDragEnd}
                onDragStart={handleMarkerDragStart}
                draggable={geocodeAvailable}
              />
            )}
          </Map>
        </div>
      )}
    </Dialog>
  )
}
export default GeotagDialog
