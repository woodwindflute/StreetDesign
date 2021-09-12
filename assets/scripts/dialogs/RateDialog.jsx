import React from 'react'
import { FormattedMessage } from 'react-intl'
import Dialog from './Dialog'
import './RateDialog.scss'

let ph1 = ''
let ph2 = ''
let ph3 = ''
let stylePh1 = { color: 'black' }; let stylePh2 = { color: 'black' }; let stylePh3 = { color: 'black' }

function Rating (props) {
  let detPh1 = 0; let detPh2 = 0; let detPh3 = 0
  stylePh1 = { color: 'black' }; stylePh2 = { color: 'black' }; stylePh3 = { color: 'black' }
  ph1 = ''; ph2 = ''; ph3 = ''
  const segments = props.data.street.segments
  console.log(segments)
  for (let i = 0; i < segments.length; i = i + 1) {
    console.log(segments[i])
    switch (segments[i].type) {
      case 'sidewalk':
        if (segments[i].width >= 8.33333 && detPh1 < 1) { // 最好的
          detPh1 = 1
        } else if (segments[i].width > 5 && segments[i].width < 8.33333 && detPh1 < 2) {
          detPh1 = 2
        } else if (segments[i].width <= 5) {
          detPh1 = 3
        }
        break
      case 'drive-lane':
        if (segments[i].width > 11.66667 && detPh2 < 4) {
          if (detPh2 === 3) detPh2 = 4
          else detPh2 = 2
        } else if (segments[i].width >= 10 && segments[i].width <= 11.66667 && detPh2 < 1) {
          detPh2 = 1
        } else if (segments[i].width < 10 && detPh2 < 4) {
          if (detPh2 === 2) detPh2 = 4
          else detPh2 = 3
        }
        break
      case 'turn-lane':
        if (segments[i].width >= 10 && detPh3 < 1) {
          detPh3 = 1
        } else if (segments[i].width < 10 < 2) {
          detPh3 = 2
        }
        break
    }
  }
  switch (detPh1) {
    case 0:
      stylePh1 = { color: 'red' }
      ph1 = '無設立人行道，未考量行人及弱勢族群使用。'
      break
    case 1:
      ph1 = '有設立人行道且寬度 ≧ 2.5m，感謝您設計優質的人本道路！'
      break
    case 2:
      ph1 = '有設立人行道且寬度介於 1.5~2.5m，這是符合標準的人本道路。'
      break
    case 3:
      ph1 = '有設立人行道且寬度 ≦ 1.5m，這是以車為主的人本道路。'
      break
  }

  switch (detPh2) {
    case 1:
      ph2 = '車道寬度介於 3.0~3.5m，感謝您提供良好的車行環境！'
      break
    case 2:
      stylePh2 = { color: 'red' }
      ph2 = '車道 > 3.5m 過寬。容易導致汽機車併排搶道，可能增加事故發生。'
      break
    case 3:
      stylePh2 = { color: 'red' }
      ph2 = '車道 < 3m 過窄。可能導致車行困難。'
      break
    case 4:
      stylePh2 = { color: 'red' }
      ph2 = '車道 > 3.5m 過寬。容易導致汽機車併排搶道，可能增加事故發生。車道 < 3m 過窄。可能導致車行困難。'
      break
  }

  switch (detPh3) {
    case 1:
      ph3 = '有設立轉向車道且寬度 ≧ 3m，感謝您提供舒適的車行轉彎環境！'
      break
    case 2:
      ph3 = '有設立轉向車道且寬度 < 3m，這是有考慮到轉向車輛的道路設計。'
      break
  }
  console.log(detPh1)
  console.log(detPh2)
  console.log(detPh3)
}

function RateDialog (props) {
  const settings = localStorage.getItem('settings')
  const streetid = JSON.parse(settings).lastStreetId
  const APIURL = 'http://' + location.host + '/api/v1/streets/' + streetid
  console.log(settings)

  const request = new XMLHttpRequest()

  request.open('GET', APIURL, true)
  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      // Connection success
      const streetmixResponseObject = JSON.parse(this.response)
      Rating(streetmixResponseObject)
    } else {
      // We reached our target server, but it returned an error
      console.log('[streetmix-loader]', 'Loading Error: We reached the target server, but it returned an error')
    }
  }
  request.onerror = function () {
    // There was a connection error of some sort
    console.log('[streetmix-loader]', 'Loading Error: There was a connection error of some sort')
  }
  request.send()
  return (
    <Dialog>
      {(closeDialog) => (
        <div className="rate-about-dialog">
          <header>
            <h1>
              <FormattedMessage
                id="dialogs.rate.heading"
                defaultMessage="人本道路評語機制🏅"
              />
            </h1>
          </header>
          <div className="dialog-content" style={{ fontSize: '18px', textAlign: 'center' }}>
            <p>　</p>
            <p>　</p>
            <p style={stylePh1}>{ph1}</p>
            <p style={stylePh2}>{ph2}</p>
            <p style={stylePh3}>{ph3}</p>
          </div>
          <button className="dialog-primary-action" onClick={closeDialog}>
            <FormattedMessage id="btn.close" defaultMessage="Close" />
          </button>
        </div>
      )}
    </Dialog>
  )
}

export default RateDialog
