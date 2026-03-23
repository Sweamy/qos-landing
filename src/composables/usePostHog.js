import posthog from 'posthog-js'

let initialized = false

export function initPostHog() {
  if (initialized) return
  initialized = true

  posthog.init('phc_lrANNGPiivdFUs3t6fwh7UiraDYuoZLaHGAGwdlTdh9', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,
    persistence: 'localStorage',
  })
}

export function capture(event, properties = {}) {
  if (!initialized) initPostHog()
  posthog.capture(`landing_${event}`, properties)
}

export function identify(distinctId, properties = {}) {
  if (!initialized) initPostHog()
  posthog.identify(distinctId, properties)
}
