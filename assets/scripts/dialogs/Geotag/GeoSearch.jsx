import Downshift from 'downshift'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { HERE_API_KEY, HERE_HOST_NAME } from '../../app/config'

const DISCOVER_GEOCODE_API = `https://discover.${HERE_HOST_NAME}/v1/discover`
const DISCOVER_GEOCODE_ENDPOINT = `${DISCOVER_GEOCODE_API}?apikey=${HERE_API_KEY}`

GeoSearch.propTypes = {
  handleSearchResults: PropTypes.func
}

function GeoSearch({ handleSearchResults }) {
  const [items, setItmes] = useState()

  const intl = useIntl()

  const handleChange = (selection) => {
    if (!selection) {
      return
    }
    handleSearchResults(selection.position, selection.address)
  }

  const handleInputValueChange = (inputValue, stateAndHelpers) => {
    const inputLength = inputValue.length
    if (inputLength === 0) {
      setItmes()
    } else {
      discoverGeocode(inputValue).then((res) => {
        const items = res.items
        setItmes(items)
      })
    }
  }

  const discoverGeocode = (inputValue) => {
    const url = `${DISCOVER_GEOCODE_ENDPOINT}&at=23.5832,120.5825&in=countryCode:TWN&limit=5&lang=zh-TW&q=${inputValue}`
    return window.fetch(url).then((response) => response.json())
  }

  const renderSuggestion = (item, index, getItemProps) => {
    return (
      <li
        {...getItemProps({
          className: 'geotag-suggestion',
          key: item.address.label,
          index,
          item,
        })}
      >
        {item.address.label}
      </li>
    )
  }

  return (
    <Downshift
      onChange={handleChange}
      itemToString={(item) => (item ? item.address.label : '')}
      onInputValueChange={handleInputValueChange}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        clearSelection,
        isOpen,
        inputValue,
      }) => (
        <div className='geotag-input-form'>
          <input {...getInputProps({
            className: 'geotag-input',
            autoFocus: true,
            placeholder: intl.formatMessage({
              id: 'dialogs.geotag.search',
              defaultMessage: 'Search for a location'
            })
          })} />
          {inputValue && (
            <span
              title={intl.formatMessage({
                id: 'dialogs.geotag.clear-search',
                defaultMessage: 'Clear search'
              })}
              className="geotag-input-clear"
              onClick={(e) => {
                clearSelection()
              }}
            >
              ×
            </span>
          )}
          {isOpen && items && (
            <div className='geotag-suggestions-container'>
              <ul {...getMenuProps({ className: 'geotag-suggestions-list' })}>
                {items.map((item, index) => (
                  renderSuggestion(item, index, getItemProps)
                ))}
              </ul>
            </div>)
          }
        </div>
      )}
    </Downshift>
  )
}

export default GeoSearch