import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { HERE_API_KEY, HERE_HOST_NAME } from '../../app/config';

const AUTOSUGGEST_GEOCODE_API = `https://autosuggest.${HERE_HOST_NAME}/v1/autosuggest`
const AUTOSUGGEST_GEOCODE_ENDPOINT = `${AUTOSUGGEST_GEOCODE_API}?apikey=${HERE_API_KEY}`

function GeoSearch() {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const handleChange = (event, { newValue }) => {
    setValue(newValue)
  }

  const handleSuggestionsFetchRequested = ({ value }) => {
    getSuggestions(value)
  }

  const handleSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  const getSuggestionValue = (suggestion) => {
    return suggestion.address.label
  }

  const renderSuggestion = (suggestion) => {
    return (
      suggestion.address.label
    )
  }

  const getSuggestions = (value) => {
    const inputLength = value.length
    if (inputLength === 0) {
      setSuggestions([])
    } else {
      autosuggestionGeocode(value).then((res) => {
        const suggestions = res.items
        setSuggestions(suggestions)
      })
    }
  }

  const autosuggestionGeocode = (value) => {
    const url = `${AUTOSUGGEST_GEOCODE_ENDPOINT}&at=23.5832,120.5825&limit=5&lang=zh-TW&q=${value}`
    return window.fetch(url).then((response) => response.json())
  }
  const inputProps = {
    value: value,
    onChange: handleChange
  }

  return (
    <div className="geotag-input-form">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={handleSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    </div>
  )
}


export default GeoSearch