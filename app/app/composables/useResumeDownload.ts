export function useResumeDownload() {
  const resumeRequested = inject('resumeRequested') as Ref<number> | undefined

  function triggerResume() {
    if (resumeRequested) {
      resumeRequested.value++
    } else {
      doDirectDownload()
    }
  }

  function doDirectDownload() {
    const link = document.createElement('a')
    link.href = '/zaid_resume.pdf'
    link.download = 'zaid_ajo_resume.pdf'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    triggerResume,
  }
}
