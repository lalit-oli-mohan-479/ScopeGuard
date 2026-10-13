import type { ScopeAnalysisResponse } from '../types'

/**
 * Generates a clean, comprehensive Markdown report from analysis results.
 */
export function generateMarkdownReport(
  analysis: ScopeAnalysisResponse,
  _activeReplyStyle: 'friendly' | 'professional' | 'direct' = 'professional'
): string {
  const dateFormatted = new Date(analysis.analyzed_at).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const { summary, findings, suggested_replies } = analysis

  let md = `# ScopeGuard Scope Creep Audit: ${analysis.project_title}\n\n`
  md += `> **Audit Date:** ${dateFormatted}  \n`
  md += `> **Model Used:** ${analysis.model_used} (Local Inference)  \n`
  md += `> **Audit ID:** \`${analysis.id}\`  \n`
  if (analysis.is_demo) {
    md += `> **Notice:** Generated from verified demo scenario data.  \n`
  }
  md += `\n---\n\n`

  md += `## 1. Executive Summary\n\n`
  md += `${summary.overview}\n\n`

  md += `| Metric | Value |\n`
  md += `| :--- | :--- |\n`
  md += `| **Overall Risk Level** | **${summary.overall_risk_level.toUpperCase()}** |\n`
  md += `| **Requires Scope Change / Add-On** | **${summary.requires_scope_change ? 'YES (Action Needed)' : 'NO (Within Scope)'}** |\n`
  md += `| **Total Items Evaluated** | ${summary.total_findings} |\n`
  md += `| **Potentially Out of Scope** | ${summary.out_of_scope_count} |\n`
  md += `| **Included / Reasonable Details** | ${summary.included_count} |\n`
  md += `| **Uncertain / Needs Clarification** | ${summary.uncertain_count} |\n\n`

  md += `## 2. Detailed Findings & Evidence\n\n`

  findings.forEach((item, index) => {
    const classificationBadge =
      item.classification === 'potentially_out_of_scope'
        ? '[OUT OF SCOPE]'
        : item.classification === 'included'
        ? '[INCLUDED]'
        : '[UNCERTAIN]'

    md += `### ${index + 1}. ${classificationBadge} ${item.title}\n\n`
    md += `- **Classification:** \`${item.classification}\`\n`
    md += `- **Confidence Score:** ${item.confidence_score}%\n`
    md += `- **Client Request Excerpt:**\n`
    md += `  > "${item.client_request_excerpt}"\n\n`

    if (item.original_scope_reference) {
      md += `- **Original Scope Reference:**\n`
      md += `  > "${item.original_scope_reference}"\n\n`
    } else {
      md += `- **Original Scope Reference:** *None found in original agreement text.*\n\n`
    }

    md += `- **Analysis & Explanation:**  \n  ${item.explanation}\n\n`
    md += `- **Recommended Action:**  \n  **${item.suggested_action}**\n\n`
    md += `---\n\n`
  })

  md += `## 3. Recommended Client Reply Drafts\n\n`

  md += `### Option A: Friendly & Collaborative\n\n`
  md += `\`\`\`text\n${suggested_replies.friendly}\n\`\`\`\n\n`

  md += `### Option B: Professional & Firm (Selected Default)\n\n`
  md += `\`\`\`text\n${suggested_replies.professional}\n\`\`\`\n\n`

  md += `### Option C: Short & Direct\n\n`
  md += `\`\`\`text\n${suggested_replies.direct}\n\`\`\`\n\n`

  md += `\n---\n`
  md += `*Report generated locally by ScopeGuard for Hacktoberfest 2026. Confidential freelance project document.*  \n`

  return md
}

/**
 * Triggers a browser file download for text content.
 */
export function downloadMarkdownFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
