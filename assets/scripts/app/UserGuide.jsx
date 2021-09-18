import React from 'react'
import Guide from 'byte-guide'
import './UserGuide.scss'

const LOCAL_KEY = Math.random().toString(36).slice(-8)

function UserGuide({ handleGuideEnd }) {

  const steps = [
    {
      selector: '#street-section-canvas',
      title: '道路設計',
      content: '將滑鼠移到圖示上會出現選單可以進行樣式更換/道路寬度縮放/刪除，\n滑鼠左鍵案住並點選圖示可以進行脫放移動，將圖示移動的您所想要的位置並放開滑鼠左鍵即可。',
      placement: 'left'
    },
    {
      selector: '.palette-items',
      title: '道路圖示',
      content: '滑鼠左鍵案住並點選圖是可以進行脫放移動，\n將圖示移動到上方設計區並放開滑鼠左鍵，即可擺放上去。',
      placement: 'top'
    },
    {
      selector: '.street-nameplate-container',
      title: '更換道路名字及地圖搜尋',
      content: '在這裡您可以更換道路的名稱，\n您也可以點選添加位置來搜尋台灣的街道，又或者點選地圖來標記位置。',
      placement: 'bottom'
    },
  ]

  return (
    <Guide
      localKey={LOCAL_KEY}
      steps={steps}
      stepText={() => { }}
      nextText='下一步'
      okText='開始使用'
      onClose={handleGuideEnd}
    />
  )
}

export default UserGuide