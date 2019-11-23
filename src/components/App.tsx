import React, { Suspense } from "react"
import { Route, Switch } from "react-router-dom"
import { Helmet } from "react-helmet"
import { routes } from "lib/routes"
import { LoadingBar } from "components/common"

import { GOOGLE_AUTH_CLIENT_ID } from "constants/variables"

function App() {
  return (
    <>
      <Helmet htmlAttributes={{ lang: "en" }}>
        <title>Groundbe Backoffice</title>
        <meta name="description" content="Groundbe Backoffice" />
        <meta name="google-signin-client_id" content={GOOGLE_AUTH_CLIENT_ID} />
        <script async defer src="https://apis.google.com/js/platform.js" />
        <base href="/" />
      </Helmet>
      <Suspense fallback={<LoadingBar />}>
        <Switch>
          {routes.map(({ path, page, exact }, i) => (
            <Route
              exact={exact}
              path={path}
              component={page}
              key={`${path}_${i}`}
            />
          ))}
        </Switch>
      </Suspense>
    </>
  )
}

export default App
