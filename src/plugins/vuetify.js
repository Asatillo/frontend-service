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

  }
}
)
