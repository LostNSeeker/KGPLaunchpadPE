export function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  
  export function parseJsonField<T = any>(value: string | null): T | null {
    if (!value) return null
    if (typeof value === "object") return value as T
    try {
      return JSON.parse(value) as T
    } catch {
      console.error("Invalid JSON field:", value)
      return null
    }
  }
  
  export function truncateText(text: string, maxLength: number): string {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }
  
  export function stripHtml(html: string): string {
    if (!html) return ""
    const tmp = typeof document !== 'undefined' ? document.createElement('div') : null
    if (tmp) {
      tmp.innerHTML = html
      const text = tmp.textContent || tmp.innerText || ""
      return text.replace(/\s+/g, ' ').trim()
    }
    // Fallback for non-DOM environments
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }

  export function excerptFromHtml(html: string, maxLength: number): string {
    return truncateText(stripHtml(html), maxLength)
  }
  