import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  SETTINGS_UNITS_IMPERIAL,
  SETTINGS_UNITS_METRIC
} from '../users/constants'
import { updateUnits } from '../users/localization'
import { changeLocale } from '../store/slices/locale'
import { clearMenus } from '../store/slices/menus'
import { ICON_CHECK } from '../ui/icons'
import LocaleSelect from './LocaleSelect'
import Menu from './Menu'

function SettingsMenu (props) {
  const units = useSelector((state) => state.street.units)
  const locale = useSelector((state) => state.locale.locale)
  const requestedLocale = useSelector((state) => state.locale.requestedLocale)
  const enableLocaleSettings = useSelector(
    (state) =>
      state.flags.LOCALES_LEVEL_1.value ||
      state.flags.LOCALES_LEVEL_2.value ||
      state.flags.LOCALES_LEVEL_3.value
  )
  const dispatch = useDispatch()

  async function selectLocale (newLocale) {
    if (locale === newLocale) return

    await dispatch(changeLocale(newLocale))

    // Hide the menu after a locale is selected.
    // Note: because the application's tree is actually remounted with new
    // locale context, the menu doesn't animate away. It just disappears.
    // We still have to dispatch the clearMenus() so that the Redux store
    // knows that the menu has closed.
    dispatch(clearMenus())
  }

  function handleSelectMetric () {
    if (units === SETTINGS_UNITS_METRIC) return

    updateUnits(SETTINGS_UNITS_METRIC)
    dispatch(clearMenus())
  }

  function handleSelectImperial () {
    if (units === SETTINGS_UNITS_IMPERIAL) return

    updateUnits(SETTINGS_UNITS_IMPERIAL)
    dispatch(clearMenus())
  }

  // TODO: ARIA roles and attributes have been added to help with
  // testing, but these are not actually to accessible spec
  return (
    <Menu {...props}>
      {enableLocaleSettings && (
        <>
          <h2 className="menu-header" id="settings-menu-language-select">
            <FormattedMessage
              id="settings.language.label"
              defaultMessage="Language"
            />
          </h2>
          <LocaleSelect
            locale={locale}
            requestedLocale={requestedLocale}
            selectLocale={selectLocale}
          />
        </>
      )}
    </Menu>
  )
}

export default SettingsMenu
