// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      options: {customProperties: true},
      light: {
        colors: {
          background: '#F7F7F7',
          surface: '#FFFFFF',
        }
      },
      dark: {
        colors: {
          background: '#18181c',
          surface: '#44444c',
        }
      }
    }
  },
  defaults: {
    VBtn: {
      density: 'comfortable'
    },
    VTextField: {
      density: 'compact',
      rounded: 'lg',
      variant: 'solo',
    },
    VSelect: {
      density: 'compact',
      rounded: 'lg',
      variant: 'solo',
    },
    VAutocomplete: {
      density: 'compact',
      rounded: 'lg',
      variant: 'solo',
    },
    VToolbar: {
      color: 'transparent',
    },
    VDataTableServer: {
      density: 'comfortable',
    },
    VChip: {
      size: 'small',
    },
  }
}
)
