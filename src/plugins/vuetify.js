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
        }
      },
      dark: {
        colors: {
          background: '#121212',
        }
      }
    }

  }
}
)
