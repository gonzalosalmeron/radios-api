import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'

// COUNTRY ENDPOINTS
const country = new Hono()
country.get('/getAll', (c) => c.redirect('/db/countries/all.json'))
country.get('/:country', (c) => c.redirect(`/countries/${c.req.param('country')}.json`))

// API ROUTES
const app = new Hono()
app.route('/country', country)
app.get('/*', serveStatic({ root: './' }))

app.get('/', (c) => c.json([
  {
    url: '/country/:country',
    description: 'Returns all cities from'
  }
]))
export default app
