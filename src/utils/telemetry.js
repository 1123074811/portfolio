/**
 * Privacy-First Cookieless Local Telemetry Engine (Vibe Analytics)
 * Logs developer interaction statistics locally to LocalStorage for zero-latency,
 * GDPR-compliant analytics. Features a visual developer console report.
 */

const TELEMETRY_KEY = 'vibe_portfolio_telemetry'

const getTelemetryData = () => {
  try {
    const raw = localStorage.getItem(TELEMETRY_KEY)
    return raw ? JSON.parse(raw) : {
      views: 0,
      pageViews: {},
      cardHovers: {},
      filterClicks: {},
      readmeToggles: {},
      formSubmissions: 0,
      lastActive: new Date().toISOString()
    }
  } catch (e) {
    return { views: 0, pageViews: {}, cardHovers: {}, filterClicks: {}, readmeToggles: {}, formSubmissions: 0 }
  }
}

const saveTelemetryData = (data) => {
  try {
    data.lastActive = new Date().toISOString()
    localStorage.setItem(TELEMETRY_KEY, JSON.stringify(data))
  } catch (e) {
    // Fail silently in incognito/private mode
  }
}

export const trackPageView = (pageName) => {
  const data = getTelemetryData()
  data.views++
  data.pageViews[pageName] = (data.pageViews[pageName] || 0) + 1
  saveTelemetryData(data)
  
  // Console logging for developer visibility
  console.log(`[Telemetry] PageView tracked: "${pageName}" (Total: ${data.pageViews[pageName]} views)`)
}

export const trackCardHover = (projectId) => {
  const data = getTelemetryData()
  data.cardHovers[projectId] = (data.cardHovers[projectId] || 0) + 1
  saveTelemetryData(data)
}

export const trackFilterClick = (category) => {
  const data = getTelemetryData()
  data.filterClicks[category] = (data.filterClicks[category] || 0) + 1
  saveTelemetryData(data)
  console.log(`[Telemetry] FilterClick tracked: "${category}"`)
}

export const trackReadmeToggle = (projectId, isRaw) => {
  const data = getTelemetryData()
  const key = `${projectId}:${isRaw ? 'raw' : 'preview'}`
  data.readmeToggles[key] = (data.readmeToggles[key] || 0) + 1
  saveTelemetryData(data)
  console.log(`[Telemetry] ReadmeToggle: ${projectId} -> ${isRaw ? 'RAW' : 'PREVIEW'}`)
}

export const trackFormSubmission = () => {
  const data = getTelemetryData()
  data.formSubmissions++
  saveTelemetryData(data)
  console.log(`[Telemetry] FormSubmitted! Total submissions: ${data.formSubmissions}`)
}

// Print a gorgeous telemetry summary in the browser console
export const dumpTelemetryReport = () => {
  const data = getTelemetryData()
  console.log(
    `%c💻 VIBE TELEMETRY REPORT %c\n` +
    `----------------------------------------\n` +
    `Total Page Views:       ${data.views}\n` +
    `Form Submissions:       ${data.formSubmissions}\n` +
    `Last Active Session:    ${new Date(data.lastActive).toLocaleString()}\n\n` +
    `Top Visited Projects:\n` +
    Object.entries(data.pageViews).map(([k, v]) => `  - ${k}: ${v} views`).join('\n') + `\n\n` +
    `Top Hovered Previews:\n` +
    Object.entries(data.cardHovers).map(([k, v]) => `  - ${k}: ${v} hovers`).join('\n') + `\n\n` +
    `Category Filters clicked:\n` +
    Object.entries(data.filterClicks).map(([k, v]) => `  - ${k}: ${v} clicks`).join('\n') + `\n` +
    `----------------------------------------`,
    'background: #7c3aed; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    'color: #7c3aed; font-weight: bold;'
  )
}

// Register report on window object for easy access in developer tools console
if (typeof window !== 'undefined') {
  window.vibeTelemetry = {
    report: dumpTelemetryReport,
    getRaw: getTelemetryData,
    clear: () => localStorage.removeItem(TELEMETRY_KEY)
  }
}
