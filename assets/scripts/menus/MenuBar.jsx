import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { doSignIn } from '../users/authentication'
import { showDialog } from '../store/slices/dialogs'
import logo from '../../images/logo_horizontal.png'
import EnvironmentBadge from './EnvironmentBadge'
import MenuBarItem from './MenuBarItem'
import SignInButton from './SignInButton'
import AvatarMenu from './AvatarMenu'
import './MenuBar.scss'

MenuBar.propTypes = {
  onMenuDropdownClick: PropTypes.func.isRequired
}

function MenuBar(props) {
  const user = useSelector((state) => state.user.signInData?.details || null)
  const offline = useSelector((state) => state.system.offline)
  const streetName = useSelector((state) => state.street.name)
  const upgradeFunnel = useSelector(
    (state) => state.flags.BUSINESS_PLAN.value || false
  )
  const dispatch = useDispatch()
  const menuBarRightEl = useRef(null)

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)

    // StreetNameplateContainer needs to know the left position of the right
    // menu bar when it's mounted
    window.addEventListener('stmx:streetnameplate_mounted', handleWindowResize)

    // Clean up event listeners
    return () => {
      window.removeEventListener('resize', handleWindowResize)
      window.removeEventListener(
        'stmx:streetnameplate_mounted',
        handleWindowResize
      )
    }
  })

  /**
   * Handles clicks on <button> elements which result in a dropdown menu.
   * Pass in the name of this menu, and it returns (curries) a function
   * that handles the event.
   */
  function handleClickMenuButton(menu) {
    return (event) => {
      const el = event.target.closest('button')
      props.onMenuDropdownClick(menu, el)
    }
  }

  function handleWindowResize() {
    // Throw this event so that the StreetName can figure out if it needs
    // to push itself lower than the menubar
    window.dispatchEvent(
      new CustomEvent('stmx:menu_bar_resized', {
        detail: {
          rightMenuBarLeftPos: menuBarRightEl.current.getBoundingClientRect()
            .left
        }
      })
    )
  }

  function renderUserAvatar(user) {
    return user
      ? (
        <li>
          <AvatarMenu user={user} onClick={handleClickMenuButton('identity')} />
        </li>
      )
      : (
        <li>
          <SignInButton onClick={doSignIn} />
        </li>
      )
  }

  return (
    <nav className="menu-bar">
      <ul className="menu-bar-left">
        <li className="menu-bar-title">
          <img src={logo} alt="StreetDesign" className="menu-bar-logo" />
          <h1>StreetDesign</h1>
        </li>
        <MenuBarItem
          label="???????????????????????????"
          translation="???????????????????????????"
          url="#"
          onClick={() => dispatch(showDialog('WELCOME'))}
        />
        <MenuBarItem
          label="Help"
          translation="menu.item.help"
          onClick={handleClickMenuButton('help')}
        />
        <MenuBarItem
          label="Rate"
          translation="menu.item.rate"
          url="#"
          onClick={() => dispatch(showDialog('RATE'))}
        />
      </ul>
      <ul className="menu-bar-right" ref={menuBarRightEl}>
        <MenuBarItem
          label="Plan view"
          translation="menu.item.plan"
          url="#"
          onClick={() => {
            dispatch(showDialog('PLAN_VIEW'))
            console.log(streetName);
            localStorage.setItem('street-name', streetName);
          }}
        />
        <MenuBarItem
          label="3D mode"
          translation="menu.item.view"
          url="#"
          onClick={() => dispatch(showDialog('WHATS_NEW'))}
        />
        <MenuBarItem
          label="New street"
          translation="menu.item.new-street"
          url="/new"
          target="_blank"
        />
        <MenuBarItem
          label="Settings"
          translation="menu.item.settings"
          onClick={handleClickMenuButton('settings')}
        />
        <MenuBarItem
          label="Share"
          translation="menu.item.share"
          onClick={handleClickMenuButton('share')}
        />
        {!offline && renderUserAvatar(user)}
      </ul>
      <EnvironmentBadge />
    </nav>
  )
}

export default MenuBar
